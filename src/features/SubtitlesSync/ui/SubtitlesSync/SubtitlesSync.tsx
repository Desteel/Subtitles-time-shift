import { Button } from 'shared/ui/Button';
import { getFileExtension } from 'shared/helpers';
import {
  OPEN_FILE_PICKER_OPTIONS,
  SUBTITLES_FILE_EXTENSIONS,
  SUBTITLES_MIME_TYPE,
} from 'shared/kernel/filePicker';
import { useOpenTextFile } from 'shared/hooks';
import './SubtitlesSync.css';
import { SubtitlesColumn } from '../SubtitlesColumn';
import { memo } from 'react';
import { useGetSubtitlesParts } from '../../core/getSubtitlesParts';

const SubtitlesColumnMemo = memo(SubtitlesColumn);

export type SubtitlesSyncProps = Partial<{
  className: string;
}>;

// TODO: fix bundler error `Cannot find name 'FileExtension'.`
function createPickerOptions({ fileExtension }: { fileExtension: `.${string}` }): FilePickerOptions {
  return {
    ...OPEN_FILE_PICKER_OPTIONS,
    types: [
      {
        accept: {
          [SUBTITLES_MIME_TYPE]: fileExtension,
        },
      },
    ],
  };
}

// TODO: Add extensions guard
export const subtitlesFileExtensions = new Set<string>(Object.values(SUBTITLES_FILE_EXTENSIONS));

export function SubtitlesSync({ className }: SubtitlesSyncProps) {
  const { file: sourceFile, text: sourceText, openFile: openSourceFile } = useOpenTextFile();
  const { file: syncFile, text: syncText, openFile: openSyncFile } = useOpenTextFile();

  const { parts: subtitlesSource } = useGetSubtitlesParts(sourceText);
  const { parts: subtitlesToSync } = useGetSubtitlesParts(syncText);

  const openSubtitlesSource = () => {
    openSourceFile(OPEN_FILE_PICKER_OPTIONS);
  };

  const openSubtitlesToSync = () => {
    if (!sourceFile) return;

    const fileExtension = getFileExtension(sourceFile.name);

    if (!subtitlesFileExtensions.has(fileExtension)) {
      throw new Error(`Invalid file extension: '${fileExtension}'.
      Available extensions: ${Object.values(SUBTITLES_FILE_EXTENSIONS).toString()}`);
    }
    openSyncFile(createPickerOptions({ fileExtension: `.${fileExtension}` }));
  };

  return (
    <div className={className}>
      <div className="grid2cl">
        <FileControl
          onClick={openSubtitlesSource}
          name="Open the source subtitles file"
          fileName={sourceFile?.name}
        />
        <FileControl
          onClick={openSubtitlesToSync}
          name="Open the subtitles file to sync"
          fileName={syncFile?.name}
          disabled={!sourceFile}
        />
      </div>

      {subtitlesSource && subtitlesToSync ? (
        <div className="grid2cl">
          <SubtitlesColumnMemo subtitles={subtitlesSource} />
          <SubtitlesColumnMemo subtitles={subtitlesToSync} />
        </div>
      ) : null}
    </div>
  );
}

export type FileControlProps = {
  name: string;
  onClick: () => void;
} & Partial<{
  disabled: boolean;
  fileName: string;
}>;

export function FileControl({ name, onClick, fileName, disabled }: FileControlProps) {
  return (
    <div>
      <Button onClick={onClick} disabled={disabled}>
        {name}
      </Button>

      {fileName && <span>{fileName}</span>}
    </div>
  );
}
