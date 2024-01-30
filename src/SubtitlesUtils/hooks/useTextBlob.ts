import { useState, useCallback } from 'react';
import { SUBTITLES_MIME_TYPE } from '../constants';

export function useTextBlob() {
  const [textBlob, setTextBlob] = useState<Blob>();

  const createTextBlob = useCallback(async (text: string) => {
    const blob = new Blob([text], { type: SUBTITLES_MIME_TYPE });
    setTextBlob(blob);
  }, []);

  return { textBlob, createTextBlob };
}
