export const setToken = (accessToken: string, refreshToken: string) => {
  if (Boolean(localStorage.getItem('accessToken'))) {
    localStorage.setItem('accessToken', JSON.stringify(accessToken));
    localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
  } else {
    sessionStorage.setItem('accessToken', JSON.stringify(accessToken));
    sessionStorage.setItem('refreshToken', JSON.stringify(refreshToken));
  }
};
