import { saveToFile } from '../helpers';
import { Button } from '../components/Button';
import { OffsetControl } from './OffsetControl';
import { SRT_MIME_TYPE } from './constants';
import { useTextBlob, useOpenTextFile } from './hooks';
import { getTextWithUpdatedOffset } from './utils';
import { OffsetCalculator } from './OffsetCalculator';
import { useState } from 'react';

const PICKER_OPTIONS: FilePickerOptions = {
  types: [{ accept: { [SRT_MIME_TYPE]: ['.srt'] } }],
  excludeAcceptAllOption: true,
};

const OPEN_FILE_PICKER_OPTIONS: OpenFilePickerOptions = {
  ...PICKER_OPTIONS,
  multiple: false,
};

export function ShiftTimestamp() {
  const [calculatedOffset, setCalculatedOffset] = useState(0);

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

  const renderOffsetControls = () => {
    if (!file) return null;

    if (!text) {
      return <div>Content is not available</div>;
    }

    return (
      <>
        <OffsetControl onApplyOffsetClick={applyOffset} />
        {!!calculatedOffset && <Button onClick={() => applyOffset(calculatedOffset)}>Apply calculated offset ({calculatedOffset})</Button>}
      </>
    );
  };

  return (
    <div>
      <OffsetCalculator calculatedOffset={calculatedOffset} onCalculateOffset={setCalculatedOffset} />

      <Button onClick={() => openFile(OPEN_FILE_PICKER_OPTIONS)}>Open .srt file</Button>

      {!!fileName && <div>{fileName}</div>}

      {renderOffsetControls()}

      {!!textBlob && <Button onClick={handleSaveFileClick}>Save updated .srt file</Button>}
    </div>
  );
}
