interface Token {
  accessToken: string | null;
  refreshToken: string | null;
}

export const getToken = (): Token => {
  const accessToken =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken');

  const refreshToken =
    localStorage.getItem('refreshToken') ||
    sessionStorage.getItem('refreshToken');

  return {
    accessToken: JSON.parse(accessToken as any),
    refreshToken: JSON.parse(refreshToken as any),
  };
};
