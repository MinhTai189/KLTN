import { PATTERN_USERNAME } from 'constant/constant';

export const checkTags = (tags: string[]) => {
  if (tags.length <= 0) return true;

  tags.forEach((tag) => {
    if (!PATTERN_USERNAME.test(tag)) return false;
  });

  return true;
};
