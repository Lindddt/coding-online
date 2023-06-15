import Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import sessionSecret from './session';
import { isProd } from './constants';
import * as session from 'koa-session';
import { MysqlStore } from '../plugin/sessionStore';
import { cunstomLogger } from '../logger/logs/log4js';

// 设置 session 密钥
export const useMiddlewares = <T extends Koa>(app: T): T => {
  if (isProd()) {
    app.use(logger());
  }
  app.on('error', (err, ctx) => {
    cunstomLogger.logError(err);
  });
  app.on('error-info', (err, ctx) => {
    cunstomLogger.logInfo(err);
  });
  app.keys = [sessionSecret];
  // https://juejin.cn/post/6948780829921247269
  app.use(session({
    key: 'koa.sess',
    store: new MysqlStore(),
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    // rolling: true
  },app));

  app.use(bodyParser());

  return app;
};

