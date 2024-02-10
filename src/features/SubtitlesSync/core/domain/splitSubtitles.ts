import { VTTTimestampRange, checkIsVTTTimeStampRange } from 'shared/kernel/subtitles';
import { splitTextByLineBreak } from 'shared/helpers';

export type SubtitlesPart = {
  timestampRange?: string;
  textLines: string[];
};

const createEmptyPart = (): SubtitlesPart => {
  return { textLines: [] };
};

function createPartBuilder() {
  let part: SubtitlesPart = createEmptyPart();

  const checkIsFilled = () => {
    return !!(part.timestampRange || part.textLines.length > 0);
  };

  const reset = () => {
    part = createEmptyPart();
  };

  const setTimestampRange = (timestampRange: string) => {
    part.timestampRange = timestampRange;
  };

  const addTextline = (textline: string) => {
    part.textLines.push(textline);
  };

  const getPart = () => {
    const result = part;
    reset();
    return result;
  };

  return { setTimestampRange, addTextline, reset, checkIsFilled, getPart };
}

export function splitSubtitles(text: string): SubtitlesPart[] {
  const textLines = splitTextByLineBreak(text);
  const { length } = textLines;

  const parts: SubtitlesPart[] = [];
  const partBuilder = createPartBuilder();

  const handleTimestamp = (timestampRange: VTTTimestampRange) => {
    if (partBuilder.checkIsFilled()) {
      parts.push(partBuilder.getPart());
    }
    partBuilder.setTimestampRange(timestampRange);
  };

  for (let i = 0; i < length; i++) {
    const line = textLines[i];

    // TODO: Use strategy instead
    if (checkIsVTTTimeStampRange(line)) {
      handleTimestamp(line);
    } else {
      partBuilder.addTextline(line);
    }
  }

  return parts;
}
