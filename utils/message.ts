import {useMessage, MessageType, MessageOptions,
  MessageReactive,
  createDiscreteApi,
  ConfigProviderProps,} from 'naive-ui';
import { VNodeChild } from 'vue';

type ContentType = string | (() => VNodeChild);
export interface MessageApiInjection {
  create: (content: ContentType, options?: MessageOptions) => MessageReactive;
  info: (content: ContentType, options?: MessageOptions) => MessageReactive;
  success: (content: ContentType, options?: MessageOptions) => MessageReactive;
  warning: (content: ContentType, options?: MessageOptions) => MessageReactive;
  error: (content: ContentType, options?: MessageOptions) => MessageReactive;
  loading: (content: ContentType, options?: MessageOptions) => MessageReactive;
  destroyAll: () => void;
}
export const sendMessageFunc = (type: MessageType, message: ContentType, option?: MessageOptions) => {
  // const Message = useMessage();
  // console.log('sendMessageFunc', window.$message);
  const { message: sendMessage } = createDiscreteApi(
    ['message'],
  );
  sendMessage[type === 'default' ? 'info' : type](message, {
    duration: 2500,
    keepAliveOnHover: true
  });
};

export const sendMessage = {
  info: (message: ContentType, option?: MessageOptions) => sendMessageFunc('info', message, option),
  success: (message: ContentType, option?: MessageOptions) => sendMessageFunc('success', message, option),
  warning: (message: ContentType, option?: MessageOptions) => sendMessageFunc('warning', message, option),
  error: (message: ContentType, option?: MessageOptions) => sendMessageFunc('error', message, option),
  loading: (message: ContentType, option?: MessageOptions) => sendMessageFunc('loading', message, option),
  destroyAll: () => {
    const Message = useMessage();
    Message.destroyAll();
  }
};