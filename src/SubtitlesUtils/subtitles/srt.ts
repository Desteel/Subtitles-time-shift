export const SRT_TIMESTAMP_SEPARATORS = {
  RANGE: ' --> ',
  PARTS: ':',
  MS: ',',
} as const;

const timestampRangeRegExp = (() => {
  const segment = `\\d{2}:\\d{2}:\\d{2}${SRT_TIMESTAMP_SEPARATORS.MS}\\d+`;

  return new RegExp(`^${segment} --> ${segment}$`);
})();

export function checkIsTimeStampRange(text: string): boolean {
  return timestampRangeRegExp.test(text);
}
