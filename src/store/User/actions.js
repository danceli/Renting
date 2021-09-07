import axios from '@/http/request';
import { setToken, removeToken, getToken } from '@/utils/auth';
import { SET_USER, REMOVE_USER } from '../actions';

export function setUserInfo(token) {
  return async dispatch => {
    setToken(token);
    const { data } = await axios.get("/user");
    if(data.status === 200) {
      dispatch({
        type: SET_USER,
        userInfo: data.body
      })
    } 
  }
}

export function unInstall() {
  return async dispatch => {
    const { data } = await axios.post('/user/logout');
    if(data.status === 200) {
      removeToken();
      dispatch({
        type: REMOVE_USER
      })
    }
  }
}