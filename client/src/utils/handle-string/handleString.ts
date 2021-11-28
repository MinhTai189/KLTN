export const removeAccents = (str: string) => {
  return str
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export const removeFirstElement = (arr: Array<any>) => {
  return arr.reduce((arr, ele, index) => {
    if (index === 0) return arr;
    return arr.concat(ele);
  }, []);
};

export const twoNumber = (number: number) => {
  return number < 10 ? `0${number}` : number;
};
