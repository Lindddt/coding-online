import { StoreState } from './type';

export const getCurrentUser = (state: StoreState) => {
  return state.currentUser;
};
export const getUserImage = (state: StoreState) => state.userImage;
export const getLogin = (state: StoreState) => {
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
export const getEmail = (state: StoreState) => state.email;
export const getIdentity = (state: StoreState) => {
  return state.identity;
};
