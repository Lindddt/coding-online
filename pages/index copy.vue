<template>
  <div class="body">
    <div id="software">
      <div class="header">
        <div class="nav">
          <n-list>
            <n-list-item
              v-for="item in indexRouter"
              :key="item.id"
            >
              <NuxtLink :to="item.router">
                {{ item.text }}
              </NuxtLink>
            </n-list-item>
          </n-list>
        </div>
        <div class="user">
          <div
            v-show="!isLogin"
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
            v-show="isLogin"
            :key="Key2"
            class="login_user"
          >
            <span @click="toMessageBoard">{{ currentUser }},</span> 你好
            <span @click="logout"> 退出登录</span>
          </div>
        </div>
      </div>

      <n-modal
        v-model:show="showModal"
        :on-after-leave="() => { showModal = false }"
      >
        <n-card
          style="width: 600px"
          :title="modelType === 'login' ? '登录' : '注册'"
          size="huge"
          :bordered="false"
          role="dialog"
          aria-modal="true"
        >
          <custom-form
            ref="formRef"
            :form-list="formConfigList"
            :on-submit="onSubmit"
            :confirm-text="modelType === 'login' ? '登录' : '注册'"
            label-placement="left"
          />
        </n-card>
      </n-modal>
      <!-- <router-view @logout="logout" /> -->
    </div>
  </div>
</template>

