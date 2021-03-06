import { Room } from 'models';
import React, { ReactElement } from 'react';
import { mapPriceMonth } from '../getPriceMotel';

interface RoomTable {
  _id: string;
  name: string;
  price: string;
  status: ReactElement;
  area: string;
  additional: string;
}

interface Optional {
  wifi: string;
  ml: string;
  gac: string;
  nx: string;
  camera: string;
  quat: string;
  tl: string;
  giuong: string;
  gt: string;
  cc: string;
  dcvs: string;
}

const additionalString: Optional = {
  wifi: 'Wifi',
  ml: 'Máy lạnh',
  gac: 'Gác',
  nx: 'Nhà xe',
  camera: 'Camera',
  quat: 'Quạt',
  tl: 'Trên lầu',
  giuong: 'Giường',
  gt: 'Giường tầng',
  cc: 'Chung chủ',
  dcvs: 'Dụng cụ vệ sinh',
};

export const changeRoomToTable = (rooms: Room[]): RoomTable[] => {
  const result: RoomTable[] = rooms.map((room, index) => {
    const price = mapPriceMonth(room.price);

    const status = React.createElement(
      'span',
      {
        style: {
          background: room.remain > 0 ? '#52c41a' : '#ff4d4f',
          padding: '2px 8px',
          fontSize: 12,
          borderRadius: 15,
        },
        className: 'status',
      },
      `${room.remain}/${room.total}`
    );

    const area = `${room.area.length}m x ${room.area.width}m`;
    const keys = Object.keys(room.optional);
    const values = Object.values(room.optional);

    let additional = '';
    let indexAdditional = 0;

    values.forEach((item: any, index: any) => {
      if (!!item) {
        const key = keys[index] as keyof Optional;

        if (indexAdditional !== 0) additional += ', ';

        indexAdditional++;

        additional += additionalString[key];
      }
    });

    return {
      _id: room._id,
      name: `Phòng trọ ${index + 1}:`,
      price: `${price}/tháng`,
      status,
      area,
      additional,
    } as RoomTable;
  });

  return result;
};
