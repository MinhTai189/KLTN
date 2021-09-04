export const clearToken = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refeshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refeshToken');
};
