export async function getFile({ ...options }: OpenFilePickerOptions) {
  try {
    const [fileHandle] = await window.showOpenFilePicker(options);

    return await fileHandle.getFile();
  } catch (error) {
    console.error(error);
  }
}

export async function saveFile(data: FileSystemWriteChunkType, options?: SaveFilePickerOptions) {
  try {
    const fileSystemFileHandle = await window.showSaveFilePicker(options);
    const writableStream = await fileSystemFileHandle.createWritable();

    await writableStream.write(data);
    await writableStream.close();
  } catch (error) {
    console.error(error);
  }
}
