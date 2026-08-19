export const GARDNER_VALID_KEYS = [
  'logical',
  'spatial',
  'linguistic',
  'interpersonal',
  'intrapersonal',
  'bodily',
  'musical',
  'naturalistic',
];

export function validateGardnerInput(topIntelligences?: string[]): string[] {
  if (!topIntelligences || !Array.isArray(topIntelligences)) {
    return [];
  }
  const warnings: string[] = [];
  topIntelligences.forEach((key) => {
    if (!GARDNER_VALID_KEYS.includes(key)) {
      warnings.push(
        `⚠️  کلید هوش "${key}" با هیچ‌کدام از کلیدهای معتبر (${GARDNER_VALID_KEYS.join(', ')}) مطابقت ندارد. ` +
        `این هوش در محاسبه‌ی gardnerScore هیچ مسیری اثر نخواهد گذاشت.`
      );
    }
  });
  return warnings;
}
