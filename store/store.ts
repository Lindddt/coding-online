import { defineStore } from 'pinia';
import * as getters from './getters';
import axios from "axios";

export interface StoreI {
  currentUser: string;
  isLogin: string;
  token: string;
  userImage: string;// 用户头像
  email: string;
  identity: string;
}

const useStore = defineStore('counter', {
  state: (): StoreI => {
    return {
      currentUser: '',
      isLogin: 'false',
      token: '',
      userImage: '',// 用户头像
      email: '',
      identity: '-1',
    };
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    userStatus: (user: {
      login: boolean,
      mail: string,
      username: string,
      identity: string,
    }) => {
      if (user.login) {
        this.currentUser = user.username;
        this.isLogin = true;
        this.email = user.mail;
        this.identity = user.identity;
        if (typeof (this.isLogin) === 'string') {
          if (this.isLogin == 'true') {
            this.isLogin = true;
          }
          else {
            this.isLogin = false;
          }
        }

      } else if (!user.login) {
        // 登出的时候，清空sessionStorage里的东西
        this.currentUser = null;
        this.isLogin = false;
        this.token = '';
        this.userImage = '';
        this.email = '';
        this.identity = -1;

      }
    },
    userToken: (userToken: any) => {
      if (userToken) {
        this.token = userToken;
      } else {
        this.token = null;
      }
    },
    userImageGet: (imageUrl: null) => {
      if (imageUrl) {
        this.userImage = imageUrl;
      } else if (imageUrl === null) {
        this.userImage = null;
      }
    },
    checkLogin: () => {
      axios({
        method: 'post',
        url: '/login_check',
      })
        .then(res => {
          // 获取数据
          if (res.data.errcode === 0) {
            this.isLogin = true;
            this.user = res.data.username;
            this.identity = parseInt(res.data.identity, 10);
          }
          else if (res.data.errcode === -1) {
            this.isLogin = false;
          }
        })
        .catch((error) => {
          console.log(error);

        });
    },
  },
  getters,
});


export default useStore;
