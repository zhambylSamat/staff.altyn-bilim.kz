const ID_TOKEN_KEY = "id_token";
const ID_REFRESH_KEY = "id_refresh";

export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

export const getRefresh = () => {
  return window.localStorage.getItem(ID_REFRESH_KEY);
};

export const saveToken = token => {
  window.localStorage.setItem(ID_TOKEN_KEY, token.access_token);
  window.localStorage.setItem(ID_REFRESH_KEY, token.refresh_token);
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
  window.localStorage.removeItem(ID_REFRESH_KEY);
};

export default { getToken, getRefresh, saveToken, destroyToken };
