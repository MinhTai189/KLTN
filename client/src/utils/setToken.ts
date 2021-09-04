export const setToken = (accessToken: string, refeshToken: string) => {
  if (Boolean(localStorage.getItem('accessToken'))) {
    localStorage.setItem('accessToken', JSON.stringify(accessToken));
    localStorage.setItem('refeshToken', JSON.stringify(refeshToken));
  } else {
    sessionStorage.setItem('accessToken', JSON.stringify(accessToken));
    sessionStorage.setItem('refeshToken', JSON.stringify(refeshToken));
  }
};
