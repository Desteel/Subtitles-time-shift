import { useEffect, useState } from 'react';
import { splitTextByLineBreak } from '../../helpers';
import { VTTTimestampRange, checkIsVTTTimeStampRange } from '../../subtitles';

export type Part = {
  timestampRange?: string;
  textLines: string[];
};

const createEmptyPart = (): Part => {
  return { textLines: [] };
};

function createPartBuilder() {
  let part: Part = createEmptyPart();

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

function splitSubtitlesByParts(text: string): Part[] {
  const textLines = splitTextByLineBreak(text);
  const { length } = textLines;

  const parts: Part[] = [];
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

export function useSplittedSubtitles(subtitles?: string) {
  const [parts, setParts] = useState<Part[]>();

  useEffect(() => {
    if (!subtitles) return;
    setParts(splitSubtitlesByParts(subtitles));
  }, [subtitles]);

  return { parts };
}
