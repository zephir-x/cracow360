import type { Language, TranslationDictionary } from '../i18n/types';

/// <summary>
/// Intelligently translates municipal facility names (e.g. from Open Data CSVs)
/// into the currently selected language while preserving numbers, patrons, and locations.
/// </summary>
export function localizePoiName(name: string, language: Language): string {
  if (!name) return '';
  if (language === 'pl') return name;

  if (language === 'en') {
    return name
      .replace(/Żłobek Samorządowy Nr\s*(\d+)/gi, 'Municipal Nursery No. $1')
      .replace(/Żłobek Samorządowy/gi, 'Municipal Nursery')
      .replace(/Żłobek Prywatny/gi, 'Private Nursery')
      .replace(/Żłobek na zlecenie GMK/gi, 'City-Contracted Nursery')
      .replace(/Przedszkole Samorządowe Nr\s*(\d+)/gi, 'Municipal Kindergarten No. $1')
      .replace(/Przedszkole Samorządowe/gi, 'Municipal Kindergarten')
      .replace(/Przedszkole Nr\s*(\d+)/gi, 'Kindergarten No. $1')
      .replace(/Szkoła Podstawowa Nr\s*(\d+)/gi, 'Primary School No. $1')
      .replace(/Szkoła Podstawowa/gi, 'Primary School')
      .replace(/Klub Rodziców:\s*/gi, 'Parent Club: ')
      .replace(/Klub Rodzica:\s*/gi, 'Parent Club: ')
      .replace(/Klub Dziecięcy:\s*/gi, 'Children Club: ')
      .replace(/Klub dziecięcy\s*/gi, 'Children Club ')
      .replace(/Basen przy SP\s*(\d+)/gi, 'Swimming Pool at Primary School $1')
      .replace(/Pływalnia OSiR/gi, 'OSiR Swimming Pool')
      .replace(/Pływalnia/gi, 'Swimming Pool')
      .replace(/Park miejski #(\d+)/gi, 'City Park #$1')
      .replace(/Park kieszonkowy #(\d+)/gi, 'Pocket Park #$1');
  }

  if (language === 'ua') {
    return name
      .replace(/Żłobek Samorządowy Nr\s*(\d+)/gi, 'Комунальні Ясла № $1')
      .replace(/Żłobek Samorządowy/gi, 'Комунальні Ясла')
      .replace(/Żłobek Prywatny/gi, 'Приватні Ясла')
      .replace(/Żłobek na zlecenie GMK/gi, 'Ясла на замовлення міста')
      .replace(/Przedszkole Samorządowe Nr\s*(\d+)/gi, 'Комунальний Дитсадок № $1')
      .replace(/Przedszkole Samorządowe/gi, 'Комунальний Дитсадок')
      .replace(/Przedszkole Nr\s*(\d+)/gi, 'Дитсадок № $1')
      .replace(/Szkoła Podstawowa Nr\s*(\d+)/gi, 'Початкова Школа № $1')
      .replace(/Szkoła Podstawowa/gi, 'Початкова Школа')
      .replace(/Klub Rodziców:\s*/gi, 'Клуб Батьків: ')
      .replace(/Klub Rodzica:\s*/gi, 'Клуб Батьків: ')
      .replace(/Klub Dziecięcy:\s*/gi, 'Дитячий Клуб: ')
      .replace(/Klub dziecięcy\s*/gi, 'Дитячий Клуб ')
      .replace(/Basen przy SP\s*(\d+)/gi, 'Басейн при Початковій Школі $1')
      .replace(/Pływalnia OSiR/gi, 'Басейн OSiR')
      .replace(/Pływalnia/gi, 'Басейн')
      .replace(/Park miejski #(\d+)/gi, 'Міський Парк № $1')
      .replace(/Park kieszonkowy #(\d+)/gi, 'Кишеньковий Парк № $1');
  }

  return name;
}

/// <summary>
/// Formats and localizes facility metadata such as capacity, operator, or surface area.
/// Prevents hardcoded Polish prefixes like "Pojemność:" or "Prowadzący:" from leaking into EN and UA.
/// </summary>
export function localizePoiAdditionalInfo(
  info: string | undefined | null,
  capacity: number | undefined | null,
  t: TranslationDictionary
): string | null {
  if (capacity != null && capacity > 0) {
    return `${t.parent.explorer.capacityPrefix} ${capacity}`;
  }

  if (!info) return null;

  const trimmed = info.trim();

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

  return trimmed;
}
