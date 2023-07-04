const API = {
  version: 1.0,
  methods: {
    getRooms: {
      resp: ['']
    }
  }
};

export default function Svc(socket, io) {
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