import { useState, useCallback } from 'react';
import { getFile, getFileExtension } from '../helpers';

export function useOpenTextFile() {
  const [file, setFile] = useState<File>();
  const [text, setText] = useState<string>();

  const fileName = file?.name;
  const fileExtension = fileName && getFileExtension(fileName);

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

  return { file, fileName, fileExtension, text, openFile };
}
