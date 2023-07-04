import Router from 'koa-router';
import Koa from 'koa';


const testRouter = new Router();

testRouter.post('/', async (ctx: Koa.Context, next) => {
  await next();
  const body = ctx.request.body as any;
  console.log('req.body:' + JSON.stringify(body), JSON.stringify(ctx.request.URL), JSON.stringify(ctx.request));
  if (body && body.error) {
    ctx.response.body = {
      'errcode': 1
    };
  } else {
    ctx.response.body = {
      'errcode': 0,
      ...body,
    };
  }
});

export default testRouter;