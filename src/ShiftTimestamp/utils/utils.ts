import { checkIsTimeStampRange, shiftTimeStampRange } from './timestamp';

const SPLIT_SRT_TEXT_REGEXP = /\n/g;

export function getTextWithUpdatedOffset(text: string, offset: number): string {
  const splittedText = text.split(SPLIT_SRT_TEXT_REGEXP);

  const updatedParts = splittedText.map((part) => {
    if (checkIsTimeStampRange(part)) {
      return shiftTimeStampRange(part, offset);
    }
    return part;
  });

  return updatedParts.join('\n');
}
