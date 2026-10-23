import type { Language } from '../i18n/types';

/**
 * Localizes the official Polish district name prefix ('Dzielnica')
 * into English ('District') or Ukrainian ('Район').
 *
 * Example:
 * - localizeDistrictName('Dzielnica IV Prądnik Biały', 'en') -> 'District IV Prądnik Biały'
 * - localizeDistrictName('Dzielnica IV Prądnik Biały', 'ua') -> 'Район IV Prądnik Biały'
 * - localizeDistrictName('Dzielnica IV Prądnik Biały', 'pl') -> 'Dzielnica IV Prądnik Biały'
 */
export function localizeDistrictName(name: string | undefined | null, language: Language): string {
  if (!name) return '';
  if (language === 'en') {
    return name.replace(/^Dzielnica\s+/i, 'District ');
  }
  if (language === 'ua') {
    return name.replace(/^Dzielnica\s+/i, 'Район ');
  }
  return name;
}

/**
 * Extracts the colloquial short district name by removing the administrative prefix and Roman numeral.
 * Example: 'Dzielnica IV Prądnik Biały' -> 'Prądnik Biały'
 */
export function getShortDistrictName(name: string | undefined | null): string {
  if (!name) return '';
  return name.replace(/^(Dzielnica|District|Район)\s+[IVXLCDM]+\s+/i, '').trim();
}
