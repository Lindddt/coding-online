import { useMessage, MessageType } from 'naive-ui';

export const Message = useMessage();

export const sendMessage = ({ type, message, option }: {
  type: MessageType,
  message: string, option?: {
    keepAliveOnHover: boolean;
    closable: boolean;
  }
}) => {
  Message[type === 'default' ? 'info' : type](message, {
    duration: 2500,
    keepAliveOnHover: true
  });

};