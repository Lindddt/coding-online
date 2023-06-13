import Router from 'koa-router';
import Koa from 'koa';


const userRouter = new Router();
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
//   console.log('users');
//   res.end();
// });

userRouter.get('/', async (ctx: Koa.Context, next) => {
  await next();
  ctx.response.body = {
    errMsg: 'respond with a resource',
    errcode: 1,
  };
  return;
});
