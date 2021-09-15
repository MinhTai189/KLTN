import { School } from 'models';

export const mapOptions = {
  school: (school: School[]) => {
    return school.map((x) => ({
      label: x.name,
      value: x.codeName,
    }));
  },
  schoolAutoComp: (school: School[]) => {
    return school.map((x) => ({
      ...school,
      label: x.name,
      key: x._id,
      value: x.codeName,
    }));
  },
};
