import { createPinia } from 'pinia';
const pinia = createPinia();

export const userStatus = (user: {
  login: boolean,
  mail: string,
  username: string,
  identity: string,
}) => {
  if (user.login) {
    pinia.state.currentUser = user.username;
    state.isLogin = true;
    state.email = user.mail;
    state.identity = user.identity;
    if (typeof (state.isLogin) === 'string') {
      if (state.isLogin == 'true') {
        state.isLogin = true;
      }
      else {
        state.isLogin = false;
      }
    }

  } else if (!user.login) {
    // 登出的时候，清空sessionStorage里的东西
    state.currentUser = null;
    state.isLogin = false;
    state.token = '';
    state.userImage = '';
    state.email = '';
    state.identity = -1;

  }
};


export const checkLogin = (state) => {
  axios({
    method: 'post',
    url: '/login_check',
  })
    .then(res => {
      // 获取数据
      if (res.data.errcode === 0) {
        state.isLogin = true;
        state.user = res.data.username;
        state.identity = parseInt(res.data.identity, 10);
      }
      else if (res.data.errcode === -1) {
        state.isLogin = false;
      }
    })
    .catch((error) => {
      console.log(error);

    });
};

export const userImageGet = (state, imageUrl) => {
  if (imageUrl) {
    state.userImage = imageUrl;
  } else if (imageUrl === null) {
    state.userImage = null;
  }
};


export const userToken = (state, userToken) => {
  if (userToken) {
    state.token = userToken;
  } else {
    state.token = null;
  }
};


