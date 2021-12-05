export const calculateCreatedTime = (timeCreated: string) => {
  const periods = {
    năm: 365 * 30 * 24 * 60 * 60 * 1000,
    tháng: 30 * 24 * 60 * 60 * 1000,
    tuần: 7 * 24 * 60 * 60 * 1000,
    ngày: 24 * 60 * 60 * 1000,
    giờ: 60 * 60 * 1000,
    phút: 60 * 1000,
  };

  const time: any = new Date(timeCreated);
  const diff = Date.now() - time;

  for (const key in periods) {
    //@ts-ignore
    if (diff >= periods[key]) {
      //@ts-ignore
      const result = Math.floor(diff / periods[key]);
      return `${result} ${key} trước`;
    }
  }

  return 'Mới đây';
};

export const calculateCreatedTimeDMY = (date: string) => {
  const convertedDate = new Date(date);

  return convertedDate.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const calculateCreatedTimeHDMY = (date: string) => {
  const convertedDate = new Date(date);

  return convertedDate.toLocaleDateString('vi-VN', {
    hour: 'numeric',
    minute: 'numeric',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
