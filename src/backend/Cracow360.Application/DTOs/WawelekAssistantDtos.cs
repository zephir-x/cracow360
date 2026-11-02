using System;
using System.Collections.Generic;

namespace Cracow360.Application.DTOs;

/// <summary>
/// Single message in the ephemeral Wawelek AI Assistant conversation history.
/// </summary>
public record WawelekChatMessageDto(
    string Role,
    string Content
);

/// <summary>
/// Client request payload sent to the Wawelek AI Assistant endpoint (/api/assistant/chat).
/// </summary>
public record WawelekChatRequestDto(
    string Message,
    IReadOnlyList<WawelekChatMessageDto>? History = null,
    string? ActiveTab = "resident",
    string? Language = "pl",
    int? SelectedDistrictId = null,
    bool EnableLiveContext = true
);

/// <summary>
/// Response payload returned by the Wawelek AI Assistant containing the reply,
/// mascot animation state trigger, suggested follow-up questions, and telemetry metadata.
/// </summary>
public record WawelekChatResponseDto(
    string Reply,
    string MascotState,
    IReadOnlyList<string> SuggestedFollowUps,
    bool IsAiPowered,
    bool UsedLiveCityContext,
    string ModelUsed,
    DateTime TimestampUtc
);

/// <summary>
/// Public metadata and configuration state for the Wawelek AI Assistant widget (/api/assistant/metadata).
/// </summary>
public record WawelekAssistantMetadataDto(
    string AssistantName,
    string AssistantRole,
    bool IsConfigured,
    string ConfiguredModel,
    int MaxCompletionTokens,
    IReadOnlyDictionary<string, IReadOnlyList<string>> SuggestedPromptsByTab
);
