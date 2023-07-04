import Koa from 'koa';
import CONSTANTS from './configs/constants';
import { useMiddlewares } from './configs/koa.middlewares';
import koaRouter from './routes/index';
import { createServer } from 'http';
import { Server } from 'socket.io';
import http from 'http';
import { setSocketIO } from './socket-io';

export const print = {
  log: (text: string) => console.log('\x1b[37m%s \x1b[2m%s\x1b[0m', '>', text),
  danger: (text: string) => console.log('\x1b[31m%s \x1b[31m%s\x1b[0m', '>', text),
  tip: (text: string) => console.log('\x1b[36m%s \x1b[36m%s\x1b[0m', '>', text),
};


const createKoaServer = async (): Promise<Koa> => {
  const koa: Koa = new Koa();
  koa.use(async (ctx: Koa.Context, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type');
    await next();
  });
  useMiddlewares(koa);

  // useContainer(Container);

  koa.use(koaRouter.routes());

  koa.use(async (ctx: Koa.Context, next) => {
    // console.log('ctxdsadasda', ctx.cookies.get('code.sess'), ctx.session?.test, JSON.stringify(ctx.response.header['set-cookie']));
    await next();
  });
  // const app: Koa = useKoaServer<Koa>(koa, routingConfigs);
  // koa.use(async (ctx: Koa.Context, next) => {
  //   console.log('ctx', ctx.request.URL);
  //   await next();
  // });

  return koa;
};
// const app = new Koa();
// // const router = new Router();

// // router.get('/', (ctx) => {
// //   ctx.body = 'Hello World';
// //   console.log('Hello World');
// // });
// app.use(async ctx => {
//   ctx.body = 'Hello World';
// });
// // app.use(router.routes());
// // app.use(router.allowedMethods());

// app.listen(3000);
module.exports = (async (): Promise<http.Server> => {
  const app = await createKoaServer();

  const httpServer = createServer(app.callback());
  const io = setSocketIO(httpServer);

  return httpServer.listen(9090, () => {
    // print.log(`server listening on ${CONSTANTS.PORT}, in ${CONSTANTS.ENV_LABEL} mode.`);
    print.log('server listening on 9090');
    // bootstrapAfter();
  });
})();

