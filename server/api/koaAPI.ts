// https://nuxt.com.cn/docs/getting-started/data-fetching
// https://segmentfault.com/q/1010000007435062?_ea=1354667
import {
  v4 as uuid
} from 'uuid';


export default defineEventHandler(async (event) => {
  // 类型转换，从Headers（nitro）到HeadersInit
  const headers = getRequestHeaders(event) as Record<string, string>;
  const body = await readBody(event);
  const {
    path, ...reqBody
  } = body;
  console.log('reqPath', 'reqBody', JSON.stringify({
    ...reqBody,
    requestID: uuid(),
  }));
  const res = await fetch(`http://127.0.0.1:9090/${path || ''}`, {
    method: 'POST',
    body: JSON.stringify({
      ...reqBody,
      requestID: uuid(),
    }),
    credentials: 'include',
    headers: {
      'cookie': headers.cookie || '',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  // 如果您希望从另一个方向传递cookie，即从内部请求返回到client，则需要自己处理此操作。
  const cookies = (res.headers.get('Set-Cookie') || '').split(/,(?=[^,]*=)/);
  for (const cookie of cookies) {
    appendHeader(event, 'Set-Cookie', cookie);
    // console.log('Set-Cookie', cookie);
  }

  const resData = await res.text();
  console.log('res', resData, typeof resData);
  const dataReturn = {
    data: typeof resData === 'string' ? JSON.parse(resData) : resData,
    // toJSON() {
    //   return {
    //     data: typeof resData === 'string' ? JSON.parse(resData) : resData,
    //   };
    // },
  };
  return dataReturn;
});