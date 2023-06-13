import Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import sessionSecret from './session';
import { isProd } from './constants';
import * as session from 'koa-session';

// 设置 session 密钥
export const useMiddlewares = <T extends Koa>(app: T): T => {
  if (isProd()) {
    app.use(logger());
  }
  app.keys = [sessionSecret];
  app.use(session({
    key: 'koa.sess',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    rolling: true
    // store: redis() or other
  },app));

  app.use(bodyParser());

  return app;
};

