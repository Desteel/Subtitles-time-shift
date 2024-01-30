export const SUBTITLES_MIME_TYPE = 'text/plain';

export const SUBTITLES_FILE_EXTENSIONS = {
  SRT: 'srt',
  VTT: 'vtt',
} as const;

export const PICKER_OPTIONS: FilePickerOptions = {
  types: [
    {
      accept: {
        [SUBTITLES_MIME_TYPE]: [`.${SUBTITLES_FILE_EXTENSIONS.SRT}`, `.${SUBTITLES_FILE_EXTENSIONS.VTT}`],
      },
    },
  ],
  excludeAcceptAllOption: true,
};

export const OPEN_FILE_PICKER_OPTIONS: OpenFilePickerOptions = {
  ...PICKER_OPTIONS,
  multiple: false,
};
