export const FIND_MOTEL_ID = '6173ba553c954151dcc8fdf7';
export const FIND_ROOMMATE_ID = '6173ba553c954151dcc8fdf8';
export const REVIEW_ID = '6173ba553c954151dcc8fdf9';

export const NAVIGATION_ROUTES = [
  {
    route: '/',
    name: 'Trang chủ',
  },
  {
    route: '/motels',
    name: 'Nhà trọ',
  },
  {
    route: '/posts',
    name: 'Bài viết',
  },
  {
    route: '/add-motel',
    name: 'Thêm nhà trọ',
  },
];

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
  subscribeGroups: 'subscribes',
  unsubscribeGroups: 'unsubscribes',
  newMessageGroups: 'new-message-all-group',
  subscribeGroup: 'subscribe-group',
  unsubscribeGroup: 'unsubscribe-group',
  newMessage: 'new-message-',
};

export const VALIDATOR_IMAGE = {
  accept: '.png, .jpg, .jpeg',
};

export const TYPE_MESSAGE = {
  text: 'text',
  image: 'image',
  gif: 'gif',
  link: 'link',
};

export const LIST_GIF = [
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037503/gif/giphy_nz5sds.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037503/gif/giphy_4_dbwroe.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037503/gif/giphy_3_yntilc.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037503/gif/giphy_2_zffz7s.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037503/gif/giphy_1_a6bvv9.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037502/gif/200w_yd2cnt.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037501/gif/200w_9_noy9cy.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037501/gif/200w_8_n4v0uo.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037501/gif/200w_7_u3icxb.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037501/gif/200w_6_jflnqf.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037501/gif/200w_5_mxp45y.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037500/gif/200w_4_jjbna8.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037501/gif/200w_3_iphuci.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037501/gif/200w_2_fon4cm.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037503/gif/200w_20_gppok5.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037501/gif/200w_1_eaek04.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037502/gif/200w_19_qgnhbb.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037502/gif/200w_18_lcidkc.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037502/gif/200w_17_ih4lcq.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037502/gif/200w_16_ubmzmm.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037502/gif/200w_15_zt5jde.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037502/gif/200w_14_gw6nyc.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037502/gif/200w_13_rs23ev.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037501/gif/200w_12_lcxfqn.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037501/gif/200w_11_rq1op3.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037502/gif/200w_10_jn89gw.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037500/gif/200_q1c4bw.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037500/gif/200_4_ym3rzu.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037500/gif/200_3_ghl87x.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037500/gif/200_2_blblt8.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037500/gif/200_1_nal93y.webp',
  'http://res.cloudinary.com/dpregsdt9/image/upload/v1641037500/gif/100_eh0qbf.webp',
];
