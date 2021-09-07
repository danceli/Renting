import { SET_USER, REMOVE_USER } from '../actions';


function reducer(state = {
  isLogin: false,
  userInfo: {}
}, action) {
  switch(action.type) {
    case SET_USER:
      return {
        ...state,
        isLogin: true,
        userInfo: {...action.userInfo}
      }
      break;
    case REMOVE_USER:
      return {
        ...state,
        isLogin: false,
        userInfo: {}
      }
    default:
      return state;
      break;
  }
}


export default reducer