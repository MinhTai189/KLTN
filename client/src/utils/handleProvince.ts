import { Province } from 'models';
import { removeAccents, removeFirstElement } from 'utils';

const changeNameProvince = (name: string) => {
  const split: string[] = name.split(' ');
  const newName: string[] =
    removeAccents(split[0].toLocaleLowerCase()) === 'tinh'
      ? removeFirstElement(split)
      : split;
  return newName.join(' ');
};

export const mapProvinces = (provinces: Array<Province>) => {
  return provinces.map((province) => ({
    ...province,
    name: changeNameProvince(province.name),
  }));
};
