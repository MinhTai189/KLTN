export const checkSizeImg = (files: FileList | null) => {
  if (!files) return;

  let result = true;

  for (let i = 0; i < files.length; i++) {
    if (files[i].size > 500 * 1024) {
      result = false;
      break;
    }
  }

  return result;
};
