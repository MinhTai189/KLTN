export const checkSizeImg = (files: FileList | null, size: number = 500) => {
  if (!files) return;

  let result = true;

  for (let i = 0; i < files.length; i++) {
    if (files[i].size > size * 1024) {
      result = false;
      break;
    }
  }

  return result;
};

export const checkSizeOneImg = (file: File | null, size: number = 500) => {
  if (!file) return;

  return file.size <= size * 1024;
};
