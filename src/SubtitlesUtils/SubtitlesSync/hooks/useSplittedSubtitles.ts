import { useEffect, useState } from 'react';
import { splitTextByLineBreak } from '../../helpers';
import { checkIsVTTTimeStampRange } from '../../subtitles';

export type Part = {
  timestamp?: string;
  textLines: string[];
};

const createEmptyPart = (): Part => {
  return { textLines: [] };
};

function createPartBuilder() {
  let part: Part = createEmptyPart();

  const checkIsFilled = () => {
    return !!(part.timestamp || part.textLines.length > 0);
  };

  const reset = () => {
    part = createEmptyPart();
  };

  const setTimestamp = (timestamp: string) => {
    part.timestamp = timestamp;
  };

  const addTextline = (textline: string) => {
    part.textLines.push(textline);
  };

  const getPart = () => {
    const result = part;
    reset();
    return result;
  };

  return { setTimestamp, addTextline, reset, checkIsFilled, getPart };
}

function splitSubtitlesByParts(text: string): Part[] {
  const textLines = splitTextByLineBreak(text);
  const { length } = textLines;

  const parts: Part[] = [];
  const partBuilder = createPartBuilder();

  const handleTimestamp = (timestamp: string) => {
    if (partBuilder.checkIsFilled()) {
      parts.push(partBuilder.getPart());
    }
    partBuilder.setTimestamp(timestamp);
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
