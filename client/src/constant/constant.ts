export const FIND_MOTEL_ID = '6173ba553c954151dcc8fdf7';
export const FIND_ROOMMATE_ID = '6173ba553c954151dcc8fdf8';
export const REVIEW_ID = '6173ba553c954151dcc8fdf9';

// patterns
export const PATTERN_SYMBOL =
  /^[a-zA-Z_0123456789ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹếẾ:,@'()\n-; ]+$/i;
export const PATTERN_USERNAME = /^[a-zA-Z_0123456789._ ]+$/i;

export const SOCKET_EVENT = {
  connection: 'connection',
  authentication: 'auth',
  notification: 'notify',
  online: 'ononlines',
  motelActivities: 'motels',
  activities: 'activities',
  statisticals: 'statisticals',
};
