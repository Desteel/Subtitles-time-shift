import { SUBTITLES_FILE_EXTENSIONS } from 'shared/kernel/filePicker';

const extensions = Object.values(SUBTITLES_FILE_EXTENSIONS).reduce(
  (acc, curr, index) => (acc += `.${curr}${index === 0 ? ', ' : ''}`),
  ''
);

export function Info() {
  return <p>Supported formats: {extensions}</p>;
}
