export const checkCommaLastString = (string: string) => {
  return string[string.length - 1] === ',' ? string : string + ',';
};
