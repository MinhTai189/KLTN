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
          padding: '0 8px',
          borderRadius: '50%',
        },
      },
      `${remain}/${total}`
    );

    const area = `${room.area.length * room.area.width}m²`;
    const keys = Object.keys(room.optional);
    const values = Object.values(room.optional);

    const additional = values.reduce((arr: any, item: any, index: any) => {
      if (!!item) {
        const key = keys[index] as keyof Optional;
        arr.push(additionalString[key]);
      }
      return arr;
    }, []);

    return {
      _id: room._id,
      name: `Phòng trọ ${index + 1}:`,
      price: `${price}/tháng`,
      status,
      area,
      additional: additional.join(','),
    } as RoomTable;
  });

  return result;
};
