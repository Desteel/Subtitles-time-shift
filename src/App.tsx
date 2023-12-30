import { useEffect, useState } from 'react';
import { getFile, saveFile } from './helpers';
import { Button } from './components/Button';

const PICKER_OPTIONS: FilePickerOptions = {
  types: [{ accept: { 'text/plain': ['.srt'] } }],
  excludeAcceptAllOption: true,
};

const OPEN_FILE_PICKER_OPTIONS: OpenFilePickerOptions = {
  ...PICKER_OPTIONS,
  multiple: false,
};

function App() {
  const [file, setFile] = useState<File>();
  const [text, setText] = useState('');

  const [updatedFile, setUpdatedFile] = useState<File>();

  const fileName = file?.name;

  console.log(file);

  // !Temp effect
  useEffect(() => {
    if (file) {
      setUpdatedFile(file);
    }
  }, [file]);

  const handleOpenFileClick = async () => {
    try {
      const file = await getFile(OPEN_FILE_PICKER_OPTIONS);

      if (file) {
        const fileText = await file.text();
        setFile(file);
        setText(fileText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveFileClick = async () => {
    if (!updatedFile) return;

    await saveFile(updatedFile, {
      ...PICKER_OPTIONS,
      suggestedName: fileName,
    });
  };

  return (
    <div>
      <Button onClick={handleOpenFileClick}>Open .srt file</Button>
      {fileName && <div>{fileName}</div>}
      {updatedFile && <Button onClick={handleSaveFileClick}>Save .srt file</Button>}
    </div>
  );
}

export default App;
