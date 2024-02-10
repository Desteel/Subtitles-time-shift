import { SubtitlesFileExtension } from '../filePicker';

export function getSubtitlesStrategy<Extension extends SubtitlesFileExtension, SchemeValue extends unknown>(
  extension: Extension,
  scheme: Record<SubtitlesFileExtension, SchemeValue>
) {
  return scheme[extension];
}
