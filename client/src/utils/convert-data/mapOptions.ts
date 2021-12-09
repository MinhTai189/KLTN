import { District, Province, School } from 'models';

export const mapOptions = {
  school: (school: School[]) => {
    return school.map((x) => ({
      label: x.name,
      value: x.codeName,
    }));
  },
  autoComp: (listData: Province[] | District[] | School[]) => {
    //@ts-ignore
    return listData.map((x: any) => ({
      label: x.name,
      key: x._id,
      value: x.codeName,
    }));
  },
};
