<template>
  <div class="verification-code">
    <n-input
      v-model:value="value"
      placeholder="请输入验证码"
    />
    <n-button @click="handleClick">
      {{ verification_send_content }}
    </n-button>
  </div>
</template>

<script setup lang='ts'>
  import { NInput, NButton, c } from 'naive-ui';
  import { ref, defineProps, watch } from 'vue';
  import { sendMessage } from '~/utils';

  const props = defineProps<{
    'formData'?: any;
    'emailName'?: string;
    'itemKey': string
    'changeData'?: (value: string, key: string) => void;
    'validate'?: (keys?: string[]) => Promise<boolean>;
    // 'handleClick'?: (e: MouseEvent) => void;
  }>();
  console.log(props, 'formList', props.formData);

  const verification = ref('');
  const verification_send_content = ref('发送验证码');
  const verificationFlag = ref(0);
  const auth_time = ref(0);
  const value = ref('');
  let startTime = new Date().getTime();
  let count = 0;
  let auth_timeTimer: string | number | NodeJS.Timeout | undefined;
  watch(value, (newVal, oldVal) => {
    console.log({
      newVal, oldVal
    });
    props.changeData?.(newVal, props.itemKey);
  });
  const interval = 1000;

  const countDownStart = () => {
    count++;
    const offset = new Date().getTime() - (startTime + count * interval);// 误差计算
    let nextTime = interval - offset;

    if (nextTime < 0) {
      nextTime = 0;
    }

    auth_time.value -= interval;

    verification_send_content.value = String(auth_time.value / 1000) + '秒后重发';
    if (auth_time.value <= 0) {
      verification_send_content.value = '发送验证码';
      verificationFlag.value = 1;
      // verification_send_get_style();
      clearInterval(auth_timeTimer);
    }
    // console.log('误差：' + offset + 'ms，下一次执行：' + nextTime + 'ms后，离活动开始还有：' + auth_time.value + 'ms');

    if (auth_time.value < 0) {
      clearTimeout(auth_timeTimer);
    } else {
      auth_timeTimer = setTimeout(countDownStart, nextTime);
    }
  };


  const handleClick = async () => {
    console.log(props.formData, 'formRef', props.formData);
    if (!props.validate?.([props.emailName || ''])) {
      console.log('验证失败');
      return;
    }
    console.log('验证成功');
    if (auth_time.value > 0) {
      return;
    }
    auth_time.value = 30000;
    verificationFlag.value = 0;
    verification_send_content.value = String(auth_time.value / 1000) + '秒后重发';
    // this.verification_send_get_style();
    try {
      const res = await $fetch<{
        data: {
          errcode: number;
          [key: string]: any;
        }
      }>('/api/koaAPI', {
        method: 'POST',
        body: {
          path: '/verificationcode',
          email: props.formData[props.emailName || 'email']
        }
      });
      let bool = res.data.errcode || 0;
      let auth_code = res.data.code;
      console.log(auth_code);
      if (res.data.errcode === 0) {
        console.log(res.data);
      }
      console.info(res);
      if (bool === 0) {
        sendMessage.success('获取验证码成功',);
      }
      else if (bool === 1) {
        sendMessage.error('damedame');
      }
    } catch (error) {
      console.log(error);
      // let err = error || '获取验证码失败';
      // Message.error(err);
    }
    startTime = new Date().getTime();
    count = 0;
    if (auth_time.value >= 0) {
      auth_timeTimer = setTimeout(countDownStart, interval);
    }
  };

</script>

<style lang='less' scoped>
.verification-code {
  display: flex;
  flex: 1;
}
</style>