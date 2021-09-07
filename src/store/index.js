import { createStore, combineReducers, applyMiddleware } from 'redux';
import User from './User/index';
import thunk from 'redux-thunk'
const reducer = combineReducers({
  user: User
});

export default createStore(reducer, applyMiddleware(thunk));

