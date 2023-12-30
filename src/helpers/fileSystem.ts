export async function getFile(options?: OpenFilePickerOptions) {
  try {
    const [fileHandle] = await window.showOpenFilePicker(options);

    return await fileHandle.getFile();
  } catch (error) {
    console.error(error);
  }
}

export async function saveToFile(data: FileSystemWriteChunkType, options?: SaveFilePickerOptions) {
  try {
    const fileHandle = await window.showSaveFilePicker(options);
    const writableFileStream = await fileHandle.createWritable();

    await writableFileStream.write(data);
    await writableFileStream.close();
  } catch (error) {
    console.error(error);
  }
}
