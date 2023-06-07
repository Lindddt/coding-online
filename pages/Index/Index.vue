<template>
  <div :key="Keyall" class="body">
    <div id="software">
      <div class="header">
        <div class="nav">
          <ul @click="router_click">
            <li v-for="item in indexRouter" :key="item.id">
              <span :router="item.router">{{ item.text }}</span>
            </li>
          </ul>
        </div>
        <div class="user">
          <div v-show="isRegisterLoginShow" :key="Key1" class="register_login">
            <span class="nav-login" @click="clerk_login">登录</span>
            |
            <span class="nav-register" @click="clerk_register">注册</span>
          </div>
          <div v-show="isLoginUserShow" :key="Key2" class="login_user">
            <span @click="jump_msg">{{ userID }},</span> 你好
            <span @click="Login_out"> 退出登录</span>
          </div>
        </div>
      </div>

      <div v-show="isLoginShow" id="login_page" @mousewheel.prevent>
        <div id="login">
          <h1>欢迎使用</h1>

          <n-input ref="mail" v-model="mail" class="input_message" placeholder="输入邮箱" type="text" />
          <i :class="mail_icon" :style="mail_flag_get_style()" :title="mail_icon_title"></i>
          <n-input v-model="password" class="input_message" placeholder="输入密码" type="password" />
          <i :class="password_icon" :style="password_flag_get_style()" :title="password_icon_title"></i>
          <button class="cursor_register_login" :style="login_button_get_style()" @click="Login">登录</button>
          <span @click="clerk_register">邮箱注册</span>
        </div>
      </div>

      <div v-show="isRegisterShow" id="register_page" @mousewheel.prevent>
        <div id="register">
          <h1>邮箱注册</h1>
          <i class="icon-cross login_register_close" @click="login_register_close"></i>
          <n-input v-model="mail" class="input_message" placeholder="输入邮箱" type="text" />
          <i :class="mail_icon" :style="mail_flag_get_style()" :title="mail_icon_title"></i>

          <n-input v-model="nickname" class="input_message" placeholder="设置昵称" type="text" maxlength="8" />
          <i :class="nickname_icon" :style="nickname_flag_get_style()" :title="nickname_icon_title"></i>

          <n-input v-model="password" class="input_message" placeholder="设置密码" type="password" />
          <i :class="password_icon" :style="password_flag_get_style()" :title="password_icon_title"></i>

          <n-input v-model="password_repeat" class="input_message" placeholder="重复密码" type="password" />
          <i :class="password_repeat_icon" :style="password_repeat_flag_get_style()"
            :title="password_repeat_icon_title"></i>

          <n-input v-model="verification" class="verification input_message" placeholder="输入验证码" type="text" maxlength="6"
            oninput="value=value.replace(/\D/g,'')" />
          <button class="verification_send" :style="verification_send_get_style()" @click="getAuthCode">{{
            verification_send_content }}</button>

          <div class="identify_radio identify_radio1">
            <n-input id="identify1" v-model="userIdentity" class="identify" type="radio" name="identify" value="1"
              checked />
            <label for="identify1" class="identify_label">面试者</label>
          </div>
          <div class="identify_radio identify_radio2">
            <n-input id="identify2" v-model="userIdentity" class="identify" type="radio" name="identify" value="0" />
            <label for="identify2" class="identify_label">面试官</label>
          </div>
          <button class="cursor_register_login" :style="register_button_get_style()" @click="Register">注册</button>
          <span @click="clerk_login">密码登录</span>
        </div>
      </div>
      <router-view @Login_out="Login_out"></router-view>

    </div>
  </div>
</template>

