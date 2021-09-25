export interface School {
  _id: string;
  name: string;
  codeName: string;

  [key: string]: any;
}

export interface SchoolDropdown {
  motels: { thumbnail: string; _id: string }[];
  district: string;
  _id: string;
  name: string;
  codeName: string;
}
