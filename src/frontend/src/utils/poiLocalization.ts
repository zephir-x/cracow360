import type { Language, TranslationDictionary } from '../i18n/types';

/// <summary>
/// Returns the official registered facility name without fragile regex distortions.
/// Categories and metadata are localized via their respective typed dictionaries.
/// </summary>
export function localizePoiName(name: string, _language?: Language): string {
  return name ? name.trim() : '';
}

/// <summary>
/// Formats and localizes facility metadata such as capacity, operator, or surface area.
/// Prevents hardcoded Polish prefixes like "Pojemność:", "Prowadzący:" or "Park miejski ZZM (8.24 ha)"
/// from leaking into EN and UA.
/// </summary>
export function localizePoiAdditionalInfo(
  info: string | undefined | null,
  capacity: number | undefined | null,
  t: TranslationDictionary,
  language?: Language
): string | null {
  if (capacity != null && capacity > 0) {
    return `${t.parent.explorer.capacityPrefix} ${capacity}`;
  }

  if (!info) return null;

  let trimmed = info.trim();

  // Match "Pojemność: 120" or "Miejsca: 167"
  const capacityMatch = trimmed.match(/^(?:Pojemność|Miejsca):\s*(\d+)/i);
  if (capacityMatch) {
    return `${t.parent.explorer.capacityPrefix} ${capacityMatch[1]}`;
  }

  // Match "Prowadzący: XYZ"
  const operatorMatch = trimmed.match(/^Prowadzący:\s*(.+)/i);
  if (operatorMatch) {
    return `${t.parent.explorer.operatorPrefix} ${operatorMatch[1]}`;
  }

  if (language === 'en') {
    trimmed = trimmed
      .replace(/Park miejski ZZM/gi, 'ZZM City Park')
      .replace(/Park kieszonkowy ZZM/gi, 'ZZM Pocket Park')
      .replace(/Ogród Krakowian ZZM/gi, 'ZZM Krakowian Garden');
  } else if (language === 'ua') {
    trimmed = trimmed
      .replace(/Park miejski ZZM/gi, 'Міський парк ZZM')
      .replace(/Park kieszonkowy ZZM/gi, 'Кишеньковий парк ZZM')
      .replace(/Ogród Krakowian ZZM/gi, "Сад Краків'ян ZZM")
      .replace(/\bha\b/gi, 'га');
  }

  return trimmed;
}