<script setup>
  import axios from 'axios';
  import qs from 'qs';
  import { mapGetters } from 'vuex';
  import { mapMutations } from 'vuex';
  // import { userStatus } from '@/store/mutations';
  // import { identity } from '@/store/getters';
  import { NInput } from 'naive-ui';
  import { ref, beforeCreate } from 'vue';
  console.log('Hello from the homepage');
  const indexRouter = [
    {
      id: 0,
      text: '首页',
      router: '/'
    },
    {
      id: 1,
      text: '题目列表',
      router: '/problems_list'
    },
    {
      id: 2,
      text: '留言',
      router: '/message_board'
    },
  ];
  const isRegisterLoginShow = ref(true);
  const isLoginUserShow = ref(false);
  const isLoginShow = ref(false);
  const isRegisterShow = ref(false);
  const isMailCheckShow = ref(false);
  const mail_icon = ref('');
  const password_icon = ref('');
  const nickname_icon = ref('');
  const password_repeat_icon = ref('');
  const verification_icon = ref('');
  const mail = ref('');
  const nickname = ref('');
  const password = ref('');
  const password_repeat = ref('');
  const verification = ref('');
  const verification_send_content = ref('');
  const verificationFlag = ref('');
  const nickname_icon_title = ref('');
  const password_icon_title = ref('');
  const password_repeat_icon_title = ref('');
  const mail_icon_title = ref('');
  const userID = ref('');
  const userIdentity = ref('');
  const Keyall = ref('');
  const Key2 = ref('');
  const Key1 = ref('');

  beforeCreate(() => {
    $store.commit('checkLogin');

  });

  mounted(() => {

    $store.commit('checkLogin');
    if ($store.state.isLogin === true) {
      nickname = currentUser;
      isLoginShow = false;
      isRegisterLoginShow = false;
      isLoginUserShow = true;
      userID = currentUser;
    }
  });
  const router_click = (e) => {
    let dom = e.target;
    if (e.target.nodeName.toLowerCase() === 'span') {
      let router = dom.getAttribute('router');
      $router.push(router);
    }
  };
  const     jump_msg() {
    $router.push('/message_board');
  }
    methods: {
                ...mapMutations([
      'userStatus', // 将 `increment()` 映射为 `$store.commit('increment')`
    ]),



                ,
  clerk_login: function () {
    isLoginShow = true;
    isRegisterShow = false;
    mail = '';
    password = '';
    password_repeat = '';
    verification = '';
  },

  clerk_register: function () {
    isRegisterShow = true;
    isLoginShow = false;
    mail = '';
    password = '';
    password_repeat = '';
    verification = '';
  },

  login_register_close: function () {
    isRegisterShow = false;
    isLoginShow = false;
    mail = '';
    password = '';
    password_repeat = '';
    verification = '';
  },

  mail_flag_get_style: function () {
    if (mail.match(/^([a-zA-Z]|[0-9])(\w|)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/)) {
      mail_icon = 'icon-checkmark';
      mail_icon_title = '';
      return { display: 'inline' };
    } else if (mail.length > 0) {
      mail_icon = 'icon-cross';
      mail_icon_title = '不符合邮箱格式';
      return { display: 'inline' };
    } else {
      return { display: 'none' };
    }
  },

  nickname_flag_get_style: function () {
    if (nickname.match(/^[a-z0-9A-Z\u4e00-\u9fa5]+$/gi)) {
      nickname_icon = 'icon-checkmark';
      nickname_icon_title = '';
      return { display: 'inline' };
    } else if (nickname.length > 0) {
      nickname_icon = 'icon-cross';
      nickname_icon_title = '用户名只允许英文，数字和汉字组合';
      return { display: 'inline' };
    } else {
      return { display: 'none' };
    }
  },

  password_flag_get_style: function () {
    if (password.length >= 6) {
      password_icon = 'icon-checkmark';
      password_icon_title = '';
      return { display: 'inline' };
    } else if ((password.length < 6) && (password.length > 0)) {
      password_icon = 'icon-cross';
      password_icon_title = '密码位数至少为6位';
      return { display: 'inline' };
    } else {
      return { display: 'none' };
    }
  },

  password_repeat_flag_get_style: function () {
    if (password === password_repeat && password.length > 0) {
      password_repeat_icon = 'icon-checkmark';
      password_repeat_icon_title = '';
      return { display: 'inline' };
    } else if (password !== password_repeat && password_repeat.length > 0) {
      password_repeat_icon = 'icon-cross';
      password_repeat_icon_title = '重复密码不匹配';
      return { display: 'inline' };
    } else {
      return { display: 'none' };
    }
  },

  login_button_get_style: function () {
    if (mail_icon === 'icon-checkmark' && password.length > 0) {
      return {
        backgroundColor: 'rgba(46,181,61,1)',
        pointerEvents: 'auto',
      };
    } else {
      return {
        backgroundColor: 'rgba(196,196,196,1)',
        pointerEvents: 'none'
      };
    }
  },

  register_button_get_style: function () {
    if ((mail_icon === 'icon-checkmark') && (password_icon === 'icon-checkmark') && (password_repeat_icon === 'icon-checkmark') && verification.length === 6) {
      return {
        backgroundColor: 'rgba(46,181,61,1)',
        pointerEvents: 'auto',
      };
    } else {
      return {
        backgroundColor: 'rgba(196,196,196,1)',
        pointerEvents: 'none'
      };
    }
  },

  verification_send_get_style: function () {
    if (mail_icon === 'icon-checkmark' && verificationFlag === 1) {
      return {
        borderColor: 'rgba(46,181,61,1)',
        pointerEvents: 'auto',
        color: 'rgba(46,181,61,1)'
      };
    } else {
      return {
        borderColor: 'rgba(196, 196, 196, 1)',
        pointerEvents: 'none',
        color: 'rgba(196, 196, 196, 1)'
      };
    }
  },

  getAuthCode: function () {
    auth_time = 30;
    verificationFlag = 0;
    verification_send_content = String(auth_time) + '秒后重发';
    verification_send_get_style();
    axios({
      method: 'post',
      url: '/verificationcode',
      data:
        qs.stringify(
          {
            email: (mail),
          })
      ,
    })
      .then(res => {
        // 获取数据
        let bool = res.data.errcode;
        let auth_code = res.data.code;
        console.log(auth_code);
        if (res.data.errcode === 0) {
          console.log(res.data);
        }
        console.info(res);
        if (bool === 0) {
          $message({
            message: '获取验证码成功',
            type: 'success'
          });
        }
        else if (bool === 1) {
          Message.error('damedame');
        }
      })
      .catch((error) => {
        Message.error(error);
      });
    let auth_timeTimer = setInterval(() => {
      auth_time--;
      verification_send_content = String(auth_time) + '秒后重发';
      if (auth_time <= 0) {
        verification_send_content = '发送验证码';
        verificationFlag = 1;
        verification_send_get_style();
        clearInterval(auth_timeTimer);
      }
    }, 1000);
  },

  Login: function () {

    if (mail_icon === 'icon-checkmark' && password.length > 0) {
      axios.post('/login',
        qs.stringify({
          password: (password),
          email: (mail)
        })
      )
        .then(res => {
          // 获取数据
          /*            $message({
        message: res.data,
        type: 'success'
      }); */
          /* console.log(res.data) */
          if (res.data.errcode === 0) {
            nickname = res.data.nickname;
            isLoginShow = false;
            isRegisterLoginShow = false;
            isLoginUserShow = true;
            userID = nickname;

            userStatus({
              login: true,
              mail: mail,
              username: nickname,
              identity: res.data.identity,
            });

            /* console.log(currentUser); */
            /* console.log(email); */
            /*              $message({
            message: '登录成功',
            type: 'success'
          }); */

          } else if (res.data.errcode === 1) {
            Message.error('用户不存在');
          } else if (res.data.errcode === 2) {
            Message.error('密码错误');
          }
          else if (res.data.errcode === 3) {
            Message.error('数据库错误');
          }

        })
        .catch((error) => {
          Message.error(error);
        });

    }
  },


  Register: function () {
    axios({
      method: 'post',
      url: '/register',
      data:
        qs.stringify(
          {
            password: (password),
            email: (mail),
            username: (nickname),
            verificationcode: (verification),
            identity: (userIdentity),
          })
    })
      .then(res => {
        // 获取数据
        if (res.data.errcode === 0) {


          isRegisterShow = false;
          isRegisterLoginShow = false;
          isLoginUserShow = true;
          userID = nickname;
          userStatus({
            login: true,
            mail: mail,
            username: nickname,
            identity: userIdentity,
          });
          console.log(currentUser);
          console.log(email);
          $message({
            message: '注册成功',
            type: 'success'
          });

        } else if (res.data.errcode === 1) {
          Message.error('用户已存在');
        } else if (res.data.errcode === 2) {
          Message.error('邮箱不正确');
        } else if (res.data.errcode === 3) {
          Message.error('验证码错误');
        } else if (res.data.errcode === 4) {
          Message.error('数据库操作错误');
        }
        else if (res.data.errcode === 5) {
          Message.error('用户名已存在');
        }


        console.info(res);
      })

      .catch((error) => {
        Message.error(error);
      });

  },
  Login_out: function () {
    axios({
      method: 'post',
      url: '/logout',

    })
      .then(res => {
        // 获取数据
        if (res.data.errcode === 0) {
          $message.success('退出登录');
        }
        else {
          Message.error('未知错误');
        }
      })
      .catch((error) => {
        Message.error(error);
      });
    userStatus({
      login: false,
    });
    nickname = '';
    isLoginShow = false;
    isRegisterLoginShow = true;
    isLoginUserShow = false;
    userID = '';
    Keyall++;
    Key1++;
    Key2++;


  },
    }
</script>
