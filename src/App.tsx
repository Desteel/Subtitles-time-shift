import { ChangeEventHandler, useRef, useState } from 'react';
import { getFile, saveToFile } from './helpers';
import { Button } from './components/Button';
import { getTextWithUpdatedOffset, offsetToMs } from './utils';
import { Input } from './components/Input';

const SRT_MIME_TYPE = 'text/plain';

const PICKER_OPTIONS: FilePickerOptions = {
  types: [{ accept: { [SRT_MIME_TYPE]: ['.srt'] } }],
  excludeAcceptAllOption: true,
};

const OPEN_FILE_PICKER_OPTIONS: OpenFilePickerOptions = {
  ...PICKER_OPTIONS,
  multiple: false,
};

function App() {
  const [file, setFile] = useState<File>();
  const [text, setText] = useState<string>();
  const [updatedTextBlob, setUpdatedTextBlob] = useState<Blob>();

  const offsetRef = useRef(0);

  const fileName = file?.name;

  const setOffset: ChangeEventHandler<HTMLInputElement> = (event) => {
    const offset = Number(event.target.value);
    if (Number.isInteger(offset)) {
      offsetRef.current = offsetToMs(offset);
    }
  };

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

  const handleApplyOffsetClick = async () => {
    if (text) {
      const textWithUpdatedOffset = getTextWithUpdatedOffset(text, offsetRef.current);

      const blob = new Blob([textWithUpdatedOffset], { type: SRT_MIME_TYPE });
      setUpdatedTextBlob(blob);
    }
  };

  const handleSaveFileClick = async () => {
    if (updatedTextBlob) {
      await saveToFile(updatedTextBlob, { ...PICKER_OPTIONS, suggestedName: fileName });
    }
  };

  return (
    <div>
      <Button onClick={handleOpenFileClick}>Open .srt file</Button>

      {!!file && (
        <>
          {!!fileName && <div>{fileName}</div>}
          <Input
            label='Enter offset in format "seconds.milliseconds"'
            placeholder="0.00"
            type="number"
            onChange={setOffset}
            defaultValue={offsetRef.current > 0 ? offsetRef.current : undefined}
          />
          <Button onClick={handleApplyOffsetClick}>Apply offset</Button>
        </>
      )}

      {!!updatedTextBlob && <Button onClick={handleSaveFileClick}>Save updated .srt file</Button>}
    </div>
  );
}

export default App;
