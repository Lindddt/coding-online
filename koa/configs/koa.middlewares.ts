import Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import sessionSecret from './session';
import { isProd } from './constants';
import * as session from 'koa-session';
import { MysqlStore } from '../plugin/sessionStore';
import { cunstomLogger } from '../logger/logs/log4js';
import { v4 as uuid } from 'uuid';

// 设置 session 密钥
export const useMiddlewares = <T extends Koa>(app: T): T => {
  // if (isProd()) {
  //   app.use(logger());
  // }
  app.on('error', (err, ctx) => {
    cunstomLogger.logError(err);
  });
  app.on('error-info', (err, ctx) => {
    cunstomLogger.logInfo(err);
  });

  app.keys = [sessionSecret];
  // https://juejin.cn/post/6948780829921247269
  app.use(session({
    key: 'code.sess',
    autoCommit: true,
    store: new MysqlStore(),
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    // rolling: true,
  }, app));
  app.use(async (ctx: Koa.Context, next) => {
    let n = ctx.session?.views || 0;
    // console.log('ctx', ctx.cookies.get('code.sess'), JSON.stringify(ctx.session), ctx.session?.save());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ctx.session!.views = ++n;
    ctx.body = n + ' views';
    if (ctx.session?.isNew) {
      // console.log('New');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.session!.test = uuid();
      ctx.session.save();
      console.log('New', ctx.session!.views);
    }
    await ctx.session?.save();
    await ctx.session?.manuallyCommit();
    await next();
  });
  app.use(async (ctx: Koa.Context, next) => {
    try {
      await next();
    } catch (error: any) {
      if (error.errcode !== undefined) {
        console.log(error, 'error');
        ctx.response.body = {
          errMsg: error.message,
          errcode: error.errCode,
        };
        return;
      }
    }
  });
  app.use(bodyParser());

  return app;
};

