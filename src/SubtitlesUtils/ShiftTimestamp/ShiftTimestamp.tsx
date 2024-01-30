import { getFileExtension, hasKeyIn, saveToFile } from '../../helpers';
import { Button } from '../../components/Button';
import { OffsetControl } from './OffsetControl';
import { OPEN_FILE_PICKER_OPTIONS, PICKER_OPTIONS, SUBTITLES_FILE_EXTENSIONS } from '../constants';
import { useTextBlob, useOpenTextFile } from '../hooks';
import { OffsetCalculator } from './OffsetCalculator';
import { useState } from 'react';
import { getSRTWithUpdatedOffset, getVTTWithUpdatedOffset } from './subtitles';

const SUBTITLES_OFFSET_UPDATERS = {
  [SUBTITLES_FILE_EXTENSIONS.SRT]: getSRTWithUpdatedOffset,
  [SUBTITLES_FILE_EXTENSIONS.VTT]: getVTTWithUpdatedOffset,
} as const;

// TODO: Add extensions guard
function getOffsetUpdater(fileExtension: string) {
  if (!hasKeyIn(SUBTITLES_OFFSET_UPDATERS, fileExtension)) {
    throw new Error(`Invalid file extension: '${fileExtension}'.
    Available extensions: ${Object.keys(SUBTITLES_OFFSET_UPDATERS).toString()}`);
  }
  return SUBTITLES_OFFSET_UPDATERS[fileExtension];
}

export type ShiftTimestampProps = Partial<{
  className: string;
}>;

export function ShiftTimestamp({ className }: ShiftTimestampProps) {
  const [calculatedOffset, setCalculatedOffset] = useState(0);

  const { file, text, openFile } = useOpenTextFile();
  const { textBlob, createTextBlob } = useTextBlob();

  const handleSaveFileClick = async (textBlob: Blob) => {
    await saveToFile(textBlob, { ...PICKER_OPTIONS, suggestedName: file?.name });
  };

  const renderOffsetControls = () => {
    if (!file) return null;

    if (!text) {
      return <div>Content is not available</div>;
    }

    const applyOffset = (offset: number) => {
      const getSubtitlesWithUpdatedOffset = getOffsetUpdater(getFileExtension(file.name));
      createTextBlob(getSubtitlesWithUpdatedOffset(text, offset));
    };

    return (
      <>
        <OffsetControl onApplyOffsetClick={applyOffset} />
        {!!calculatedOffset && <Button onClick={() => applyOffset(calculatedOffset)}>Apply calculated offset ({calculatedOffset})</Button>}
      </>
    );
  };

  return (
    <div className={className}>
      <OffsetCalculator calculatedOffset={calculatedOffset} onCalculateOffset={setCalculatedOffset} />

      <Button onClick={() => openFile(OPEN_FILE_PICKER_OPTIONS)}>Open the subtitles file</Button>

      {!!file?.name && <div>{file.name}</div>}

      {renderOffsetControls()}

      {!!textBlob && <Button onClick={() => handleSaveFileClick(textBlob)}>Save the updated subtitles file</Button>}
    </div>
  );
}
