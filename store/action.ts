/* eslint-disable no-invalid-this */
import { Identity } from '~/types';
import { StoreState } from './type';
import { checkLogin } from '~/models';

export function setUserStatus(this: StoreState, user: {
  login: boolean;
  username: string;
  mail?: string;
  identity: Identity;
}) {

  if (user.login) {
    this.currentUser = user.username;
    this.isLogin = true;
    if (user.mail) {
      this.email = user.mail;
    }
    this.identity = user.identity;
    if (typeof (this.isLogin) === 'string') {
      if (this.isLogin === 'true') {
        this.isLogin = true;
      }
      else {
        this.isLogin = false;
      }
    }

  } else if (!user.login) {
    // 登出的时候，清空sessionStorage里的东西
    this.currentUser = '';
    this.isLogin = false;
    this.token = '';
    this.userImage = '';
    this.email = '';
    this.identity = -1;

  }
}


export function resetUserStatus(this: StoreState) {
  // 登出的时候，清空sessionStorage里的东西
  this.currentUser = '';
  this.isLogin = false;
  this.token = '';
  this.userImage = '';
  this.email = '';
  this.identity = -1;
}

export async function checkLoginStatus(this: StoreState) {
  try {
    console.log('checkLoginStatus');
    const res = await checkLogin();
    if (res.login) {
      this.isLogin = true;
      this.currentUser = res.username || '';
      this.identity = res.identity || -1;
    }
    else{
      this.isLogin = false;
    }
  } catch (error) {
    console.error(error);
  }
  // axios({
  //   method: 'post',
  //   url: '/login_check',
  // })
  //   .then((res: { data: { errcode: number; username: any; identity: string; }; }) => {
  //     //获取数据
  //     if (res.data.errcode === 0) {
  //       this.isLogin = true;
  //       this.user = res.data.username;
  //       this.identity = parseInt(res.data.identity);
  //     }
  //     else if (res.data.errcode === -1) {
  //       this.isLogin = false;
  //     }
  //   })
  //   .catch(function (error: any) {
  //     console.log(error)

  //   })
}

// export const userImageGet = (this: { userImage: null; }, imageUrl: null) => {
//   if (imageUrl) {
//     this.userImage = imageUrl;
//   } else if (imageUrl == null) {
//     this.userImage = null;
//   }
// }


// export const userToken = (this: { token: null; }, userToken: any) => {
//   if (userToken) {
//     this.token = userToken;
//   } else {
//     this.token = null;
//   }
// }


