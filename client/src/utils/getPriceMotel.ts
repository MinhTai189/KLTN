import { Room } from 'models';

export const getPriceMotel = (data: Room[]) => {
  const prices = data.map((x) => x.price);

  let minPrice: number | string = Math.min(...prices);
  let maxPrice: number | string = Math.max(...prices);

  minPrice = mapPriceMonth(minPrice);
  maxPrice = mapPriceMonth(maxPrice);

  const result = minPrice === maxPrice ? maxPrice : `${minPrice}-${maxPrice}`;

  return result;
};

export const mapPriceMonth = (number: number) => {
  return number >= 1000000 ? `${number / 1000000}tr` : `${number / 1000}k`;
};
