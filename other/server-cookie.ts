

import { defineNuxtPlugin } from '#app';

/**
 * 此插件用于转发axios获取到的set-cookie请求头
 * @param app context 注入的 app
 * @param res context 注入的 response
 * @param inject
 */
export default defineNuxtPlugin((nuxtApp) => {
  const axios = nuxtApp.$axios;
  axios.onResponse((response) => {
    if (response.headers.hasOwnProperty('set-cookie') && process.server) {
      // 设置cookie
      const apiSetCookie = response.headers['set-cookie'];
      let oldSetCookie = res.getHeader('set-cookie');
      if (oldSetCookie) {
        oldSetCookie.push(...apiSetCookie);
      } else {
        oldSetCookie = apiSetCookie;
      }
      res.setHeader('Set-Cookie', oldSetCookie);
    }
  });
});


// export default ({ app, res }, inject) => {
//   const axios = app.$axios;
//   axios.onResponse((response) => {
//     if (response.headers.hasOwnProperty('set-cookie') && process.server) {
//       // 设置cookie
//       const apiSetCookie = response.headers['set-cookie'];
//       let oldSetCookie = res.getHeader('set-cookie');
//       if (oldSetCookie) {
//         oldSetCookie.push(...apiSetCookie);
//       } else {
//         oldSetCookie = apiSetCookie;
//       }
//       res.setHeader('Set-Cookie', oldSetCookie);
//     }
//   });
// };
