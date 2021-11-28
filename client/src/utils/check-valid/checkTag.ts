import { PATTERN_USERNAME } from 'constant/constant';

export const checkTags = (tags: string[]) => {
  let isValid = true;

  tags.forEach((tag) => {
    if (!PATTERN_USERNAME.test(tag)) isValid = false;
  });

  return isValid;
};
