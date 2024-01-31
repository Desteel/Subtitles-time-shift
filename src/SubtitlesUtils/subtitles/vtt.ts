export const VTT_TIMESTAMP_SEPARATORS = {
  RANGE: ' --> ',
  PARTS: ':',
  MS: '.',
} as const;

const longTimestampRangeRegExp = /^\d+:\d+:\d+.\d+ --> \d+:\d+:\d+.\d+$/;

const shortTimestampRangeRegExp = /^\d+:\d+\.\d+ --> \d+:\d+\.\d+$/;

function checkIsLongTimeStampRange(text: string): boolean {
  return longTimestampRangeRegExp.test(text);
}

function checkIsShortTimeStampRange(text: string): boolean {
  return shortTimestampRangeRegExp.test(text);
}

export function checkIsVTTTimeStampRange(text: string): boolean {
  return checkIsLongTimeStampRange(text) || checkIsShortTimeStampRange(text);
}
checkIsVTTTimeStampRange.isLong = checkIsLongTimeStampRange;
checkIsVTTTimeStampRange.isShort = checkIsShortTimeStampRange;
