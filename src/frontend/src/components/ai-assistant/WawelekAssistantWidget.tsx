import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  Eye,
  EyeOff,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { cracow360Api } from '../../api/client';
import type { AppTabId } from '../layout/MainNavbar';
import { useTranslation } from '../../i18n/I18nContext';
import { getWawelekAssistantI18n } from '../../i18n/modules';
import type {
  WawelekChatMessageDto,
  WawelekMascotAnimationState,
} from '../../types/contracts';
import { WawelekMascotAvatar } from './WawelekMascotAvatar';

export interface WawelekAssistantWidgetProps {
  activeTab: AppTabId;
  selectedDistrictId?: number | null;
}

interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  usedLiveContext?: boolean;
}

/**
 * Lightweight, safe inline Markdown & URL renderer for Wawelek's responses.
 * Supports paragraphs, bullet lists (- or *), numbered lists, **bold** highlights, `code`, and clickable https:// links.
 */
function renderFormattedMessage(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const formatInlineTokens = (str: string, keyPrefix: string) => {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`|https?:\/\/[^\s)]+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={`${keyPrefix}-b-${idx}`} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={`${keyPrefix}-c-${idx}`}
            className="px-1.5 py-0.5 rounded-md bg-sky-100/80 text-sky-900 font-mono text-[11px] font-semibold"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('http://') || part.startsWith('https://')) {
        // Strip trailing punctuation if attached to URL
        const cleanUrl = part.replace(/[.,;!?]+$/, '');
        const trailingPunct = part.slice(cleanUrl.length);
        return (
          <span key={`${keyPrefix}-u-${idx}`}>
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:text-blue-800 underline decoration-blue-400/70 underline-offset-2 transition-colors break-all"
            >
              {cleanUrl}
            </a>
            {trailingPunct}
          </span>
        );
      }
      return part;
    });
  };

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={`list-${key}`} className="my-2 space-y-1.5 pl-4 list-disc marker:text-sky-600">
        {listItems.map((item, i) => (
          <li key={`li-${key}-${i}`} className="text-slate-700 leading-relaxed">
            {formatInlineTokens(item, `li-${key}-${i}`)}
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) {
      flushList(`empty-${index}`);
      return;
    }

    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      listItems.push(line.slice(2).trim());
      return;
    }

    const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      listItems.push(`${numberedMatch[1]}. ${numberedMatch[2]}`);
      return;
    }

    flushList(`p-${index}`);
    elements.push(
      <p key={`p-${index}`} className="my-1.5 leading-relaxed">
        {formatInlineTokens(line, `p-${index}`)}
      </p>
    );
  });

  flushList('final');
  return elements;
}

/**
 * Global AI Assistant Widget ("Wawelek" – The Blue Dragon of Kraków360).
 *
 * Key UX & Engineering Features:
 * 1. Modernist, glossy animated Floating Action Pill in the bottom-right viewport corner (`fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50`).
 * 2. Smooth fade-out right before the page footer enters the bottom area, disabling pointer events so footer links underneath are clickable.
 * 3. Smoothly hides when the user navigates back to the Start ('home') tab, while keeping conversation history in memory.
 * 4. Smooth expansion into a full interactive Chatbox with backdrop dimming (`backdrop-blur`) and an optional "Peek Page" toggle.
 * 5. Companion Mascot stage with 4 reactive states ('idle', 'listening', 'thinking', 'speaking').
 */
export function WawelekAssistantWidget({
  activeTab,
  selectedDistrictId,
}: WawelekAssistantWidgetProps) {
  const { language } = useTranslation();
  const i18n = useMemo(() => getWawelekAssistantI18n(language), [language]);

  // Open / collapsed state of the floating assistant modal
  const [isOpen, setIsOpen] = useState(false);

  // Whether the background page is dimmed when the chatbox is open
  const [dimBackdrop, setDimBackdrop] = useState(true);

  // Dynamic opacity (1 -> 0) that only starts fading right before the footer is reached
  const [footerProximityOpacity, setFooterProximityOpacity] = useState(1);

  // Ephemeral in-memory chat history (survives tab switches, clears on F5 refresh)
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Reactive mascot animation state machine ('idle' | 'listening' | 'thinking' | 'speaking')
  const [mascotState, setMascotState] = useState<WawelekMascotAnimationState>('idle');

  // Dynamic follow-up suggestions updated after each assistant turn
  const [customSuggestions, setCustomSuggestions] = useState<string[] | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const speakingTimerRef = useRef<number | null>(null);

  // Automatically close the expanded chatbox if the user returns to the Start ('home') tab
  useEffect(() => {
    if (activeTab === 'home' && isOpen) {
      setIsOpen(false);
    }
  }, [activeTab, isOpen]);

  // Monitor scroll position relative to the page footer so the floating trigger smoothly
  // fades to 0 right before the footer arrives, letting clicks pass straight through to footer links
  useEffect(() => {
    let rafId: number | null = null;

    const updateFooterProximity = () => {
      const footerEl = document.querySelector('footer');
      if (!footerEl) {
        setFooterProximityOpacity(1);
        return;
      }

      const rect = footerEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const distanceToFooterTop = rect.top - viewportHeight;
      const fadeZonePx = 110;

      if (distanceToFooterTop >= fadeZonePx) {
        setFooterProximityOpacity(1);
      } else if (distanceToFooterTop <= 0) {
        setFooterProximityOpacity(0);
      } else {
        const ratio = Math.max(0, Math.min(1, distanceToFooterTop / fadeZonePx));
        setFooterProximityOpacity(Number(ratio.toFixed(3)));
      }
    };

    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        updateFooterProximity();
        rafId = null;
      });
    };

    updateFooterProximity();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [activeTab]);

  // Automatically scroll to the newest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isSending, isOpen]);

  // Focus text input when opening chatbox
  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 180);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Clean up speaking animation timeout
  useEffect(() => {
    return () => {
      if (speakingTimerRef.current) {
        window.clearTimeout(speakingTimerRef.current);
      }
    };
  }, []);

  // Update mascot state when user types in the input box
  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (!isSending) {
      setMascotState(value.trim().length > 0 ? 'listening' : 'idle');
    }
  };

  // Determine suggested questions for the currently active tab
  const displayedSuggestions = useMemo(() => {
    if (customSuggestions && customSuggestions.length > 0) {
      return customSuggestions.slice(0, 3);
    }
    const tabPrompts =
      i18n.defaultPromptsByTab[activeTab] || i18n.defaultPromptsByTab.resident || [];
    return tabPrompts.slice(0, 4);
  }, [customSuggestions, i18n.defaultPromptsByTab, activeTab]);

  // Reset custom suggestions when user switches application tab so prompts stay contextually relevant
  useEffect(() => {
    setCustomSuggestions(null);
  }, [activeTab, language]);

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = (promptText ?? inputValue).trim();
    if (!textToSend || isSending) return;

    if (speakingTimerRef.current) {
      window.clearTimeout(speakingTimerRef.current);
    }

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const historyPayload: WawelekChatMessageDto[] = messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);
    setMascotState('thinking');

    try {
      const response = await cracow360Api.sendWawelekMessage({
        message: textToSend,
        history: historyPayload,
        activeTab,
        language,
        selectedDistrictId: selectedDistrictId ?? null,
        enableLiveContext: true,
      });

      const assistantMsg: ChatMessageItem = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        usedLiveContext: response.usedLiveCityContext,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (response.suggestedFollowUps && response.suggestedFollowUps.length > 0) {
        setCustomSuggestions(response.suggestedFollowUps);
      }

      setMascotState('speaking');
      speakingTimerRef.current = window.setTimeout(() => {
        setMascotState('idle');
      }, 4200);
    } catch {
      const errorMsg: ChatMessageItem = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: i18n.errorFallbackMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setMascotState('idle');
    } finally {
      setIsSending(false);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    setCustomSuggestions(null);
    setMascotState('idle');
    inputRef.current?.focus();
  };

  const currentStateLabel = i18n.mascotStates[mascotState];

  // Smoothly hide on the Start ('home') tab; on analytical tabs respect footer proximity fade
  const isHiddenOnHome = activeTab === 'home';
  const effectiveFabOpacity = isHiddenOnHome
    ? 0
    : isOpen
      ? 1
      : footerProximityOpacity;
  const isFabInteractive =
    !isHiddenOnHome && (isOpen || footerProximityOpacity > 0.12);

  return (
    <>
      {/* Dimmed & Blurred Backdrop Overlay when Chatbox is expanded */}
      {isOpen && dimBackdrop && !isHiddenOnHome && (
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-9980 bg-slate-950/45 backdrop-blur-[3px] transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Floating Root Container anchored to viewport bottom-right */}
      <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-9990 flex flex-col items-end pointer-events-none">
        {/* EXPANDED CHATBOX PANEL */}
        {isOpen && !isHiddenOnHome && (
          <section
            role="dialog"
            aria-label={i18n.headerTitle}
            className="pointer-events-auto mb-2 sm:mb-3 w-[calc(100vw-1.5rem)] sm:w-115 md:w-130 wawelek-chatbox-panel flex flex-col rounded-3xl bg-white/98 border border-sky-200/90 shadow-[0_25px_70px_-12px_rgba(10,46,101,0.48)] overflow-hidden wawelek-chatbox-enter"
          >
            {/* Top Royal Krakow Blue Header with Animated Mascot Companion Stage */}
            <header className="relative bg-linear-to-r from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white px-4 py-3.5 shrink-0 overflow-hidden">
              {/* Subtle ambient gloss */}
              <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-sky-300/20 blur-2xl" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Companion Mascot Avatar Stage (reacts to idle / listening / thinking / speaking) */}
                  <div className="relative rounded-2xl bg-white/15 p-1.5 border border-white/25 shadow-inner">
                    <WawelekMascotAvatar state={mascotState} size="md" />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a2e65] ${
                        mascotState === 'thinking'
                          ? 'bg-amber-400 animate-ping'
                          : mascotState === 'speaking'
                            ? 'bg-emerald-400'
                            : 'bg-sky-300'
                      }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-white truncate">
                        {i18n.headerTitle}
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-400/25 text-sky-100 border border-sky-300/30">
                        <Sparkles className="w-2.5 h-2.5" />
                        {i18n.mascotBadge}
                      </span>
                    </div>
                    <p className="text-[11px] text-sky-100/90 truncate mt-0.5">
                      {currentStateLabel}
                    </p>
                  </div>
                </div>

                {/* Header Utility Controls: Backdrop Dim Toggle, Reset Chat, Close */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setDimBackdrop((prev) => !prev)}
                    title={dimBackdrop ? i18n.backdropToggleOff : i18n.backdropToggleOn}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-sky-100 transition-colors cursor-pointer"
                  >
                    {dimBackdrop ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearConversation}
                      title={i18n.clearChatButton}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-sky-100 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label={i18n.closeChatAria}
                    className="p-2 rounded-xl bg-white/15 hover:bg-rose-500/80 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            {/* Ephemeral Session Info Bar */}
            <div className="bg-sky-50/90 border-b border-sky-100 px-4 py-1.5 flex items-center justify-between gap-2 text-[11px] text-slate-600 shrink-0">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                {i18n.ephemeralSessionNotice}
              </span>
              <span className="font-mono text-[10px] font-semibold text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded-md">
                #{activeTab}
              </span>
            </div>

            {/* Scrollable Messages Viewport */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-linear-to-b from-slate-50/70 via-white to-sky-50/30">
              {/* Initial Welcome Card from Wawelek */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-2xl bg-sky-100/80 p-1 border border-sky-200 shrink-0">
                  <WawelekMascotAvatar state="idle" size="sm" />
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-sm bg-white border border-sky-200/80 p-3.5 shadow-xs text-xs sm:text-[13px] text-slate-700">
                  <p className="font-extrabold text-slate-900 text-sm mb-1">
                    {i18n.welcomeGreetingTitle}
                  </p>
                  <div className="text-slate-700">
                    {renderFormattedMessage(i18n.welcomeGreetingBody)}
                  </div>
                </div>
              </div>

              {/* Conversation Turns */}
              {messages.map((msg) =>
                msg.role === 'user' ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[84%] rounded-2xl rounded-br-sm bg-linear-to-br from-[#1d4ed8] to-[#0284c7] text-white px-4 py-2.5 shadow-sm text-xs sm:text-[13px]">
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <span className="block text-[10px] text-sky-100/80 text-right mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex items-start gap-3 animate-fade-in">
                    <div className="mt-0.5 rounded-2xl bg-sky-100/80 p-1 border border-sky-200 shrink-0">
                      <WawelekMascotAvatar state="speaking" size="sm" />
                    </div>
                    <div className="max-w-[88%] flex-1 rounded-2xl rounded-tl-sm bg-white border border-slate-200/90 px-4 py-3 shadow-xs text-xs sm:text-[13px] text-slate-700">
                      <div className="space-y-1">{renderFormattedMessage(msg.content)}</div>
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="inline-flex items-center gap-1 font-semibold text-sky-700">
                          <Bot className="w-3 h-3" />
                          Wawelek AI
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* Loading / Thinking Indicator */}
              {isSending && (
                <div className="flex items-center gap-3 animate-fade-in">
                  <div className="rounded-2xl bg-sky-100 p-1 border border-sky-200 shrink-0">
                    <WawelekMascotAvatar state="thinking" size="sm" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-sky-50/90 border border-sky-200/80 px-4 py-3 text-xs text-sky-900 font-medium flex items-center gap-2.5 shadow-2xs">
                    <span className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce [animation-delay:-0.25s]" />
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:-0.12s]" />
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
                    </span>
                    <span>{i18n.sendingStatus}</span>
                  </div>
                </div>
              )}

              {/* Context-Aware Suggested Prompt Pills */}
              {!isSending && displayedSuggestions.length > 0 && (
                <div className="pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                    {i18n.suggestedQuestionsHeader}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {displayedSuggestions.map((prompt, idx) => (
                      <button
                        key={`${activeTab}-prompt-${idx}`}
                        type="button"
                        onClick={() => void handleSendMessage(prompt)}
                        className="text-left text-xs px-3 py-1.5 rounded-xl bg-sky-50/90 hover:bg-sky-100/90 text-sky-900 border border-sky-200/80 hover:border-sky-300 transition-all duration-200 font-medium cursor-pointer shadow-2xs hover:shadow-xs"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Prompt Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={i18n.inputPlaceholder}
                disabled={isSending}
                maxLength={1200}
                className="flex-1 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 placeholder:text-slate-400 px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isSending}
                className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-2xl bg-linear-to-r from-[#1d4ed8] to-[#0284c7] hover:from-[#1e40af] hover:to-[#0369a1] disabled:opacity-45 disabled:pointer-events-none text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{i18n.sendButton}</span>
              </button>
            </form>
          </section>
        )}

        {/* MODERNIST FLOATING ACTION BUTTON (FAB) WITH BEHIND-PILL GLOW, HOME FADE & FOOTER AUTO-FADE */}
        <div
          style={{
            opacity: effectiveFabOpacity,
            transform: isHiddenOnHome ? 'translate3d(0, 14px, 0) scale(0.95)' : 'translate3d(0, 0, 0) scale(1)',
            pointerEvents: isFabInteractive ? 'auto' : 'none',
          }}
          className="relative isolate group transition-all duration-400 ease-out"
        >
          {/* Blue glow layer placed strictly BEHIND the pill (-z-10) so it never brightens the button surface */}
          <span
            aria-hidden="true"
            className="wawelek-fab-outer-glow -z-10"
          />

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            tabIndex={isFabInteractive ? 0 : -1}
            className="relative z-10 flex items-center gap-2 sm:gap-3 pl-2 sm:pl-2.5 pr-3 sm:pr-4 py-2 rounded-full bg-linear-to-r from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white border border-sky-300/35 transition-transform duration-350 hover:scale-[1.03] active:scale-[0.98] cursor-pointer overflow-hidden wawelek-fab-pill"
          >
            {/* Subtle left-side sheen & gentle specular shimmer wave */}
            <span aria-hidden="true" className="wawelek-fab-left-glow" />
            <span aria-hidden="true" className="wawelek-fab-shimmer" />

            {/* Mini Blue Dragon Avatar inside the pill */}
            <div className="relative z-10 rounded-full bg-white/15 p-1 border border-white/30 shrink-0">
              <WawelekMascotAvatar state={isOpen ? 'speaking' : mascotState} size="sm" />
            </div>

            {/* Call-to-action label */}
            <div className="relative z-10 text-left pr-1">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[11px] sm:text-[13px] font-extrabold tracking-tight leading-none text-white">
                  {i18n.floatingBadgeTitle}
                </span>
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-200 animate-pulse" />
              </div>
              <span className="block text-[9px] sm:text-[11px] font-medium text-sky-100/95 leading-tight mt-0.5">
                {i18n.floatingBadgeSubtitle}
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
