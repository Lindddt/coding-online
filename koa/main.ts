import { Server } from 'http';
import Koa from 'koa';
import CONSTANTS from './configs/constants';
import { useMiddlewares } from './configs/koa.middlewares';
import koaRouter from './routes/index';
export const print = {
  log: (text: string) => console.log('\x1b[37m%s \x1b[2m%s\x1b[0m', '>', text),
  danger: (text: string) => console.log('\x1b[31m%s \x1b[31m%s\x1b[0m', '>', text),
  tip: (text: string) => console.log('\x1b[36m%s \x1b[36m%s\x1b[0m', '>', text),
};


const createServer = async (): Promise<Koa> => {
  const koa: Koa = new Koa();

  useMiddlewares(koa);

  // useContainer(Container);

  koa.use(koaRouter.routes());
  // const app: Koa = useKoaServer<Koa>(koa, routingConfigs);
  koa.use(async (ctx: Koa.Context, next) => {
    console.log('ctx', ctx.request.URL);
    await next();
  });

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
module.exports = (async (): Promise<Server> => {
  const app = await createServer();
  return app.listen(9090, () => {
    // print.log(`server listening on ${CONSTANTS.PORT}, in ${CONSTANTS.ENV_LABEL} mode.`);
    print.log('server listening on 9090');

    // bootstrapAfter();
  });
})();

