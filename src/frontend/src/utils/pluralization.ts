/**
 * Krakow360 Pluralization Utility
 * Provides linguistically accurate plural forms for Polish (and Ukrainian) Slavic grammar,
 * handling the three distinct numerical forms:
 * - Form 1 (singular): 1 (np. 1 placówka, 1 zbiór, 1 wypadek)
 * - Form 2 (paucal / few): 2, 3, 4, 22-24, 32-34... (np. 3 placówki, 2 zbiory, 4 wypadki)
 * - Form 3 (genitive plural / many): 0, 5-21, 25-31... (np. 0 placówek, 5 placówek, 12 placówek)
 */

export type PluralForms = [one: string, few: string, many: string];

/**
 * Returns the grammatical plural index for Slavic languages (Polish and Ukrainian).
 * @param count Number to evaluate
 * @returns 0 for singular, 1 for few/paucal, 2 for many/genitive
 */
export function getSlavicPluralIndex(count: number): 0 | 1 | 2 {
  const abs = Math.abs(Math.round(count));
  const mod10 = abs % 10;
  const mod100 = abs % 100;

  if (abs === 1) {
    return 0;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 1;
  }
  return 2;
}

/**
 * Formats a Polish noun according to the quantity provided.
 * @param count Numeric value
 * @param forms Tuple of [singular, few, many] (e.g. ['placówka', 'placówki', 'placówek'])
 * @returns The matching grammatical form
 */
export function formatPolishPlural(count: number, forms: PluralForms): string {
  const index = getSlavicPluralIndex(count);
  return forms[index];
}

/**
 * Formats a localized number along with its grammatical plural noun.
 * Example: formatWithPolishPlural(3, ['placówka', 'placówki', 'placówek']) -> "3 placówki"
 * Example: formatWithPolishPlural(5, ['placówka', 'placówki', 'placówek']) -> "5 placówek"
 */
export function formatWithPolishPlural(
  count: number,
  forms: PluralForms,
  locale: string = 'pl-PL'
): string {
  const formattedNumber = count.toLocaleString(locale);
  return `${formattedNumber} ${formatPolishPlural(count, forms)}`;
}
