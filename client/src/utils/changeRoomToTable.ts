import { Room } from 'models';
import { ReactElement } from 'react';
import React from 'react';
import { twoNumber } from 'utils';

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
    const price =
      room.price >= 1000000
        ? `${room.price / 1000000}m`
        : `${room.price / 1000}k`;

    // 9 => 09
    const remain = twoNumber(room.remain);
    const total = twoNumber(room.total);

    const status = React.createElement(
      'span',
      {
        style: {
          background: room.remain > 0 ? '#19bb0b' : '#c90404',
          padding: '2px 8px',
          fontSize: 12,
          borderRadius: 15,
        },
      },
      `${remain}/${total}`
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
