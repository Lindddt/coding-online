<template>
  <div class="body">
    <div id="software">
      <div class="header">
        <div class="nav">
          <n-list @click="router_click">
            <n-list-item
              v-for="item in indexRouter"
              :key="item.id"
            >
              <span :router="item.router">{{ item.text }}</span>
            </n-list-item>
          </n-list>
        </div>
        <div class="user">
          <div
            v-show="isRegisterLoginShow"
            :key="Key1"
            class="register_login"
          >
            <span
              class="nav-login"
              @click="clerkLogin"
            >登录</span>
            |
            <span
              class="nav-register"
              @click="clerkRegister"
            >注册</span>
          </div>
          <div
            v-show="isLoginUserShow"
            :key="Key2"
            class="login_user"
          >
            <span @click="jump_msg">{{ userID }},</span> 你好
            <span @click="Login_out"> 退出登录</span>
          </div>
        </div>
      </div>

      <n-modal
        v-model:show="showModal"
        :on-after-leave="() => { showModal = false }"
      >
        <n-card
          style="width: 600px"
          title="模态框"
          size="huge"
          :bordered="false"
          role="dialog"
          aria-modal="true"
        >
          <custom-form
            :form-list="formConfigList"
            :on-submit="onSubmit"
            :confirm-text="modelType === 'login' ? '登录' : '注册'"
            label-placement="left"
          />
        </n-card>
      </n-modal>
      <router-view @Login_out="Login_out" />
    </div>
  </div>
</template>

