<template>
  <div class="body">
    <div id="software">
      asddadas
      <n-button
        type="primary"
        size="large"
        @click="test"
      >
        测试
      </n-button>
      <DataEditor
        class="schema"
        disabled-type
        :input-data="tree"
        lang="zh_CN"
        custom
      />
      <ProblemSelect />

    </div>

  </div>
</template>

<script setup lang='ts'>
  // import { userStatus } from '@/store/mutations';
  // import { identity } from '@/store/getters';
  import { definePageMeta, useNuxtApp } from '#imports';
  import { ref, onMounted } from 'vue';
  // import CustomForm from '~/components/Form/CustomForm.vue';
  // import { useFetch } from 'nuxt';
  import { NButton } from 'naive-ui';
  import { useStore } from '~/store';
  import { storeToRefs } from 'pinia';
  import { io } from 'socket.io-client';
  import { Socket } from 'socket.io';
  import { ServerToClientEvents, ClientToServerEvents } from '~/types';
  import { DataEditor, JSONSchemaParser, ProblemSelect } from '#components';
  import { JSONSchema, JSONSchemaType, } from '~/components';

  definePageMeta({
    layout: 'nav',
    componentKey: 'index'
  });

  console.log('Hello from the homepage');
  const store = useStore();

  const { identity, currentUser, isLogin, email } = storeToRefs(store);


  const showModal = ref(false);
  const nuxtApp = useNuxtApp();
  const socketNuxt = ref();
  const tree = ref<JSONSchema>(
    {
      'name': '根节点',
      'type': JSONSchemaType.object,
      'values': [
        {
          'name': '名称',
          'type': JSONSchemaType.string,
          'values': '名称',
        },
        {
          'name': 'appId',
          'type': JSONSchemaType.number,
          'values': 654321,
        },
        {
          'name': 'credate',
          'type': JSONSchemaType.string,
          'values': '创建日期',
        }
      ]
    }
  );

  // const socket = ref<any>();
  onMounted(() => {
    // socketNuxt.value = nuxtApp.$nuxtSocket({
    //   // nuxt-socket-io opts:
    //   channel: '/code',
    //   // socket.io-client opts:
    //   reconnection: true,
    //   transports: ['websocket', 'polling'],

    // });
    // socketNuxt.value.on('resend', (data: any) => {
    //   console.log(data);
    // });
    // const socketO = io(':9090', {
    //   // 这里transports的默认值为["polling", "websocket"] 也就是优先使用polling， 但是polling再谷歌浏览器连接不上
    //   transports: ['websocket', 'polling'],
    // });
    // // const socketO = io('http://localhost:9090/code');
    // socketO.on('connect', () => {
    //   console.log('socket.id'); // x8WIv7-mJelg7on_ALbx
    // });
    // socketO.on('hello', (arg) => {
    //   // console.log(socket.id);
    //   console.log(arg);
    // });
    // // 连接异常时，会触发
    // socketO.on('connect_error', (err) => {
    //   console.log(err);
    //   // 如果连接异常，修改transports传输方式
    //   socketO.io.opts.transports = ['polling', 'websocket'];
    //   // 鉴权失败的话，可以修改token，再进行重连
    //   // if (err.message === "invalid credentials") {
    //   //   socket.auth.token = "new abcd";
    //   //   // 手动重连
    //   //   socket.connect();
    //   // }
    // });

  });

  const test = async () => {
    // const messageRxd = await socketNuxt.value.emit('sendMessage', '{ id: abc123 }');
    // console.log(messageRxd, 'messageRxd', );
    console.log('test', JSON.stringify(tree.value));
    JSONSchemaParser(tree.value);
    console.log('test', JSON.stringify(JSONSchemaParser(tree.value)));
  };

</script>

<style>
  @import "~/assets/stylus/style.css";

  @import "~/assets/css/nav.css";
</style>