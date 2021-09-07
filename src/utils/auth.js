
const TOKEN_NAME = "token";

const getToken = () => localStorage.getItem(TOKEN_NAME)

const setToken = (token) => localStorage.setItem(TOKEN_NAME, token);

const removeToken = () => localStorage.removeItem(TOKEN_NAME);

const isAuth = () => !!getToken();

export {
  getToken, setToken, removeToken, isAuth
}