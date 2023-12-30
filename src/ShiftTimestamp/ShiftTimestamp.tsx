import { saveToFile } from '../helpers';
import { Button } from '../components/Button';
import { OffsetControl } from './OffsetControl';
import { SRT_MIME_TYPE } from './constants';
import { useTextBlob, useOpenTextFile } from './hooks';
import { getTextWithUpdatedOffset } from './utils';

const PICKER_OPTIONS: FilePickerOptions = {
  types: [{ accept: { [SRT_MIME_TYPE]: ['.srt'] } }],
  excludeAcceptAllOption: true,
};

const OPEN_FILE_PICKER_OPTIONS: OpenFilePickerOptions = {
  ...PICKER_OPTIONS,
  multiple: false,
};

export function ShiftTimestamp() {
  const { file, text, openFile } = useOpenTextFile();
  const { textBlob, createTextBlob } = useTextBlob();

  const fileName = file?.name;

  const applyOffset = (offset: number) => {
    if (!text) return;
    const textWithUpdatedOffset = getTextWithUpdatedOffset(text, offset);
    createTextBlob(textWithUpdatedOffset);
  };

  const handleSaveFileClick = async () => {
    if (!textBlob) return;
    await saveToFile(textBlob, { ...PICKER_OPTIONS, suggestedName: fileName });
  };

  return (
    <div>
      <Button onClick={() => openFile(OPEN_FILE_PICKER_OPTIONS)}>Open .srt file</Button>

      {!!fileName && <div>{fileName}</div>}

      {!!file ? text ? <OffsetControl onApplyOffsetClick={applyOffset} /> : <div>Content is not available</div> : null}

      {!!textBlob && <Button onClick={handleSaveFileClick}>Save updated .srt file</Button>}
    </div>
  );
}
