import { useState, useCallback } from 'react';
import { getFile } from '../../helpers';
import { SRT_MIME_TYPE } from '../constants';

export function useOpenTextFile() {
  const [file, setFile] = useState<File>();
  const [text, setText] = useState<string>();

  const openFile = useCallback(async (options?: OpenFilePickerOptions) => {
    try {
      const file = await getFile(options);

      if (file) {
        const fileText = await file.text();
        setFile(file);
        setText(fileText);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return { file, text, openFile };
}

export function useTextBlob() {
  const [textBlob, setTextBlob] = useState<Blob>();

  const createTextBlob = useCallback(async (text: string) => {
    const blob = new Blob([text], { type: SRT_MIME_TYPE });
    setTextBlob(blob);
  }, []);

  return { textBlob, createTextBlob };
}
