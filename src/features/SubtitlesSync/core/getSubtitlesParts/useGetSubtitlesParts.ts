import { useEffect, useState } from 'react';
import { type SubtitlesPart, splitSubtitles } from '../domain/splitSubtitles';

export function useGetSubtitlesParts(subtitles?: string) {
  const [parts, setParts] = useState<SubtitlesPart[]>();

  useEffect(() => {
    if (!subtitles) return;
    setParts(splitSubtitles(subtitles));
  }, [subtitles]);

  return { parts };
}
