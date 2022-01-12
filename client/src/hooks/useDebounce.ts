export const useDebounce = () => {
  let timeout: number;

  const debounce = (callback: any, deplay: number) => {
    timeout && window.clearTimeout(timeout);

    timeout = window.setTimeout(callback, deplay);
  };

  return debounce;
};
