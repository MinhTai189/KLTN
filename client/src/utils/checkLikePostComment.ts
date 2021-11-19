import { LikePost } from 'models';

export const checkLikePostComment = (arr: LikePost[], check: string) => {
  return arr.find((item) => item.owner._id === check);
};
