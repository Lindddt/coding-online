// https://nuxt-socket-io.netlify.app/configuration#automatic-io-server-registration


// An example svc:
export default function (socket, io) {
  return Object.freeze({
    /* Just define the methods here */
    getMessage(msg) {
      return {
        status: 'ok',
        msg: 'Hello from the server',
      };
    },
  });
}