<script setup lang='ts'>
  import axios from 'axios';
  // import { userStatus } from '@/store/mutations';
  // import { identity } from '@/store/getters';
  import { NInput, NList, NListItem, NModal, NCard } from 'naive-ui';
  import { ref } from 'vue';
  import qs from 'qs';
  import { sendMessage, Message } from '~/utils';
  import { FormFieldConfig } from '~/components';
  // import CustomForm from '~/components/Form/CustomForm.vue';
  import { CustomForm } from '#components';
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
  const mailIcon = ref('');
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
  const verificationFlag = ref(0);
  const nickname_icon_title = ref('');
  const password_icon_title = ref('');
  const password_repeat_icon_title = ref('');
  const mailIconTitle = ref('');
  const userID = ref('');
  const userIdentity = ref('');
  const Keyall = ref(1);
  const Key2 = ref(15);
  const Key1 = ref(35);
  const modelType = ref<'login' | 'register'>('login');
  const showModal = ref(false);
  const auth_time = ref(30);
  const formConfigList: FormFieldConfig[] = [
    {
      key: 'email',
      value: '',
      formType: 'input',
      label: '邮箱',
      placeholder: '请输入邮箱',
      type: 'text',
    },
    {
      key: 'password',
      value: '',
      formType: 'input',
      label: '密码',
      placeholder: '请输入密码',
      type: 'password',
    }
  ];

  const router_click = (e) => {
    console.log(e);

  };
  const jump_msg = () => {
    console.log('jump_msg');
  };
  const clerkLogin = () => {
    mail.value = '';
    password.value = '';
    password_repeat.value = '';
    verification.value = '';
    modelType.value = 'login';
    showModal.value = true;
    console.log('clerkLogin');
  };

  const clerkRegister = () => {
    mail.value = '';
    password.value = '';
    password_repeat.value = '';
    verification.value = '';
    modelType.value = 'register';
    showModal.value = true;
    console.log('clerkRegister');

  };
  const onSubmit = (formValue: Record<string, any>) => {
    if (modelType.value === 'login') {
      // Login();
      console.log('login', formValue);
    } else if (modelType.value === 'register') {
      // Register();
      console.log('register', formValue);
    }
  };

  const login_register_close = () => {
    isRegisterShow.value = false;
    isLoginShow.value = false;
    mail.value = '';
    password.value = '';
    password_repeat.value = '';
    verification.value = '';
  };

  const mail_flag_get_style = () => {
    if (mail.value.match(/^([a-zA-Z]|[0-9])(\w|)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/)) {
      mailIcon.value = 'icon-checkmark';
      mailIconTitle.value = '';
      return {
        display: 'inline'
      };
    } else if (mail.value.length > 0) {
      mailIcon.value = 'icon-cross';
      mailIconTitle.value = '不符合邮箱格式';
      return {
        display: 'inline'
      };
    } else {
      return {
        display: 'none'
      };

    }
  };
  const nickname_flag_get_style = () => {
    if (nickname.value.match(/^[a-z0-9A-Z\u4e00-\u9fa5]+$/gi)) {
      nickname_icon.value = 'icon-checkmark';
      nickname_icon_title.value = '';
      return {
        display: 'inline'
      };
    } else if (nickname.value.length > 0) {
      nickname_icon.value = 'icon-cross';
      nickname_icon_title.value = '用户名只允许英文，数字和汉字组合';
      return {
        display: 'inline'
      };
    } else {
      return {
        display: 'none'
      };
    }
  };

  const password_flag_get_style = () => {
    if (password.value.length >= 6) {
      password_icon.value = 'icon-checkmark';
      password_icon_title.value = '';
      return {
        display: 'inline'
      };
    } else if ((password.value.length < 6) && (password.value.length > 0)) {
      password_icon.value = 'icon-cross';
      password_icon_title.value = '密码位数至少为6位';
      return {
        display: 'inline'
      };
    } else {
      return {
        display: 'none'
      };
    }
  };

  const password_repeat_flag_get_style = () => {
    if (password.value === password_repeat.value && password.value.length > 0) {
      password_repeat_icon.value = 'icon-checkmark';
      password_repeat_icon_title.value = '';
      return {
        display: 'inline'
      };
    } else if (password.value !== password_repeat.value && password_repeat.value.length > 0) {
      password_repeat_icon.value = 'icon-cross';
      password_repeat_icon_title.value = '重复密码不匹配';
      return {
        display: 'inline'
      };
    } else {
      return {
        display: 'none'
      };
    }
  };

  const login_button_get_style = () => {
    if (mailIcon.value === 'icon-checkmark' && password.value.length > 0) {
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
  };

  const register_button_get_style = () => {
    if ((mailIcon.value === 'icon-checkmark') && (password_icon.value === 'icon-checkmark') && (password_repeat_icon.value === 'icon-checkmark') && verification.value.length === 6) {
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
  };

  const verification_send_get_style = () => {
    if (mailIcon.value === 'icon-checkmark' && verificationFlag.value === 1) {
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
  };

  const getAuthCode = () => {
    auth_time.value = 30;
    verificationFlag.value = 0;
    verification_send_content.value = String(auth_time) + '秒后重发';
    verification_send_get_style();
    axios({
      method: 'post',
      url: '/verificationcode',
      data:
        qs.stringify(
          {
            email: (mail),
          })
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
          sendMessage({
            message: '获取验证码成功',
            type: 'success'
          });
        } else if (bool === 1) {
          Message.error('damedame');
        }
      })
      .catch((error) => {
        Message.error(error);
      });
    let auth_timeTimer = setInterval(() => {
      auth_time.value--;
      verification_send_content.value = String(auth_time) + '秒后重发';
      if (auth_time.value <= 0) {
        verification_send_content.value = '发送验证码';
        verificationFlag.value = 1;
        verification_send_get_style();
        clearInterval(auth_timeTimer);
      }
    }, 1000);
  };

  const Login = () => {

    if (mailIcon.value === 'icon-checkmark' && password.value.length > 0) {
      axios.post(
        '/login',
        qs.stringify({
          password: (password),
          email: (mail)
        })
      )
        .then(res => {
          // 获取数据
          /*            sendMessage({
        message: res.data,
        type: 'success'
      }); */
          /* console.log(res.data) */
          if (res.data.errcode === 0) {
            nickname.value = res.data.nickname;
            isLoginShow.value = false;
            isRegisterLoginShow.value = false;
            isLoginUserShow.value = true;
            userID.value = nickname.value;

            userStatus({
              login: true,
              mail: mail,
              username: nickname,
              identity: res.data.identity,
            });

            /* console.log(currentUser); */
            /* console.log(email); */
            /*              sendMessage({
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
  };


  const Register = () => {
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


          isRegisterShow.value = false;
          isRegisterLoginShow.value = false;
          isLoginUserShow.value = true;
          userID.value = nickname.value;
          userStatus({
            login: true,
            mail: mail,
            username: nickname,
            identity: userIdentity,
          });

          sendMessage({
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

  };
  const Login_out = () => {
    axios({
      method: 'post',
      url: '/logout',

    })
      .then(res => {
        // 获取数据
        if (res.data.errcode === 0) {
          Message.success('退出登录');
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
    nickname.value = '';
    isLoginShow.value = false;
    isRegisterLoginShow.value = true;
    isLoginUserShow.value = false;
    userID.value = '';
    Keyall.value++;
    Key1.value++;
    Key2.value++;


  };

  const userStatus = ({ login, identity, username, mail }: { login?: any, identity?: any, username?: any, mail?: any }) => {
    console.log('userStatus');
  };
</script>

<style>
  @import "~/assets/stylus/style.css";
  @import "~/assets/css/all.css";
  @import "~/assets/css/nav.css";
</style>