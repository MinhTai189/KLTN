export const numberToCurrency = {
  vi: (number: number) => {
    const formatter = new Intl.NumberFormat('vi');

    return formatter.format(number);
  },
};
