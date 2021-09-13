export const roundMark = (a: number) => {
  if (!a) return;
  const prefix = Math.floor(a);
  const suffixes = a % prefix <= 0.5 ? 0.5 : 1;

  return prefix + suffixes;
};
