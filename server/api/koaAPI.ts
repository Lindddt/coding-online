// https://nuxt.com.cn/docs/getting-started/data-fetching
// https://segmentfault.com/q/1010000007435062?_ea=1354667
import { v4 as uuid } from 'uuid';


export default defineEventHandler(async (event) => {
  // 类型转换，从Headers（nitro）到HeadersInit
  const headers = getRequestHeaders(event) as Record<string, string>;
  const body = await readBody(event);
  // console.log('event', body.path, headers.cookie);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { path, ...reqBody } = body;
  // console.log('reqBody', reqBody);
  // https://github.com/unjs/ofetch
  const res = await fetch(`http://127.0.0.1:9090/${body.path || ''}`, {
    method: 'POST',
    body: {
      ...reqBody,
      requestID: uuid(),
    },
    credentials: 'include',
    headers: {
      'cookie': headers.cookie || '',
    }
  });
  // const res = await $fetch.raw<{
  //   errcode: number;
  //   requestID?: string;
  //   [key: string]: any;
  // }>(`/backend/${body.path || ''}`, {
  //   method: 'POST',
  //   body: {
  //     ...reqBody,
  //     requestID: uuid(),
  //   },
  //   credentials: 'include',
  //   headers: {
  //     'cookie': headers.cookie || '',
  //   },
  //   async onResponse({ request, response, options }) {
  //     // Log response
  //     console.log('[fetch response]', request, JSON.stringify(response));
  //   }
  // });
  // 如果您希望从另一个方向传递cookie，即从内部请求返回到client，则需要自己处理此操作。
  // res.headers.forEach((value, key) => {
  //   console.log('key', key, value);
  // });
  const resData = await res.text();
  console.log('res', JSON.stringify(res), resData);
  const cookies = (res.headers.get('Set-Cookie') || '').split(/,(?=[^,]*=)/);
  for (const cookie of cookies) {
    appendHeader(event, 'Set-Cookie', cookie);
    console.log('Set-Cookie', cookie);
  }
  // console.log('res', res._data);
  const dataReturn = {
    data: res,
    toJSON() {
      return {
        data: JSON.parse(resData),
      };
    },
  };
  return dataReturn;
});