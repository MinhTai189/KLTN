export const convertSecondIntoMS = (seconds: number) => {
  const minutes = Math.trunc(seconds / 60);
  seconds %= 60;

  return `${minutes > 0 ? `${minutes} phút ` : ''}${seconds} giây`;
};
