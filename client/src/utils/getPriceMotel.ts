import { Room } from 'models';

export const getPriceMotel = (data: Room[]) => {
  const prices = data.map((x) => x.price);

  let minPrice: number | string = Math.min(...prices);
  let maxPrice: number | string = Math.max(...prices);

  minPrice =
    minPrice >= 1000000 ? `${minPrice / 1000000}m` : `${minPrice / 1000}k`;
  maxPrice =
    maxPrice >= 1000000 ? `${maxPrice / 1000000}m` : `${maxPrice / 1000}k`;

  const result = minPrice === maxPrice ? maxPrice : `${minPrice}-${maxPrice}`;

  return result;
};