<script setup lang='ts'>
  // import { userStatus } from '@/store/mutations';
  // import { identity } from '@/store/getters';
  import { NInput, NList, NListItem, NModal, NCard, FormItemRule } from 'naive-ui';
  import { ref, watchEffect, watch, h, resolveComponent } from 'vue';
  import qs from 'qs';
  import { sendMessage } from '~/utils';
  import { FormFieldConfig, FormRef } from '~/components';
  import * as models from '~/models';
  // import CustomForm from '~/components/Form/CustomForm.vue';
  import { CustomForm, VerificationCode } from '#components';
  // import { useFetch } from 'nuxt';
  import { Identity } from '~/types';
  import { useStore } from '~/store';
  import { storeToRefs } from 'pinia';
  console.log('Hello from the homepage');
  const store = useStore();

  const { identity, currentUser, isLogin, email } = storeToRefs(store);
  const VerificationCodeComp = resolveComponent('VerificationCode');
  const indexRouter = [
    {
      id: 0,
      text: '首页',
      router: {
        path: '/'
      }
    },
    {
      id: 1,
      text: '题目列表',
      router: {
        path: '/problems_list/problems_list'
      }
    },
    {
      id: 2,
      text: '留言',
      router: {
        path: '/message_board/message_board'
      }
    },
  ];

  const res = await $fetch('/api/hello');
  console.log(res);

  const isLoginShow = ref(false);
  const isRegisterShow = ref(false);
  const isMailCheckShow = ref(false);
  const formRef = ref<FormRef>();
  const mailIcon = ref('');
  const password_icon = ref('');
  const nickname_icon = ref('');
  const password_repeat_icon = ref('');
  const verification_icon = ref('');


  const verification = ref('');
  const verification_send_content = ref('');
  const verificationFlag = ref(0);
  const nickname_icon_title = ref('');
  const password_icon_title = ref('');
  const password_repeat_icon_title = ref('');
  const mailIconTitle = ref('');
  const userIdentity = ref('');
  const Keyall = ref(1);
  const Key2 = ref(15);
  const Key1 = ref(35);
  const modelType = ref<'login' | 'register'>('login');
  const showModal = ref(false);
  const auth_time = ref(30);


  const basicConfig: FormFieldConfig[] = [
    {
      key: 'email',
      value: '',
      formType: 'input',
      label: '邮箱',
      placeholder: '请输入邮箱',
      type: 'text',
      rule: {
        required: true,
        validator: (rule: FormItemRule, value: string) => {
          if (value.length === 0) {
            return new Error('邮箱不能为空');
          } else if (!value.match(/^([a-zA-Z]|[0-9])(\w|)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/)) {
            return new Error('请输入正确的邮箱地址');
          }
          return true;
        },
        trigger: 'input',
      }
    },
    {
      key: 'password',
      value: '',
      formType: 'input',
      label: '密码',
      placeholder: '请输入密码',
      type: 'password',
      rule: {
        required: true,
        validator: (rule: FormItemRule, value: string) => {
          if (value.length === 0) {
            return new Error('密码不能为空');
          } else if (value.length < 6) {
            return new Error('密码长度不能小于6位');
          }
          return true;
        },
        trigger: 'input',

      }
    },
  ];
  const formConfigList = ref<FormFieldConfig[]>(basicConfig);

  watch(modelType, () => {
    formConfigList.value = modelType.value === 'login' ? basicConfig : [
      {
        key: 'nickname',
        value: '',
        formType: 'input',
        label: '昵称',
        placeholder: '请输入昵称',
        type: 'text',
        rule: {
          required: true,
          validator: (rule: FormItemRule, value: string) => {
            if (value.length === 0) {
              return new Error('昵称不能为空');
            } else if (!value.match(/^[a-z0-9A-Z\u4e00-\u9fa5]+$/gi)) {
              return new Error('昵称只允许英文，数字和汉字组合');
            }
            return true;
          },
          trigger: 'input',
        }
      },
      ...basicConfig,
      {
        key: 'reenteredPassword',
        value: '',
        formType: 'input',
        label: '重复密码',
        placeholder: '请再次输入密码',
        type: 'password',
        rule: {
          required: true,
          validator: (rule: FormItemRule, value: string) => {
            // console.log(formRef.value?.formData?.password, 'formRef.value?.formData?.password', formRef.value?.formData)
            if (!value || value !== formRef.value?.formData?.password) {
              return new Error('两次输入密码不一致');
            }
            return true;
          },
          trigger: 'input',
        }
      },
      {
        label: '验证码',
        key: 'verificationCode',
        formType: 'custom',
        render: ({ formData, changeData, validate }) => h(VerificationCodeComp, {
          'formData': formData,
          'emailName': 'email',
          'itemKey': 'verificationCode',
          'changeData': changeData,
          'validate': validate,
        }),
        rule: {
          required: true,
          validator: (rule: FormItemRule, value: string) => {
            if (!value || value.length !== 6) {
              return new Error('请输入正确的验证码');
            }
            return true;
          },
        }
      },
      {
        key: 'userIdentity',
        value: Identity.Interviewee,
        formType: 'radio',
        label: '身份',
        options: [
          {
            label: '面试者',
            value: Identity.Interviewee
          },
          {
            label: '面试官',
            value: Identity.Interviewer
          },
        ],
      },
    ];
  });
  const router_click = (e: any) => {
    console.log(e);
    // this.$router.push("/message_board");

  };
  const toMessageBoard = () => {
    console.log('toMessageBoard');
    // this.$router.push("/message_board");

  };
  const clerkLogin = () => {
    // mail.value = '';
    // password.value = '';
    // password_repeat.value = '';
    verification.value = '';
    modelType.value = 'login';
    showModal.value = true;
    console.log('clerkLogin');

  };

  const clerkRegister = async () => {
    // mail.value = '';
    // password.value = '';
    // password_repeat.value = '';
    verification.value = '';
    modelType.value = 'register';
    showModal.value = true;
    console.log('clerkRegister');
    // await models.getVerificationCode({
    //   email: 'frost_lin@outlook.com'
    // });

  };
  const onSubmit = async (formValue: Record<string, any>) => {
    if (modelType.value === 'login') {
      Login(formValue);
      console.log('login', formValue);
    } else if (modelType.value === 'register') {
      await Register(formValue);


    }
  };
  const login_register_close = () => {
    isRegisterShow.value = false;
    isLoginShow.value = false;
    // mail.value = '';
    // password.value = '';
    // password_repeat.value = '';
    verification.value = '';
  };


  // const register_button_get_style = () => {
  //   if ((mailIcon.value === 'icon-checkmark') && (password_icon.value === 'icon-checkmark') && (password_repeat_icon.value === 'icon-checkmark') && verification.value.length === 6) {
  //     return {
  //       backgroundColor: 'rgba(46,181,61,1)',
  //       pointerEvents: 'auto',
  //     };
  //   } else {
  //     return {
  //       backgroundColor: 'rgba(196,196,196,1)',
  //       pointerEvents: 'none'
  //     };
  //   }
  // };

  // const verification_send_get_style = () => {
  //   if (mailIcon.value === 'icon-checkmark' && verificationFlag.value === 1) {
  //     return {
  //       borderColor: 'rgba(46,181,61,1)',
  //       pointerEvents: 'auto',
  //       color: 'rgba(46,181,61,1)'
  //     };
  //   } else {
  //     return {
  //       borderColor: 'rgba(196, 196, 196, 1)',
  //       pointerEvents: 'none',
  //       color: 'rgba(196, 196, 196, 1)'
  //     };
  //   }
  // };


  const Login = async (formValue: Record<string, any>) => {
    console.log('Login', formValue);
    try {
      const res = await models.login({
        email: formValue.email,
        password: formValue.password,
      });
      showModal.value = false;
      sendMessage.success('登陆成功');
      store.setUserStatus({
        login: true,
        username: res.nickname,
        identity: res.identity,
      });
    } catch (error) {
      console.error(error);
      const { message } = error as Error;
      sendMessage.error(String(message || '登陆失败'));
    }
  };


  const Register = async (formValue: Record<string, any>) => {
    console.log('register', formValue);
    try {
      const res = await models.register({
        email: formValue.email,
        password: formValue.password,
        verificationCode: formValue.verificationCode,
        identity: formValue.userIdentity,
        username: formValue.nickname,
      });
      showModal.value = false;
      sendMessage.success('注册成功');
      store.setUserStatus({
        login: true,
        mail: res.email,
        username: res.nickname,
        identity: res.identity,
      });
    } catch (error) {
      console.error(error);
      const { message } = error as Error;
      sendMessage.error(String(message || '注册失败'));
    }
  };
  const logout = async () => {
    try {
      await models.logout();
      showModal.value = false;
      sendMessage.success('注销成功');
      store.resetUserStatus();
      // userID.value = '';
      // Keyall.value++;
      // Key1.value++;
      // Key2.value++;
    } catch (error) {
      console.error(error);
      const { message } = error as Error;
      sendMessage.error(String(message || '注销失败'));
    }


  };

</script>

<style>
  @import "~/assets/stylus/style.css";
  @import "~/assets/css/all.css";
  @import "~/assets/css/nav.css";
</style>