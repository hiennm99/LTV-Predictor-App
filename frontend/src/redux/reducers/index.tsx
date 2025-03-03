import { combineReducers } from 'redux';
import UserReducer from '../slices/UserSlice';
import CheatDetailReducer from '../slices/LTVSlice';

const rootReducer = combineReducers({
  User: UserReducer,
  CheatDetail: CheatDetailReducer
});

export default rootReducer;
