import { StoreI } from './store';

export const currentUser = (state: StoreI) => {
  return state.currentUser;
};
export const userImage = (state: StoreI) => state.userImage;
export const isLogin = (state: StoreI) => {
  if (typeof state.isLogin === 'string') {
    if (state.isLogin === 'true') {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return state.isLogin;
  }

};
export const email = (state: StoreI) => state.email;
export const identity = (state: StoreI) => {
  return parseInt(state.identity, 10);
};
