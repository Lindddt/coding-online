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
  const res = await $useFetch.raw<{
    errcode: number;
    requestID?: string;
    [key: string]: any;
  }>(`/backend/${body.path || ''}`, {
    method: 'POST',
    body: {
      ...reqBody,
      requestID: uuid(),
    },
    credentials: 'include',
    headers: {
      'cookie': headers.cookie || '',
    },
  });
  // 如果您希望从另一个方向传递cookie，即从内部请求返回到client，则需要自己处理此操作。
  res.headers.forEach((value, key) => {
    console.log('key', key, value);

  });
  console.log('set-cookie', res.headers.get('set-cookie'),JSON.stringify(res.headers));
  const cookies = (res.headers.get('set-cookie') || '').split(',');
  for (const cookie of cookies) {
    appendHeader(event, 'set-cookie', cookie);
    console.log('set-cookie', cookie);
  }
  // console.log('res', res._data);
  const dataReturn = {
    data: res,
    toJSON() {
      return {
        data: {
          ...res._data,
        },
      };
    },
  };
  return dataReturn;
});