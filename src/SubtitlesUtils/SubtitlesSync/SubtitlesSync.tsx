import { Button } from '../../components/Button';
import { getFileExtension } from '../../helpers';
import { OPEN_FILE_PICKER_OPTIONS, SUBTITLES_FILE_EXTENSIONS, SUBTITLES_MIME_TYPE } from '../constants';
import { useOpenTextFile } from '../hooks';
import cn from 'classnames';
import './SubtitlesSync.css';

export type SubtitlesSyncProps = Partial<{
  className: string;
}>;

// TODO: fix `Cannot find name 'FileExtension'.`
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

export function SubtitlesSection({
  buttonText,
  content,
  onClick,
}: {
  buttonText: string;
  onClick: () => void;
  content?: string;
  disabled?: boolean;
}) {
  const splittedText = content?.split(/\n/g);

  return (
    <div>
      <Button onClick={onClick}>{buttonText}</Button>

      {splittedText ? (
        <div>
          {splittedText.map((line, index) => {
            if (!line) return <br />;
            return <div key={index}>{line}</div>;
          })}
        </div>
      ) : null}
    </div>
  );
}

// TODO: Add extensions guard
export const subtitlesFileExtensions = new Set<string>(Object.values(SUBTITLES_FILE_EXTENSIONS));

export function SubtitlesSync({ className }: SubtitlesSyncProps) {
  const { file: sourceFile, text: sourceText, openFile: openSourceFile } = useOpenTextFile();
  const { file: syncFile, text: syncText, openFile: openSyncFile } = useOpenTextFile();

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
    <div className={cn('container', className)}>
      <SubtitlesSection buttonText="Open the source subtitles file" content={sourceText} onClick={openSubtitlesSource} />
      <SubtitlesSection buttonText="Open the subtitles file to sync" content={syncText} onClick={openSubtitlesToSync} disabled={!sourceFile} />
    </div>
  );
}
