import { defineStore } from 'pinia';
import * as getters from './getters';
import { StoreState } from './type';
import { resetUserStatus, setUserStatus } from './action';

// https://dev.to/tao/adding-pinia-to-nuxt-3-2023-3l77
// https://github.com/vuejs/pinia/discussions/983


export const useStore = defineStore('counter', {
  state: (): StoreState => {
    return {
      currentUser: '',
      isLogin: false,
      token: '',
      userImage: '',// 用户头像
      email: '',
      identity: -1,
    };
  },
  // 也可以这样定义
  actions: {
    setUserStatus,
    resetUserStatus,
  },
  getters,
  persist: true,
});


export default useStore;
