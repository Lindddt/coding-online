import connection from '../database/connection';
import * as Router from 'koa-router';
import Koa from 'koa';
import * as Joi from 'joi';
import { RowDataPacket } from 'mysql2';
import { ErrorCode, ErrorObject } from '../../types/errcode';
import { v4 as uuid } from 'uuid';
import validateSchemaJoi from '../middlewares/validateSchemaJoi';
import { assign } from 'lodash';

const homeRouter = new Router();

const loginSchema = Joi.object({
  email: Joi.string()
    .min(0)
    .max(30)
    .required(),
  password: Joi.string()
    .min(0)
    .max(30)
    .required(),
  requestID: Joi.string(),
});
homeRouter.post('/login', validateSchemaJoi('post', loginSchema), async (ctx: Koa.Context, next) => {
  const body = ctx.request.body as {
    email: string;
    password: string;
  };
  const email = body.email;
  const password = body.password;
  let username = '';
  let pwd = '';
  let identity = '';
  const sql = 'select username,password,identity from user where email=?';
  const arg = [];
  arg.push(email);
  const db_res = await connection.dbQuery(sql, arg);
  switch (db_res.err) {
    case -1: {
      console.log('数据库连接失败');
      ctx.response.body = {
        errMsg: '数据库连接失败',
        errcode: ErrorCode.DbConnectError,
      };
      await next();
      return;
    }
    case ErrorCode.DbOperationError: {
      console.log('操作失败');
      ctx.response.body = {
        errMsg: '操作失败',
        errcode: ErrorCode.DbOperationError,
      };
      await next();
      return;
    }

    case 0:
    default: {
      if (db_res.result.length === 0) {
        ctx.response.body = {
          errMsg: '数据没找到',
          errcode: ErrorCode.DbNoResult,
        };
        await next();
        return;
      }
      const resData = db_res.result[0] as RowDataPacket;
      username = resData.username;
      pwd = resData.password;
      identity = resData.identity;
      if (pwd !== password) {
        console.log('2');
        ctx.response.body = {
          errMsg: '密码错误',
          errcode: ErrorCode.PasswordError,
        };
        await next();
        return;
      }
      // ctx.session.view = 1; //取消注释则返回 notNew
      // await ctx.session.save();  //取消注释则返回 notNew


      console.log('New');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.session!.username = username;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.session!.identity = identity;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.session!.email = email;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.session!.save();
      // await ctx.session.manuallyCommit();
      ctx.response.body = {
        errcode: 0,
        result: {
          'nickname': username, 'identity': identity
        }
      };
      await next();
      return;
    }
  }
});

homeRouter.post('/register', async (ctx: Koa.Context, next) => {
  const body = ctx.request.body as {
    email: string;
    password: string;
    verificationcode: string;
    identity: string;
    username: string;
  };
  // console.log(body);
  const email = body.email;
  const username = body.username;
  const password = body.password;
  const verificationcode = body.verificationcode;
  const identity = body.identity;
  const pwd = '';

  let sql = 'select code from verificationcode where email=?';
  let arg = [];
  arg.push(email);
  let flag = false;
  console.log('select code from verificationcode where email=?', arg);
  let db_res = await connection.dbQuery(sql, arg);
  switch (db_res.err) {
    case -1: {
      console.log('数据库连接失败');
      ctx.response.body = ErrorObject[ErrorCode.DbConnectError];
      await next();
      return;
    }
    case ErrorCode.DbOperationError: {
      console.log('操作失败');
      ctx.response.body = ErrorObject[ErrorCode.DbOperationError];
      await next();
      return;
    }
    case 0:
    default: {
      if (db_res.result.length === 0) {
        console.log(db_res.result);
        ctx.response.body = ErrorObject[ErrorCode.DbNoResult];
        flag = true;
        await next();
        return;
      }
      const resData = db_res.result[0] as RowDataPacket;
      if (resData.code !== verificationcode) {
        console.log(resData.code);
        console.log(verificationcode);
        ctx.response.body = ErrorObject[ErrorCode.VerificationcodeError];
        await next();
        return;
      }
    }
  }
  sql = 'select uuid from user where email=?';
  arg = [];
  arg.push(email);
  console.log('select uuid from user where email=?', arg);
  db_res = await connection.dbQuery(sql, arg);
  switch (db_res.err) {
    case -1: {
      console.log('数据库连接失败');
      ctx.response.body = ErrorObject[ErrorCode.DbConnectError];
      await next();
      return;
    }
    case ErrorCode.DbOperationError: {
      console.log('操作失败');
      ctx.response.body = ErrorObject[ErrorCode.DbOperationError];
      await next();
      return;
    }
    case 0:
    default: {
      if (db_res.result.length !== 0) {
        console.log(db_res.result);
        ctx.response.body = ErrorObject[ErrorCode.EmailExist];
        await next();
        return;
      }
    }
  }

  sql = 'select uuid from user where username=?';
  arg = [];
  arg.push(username);
  db_res = await connection.dbQuery(sql, arg);
  console.log('select uuid from user where username=?', arg);

  switch (db_res.err) {
    case -1: {
      console.log('数据库连接失败');
      ctx.response.body = ErrorObject[ErrorCode.DbConnectError];
      return;
    }
    case ErrorCode.DbOperationError: {
      console.log('操作失败');
      ctx.response.body = ErrorObject[ErrorCode.DbOperationError];
      return;
    }
    case 0:
    default: {
      if (db_res.result.length !== 0) {
        console.log(db_res.result);
        ctx.response.body = ErrorObject[ErrorCode.DbNoResult];
        await next();
        return;
      }
    }
  }

  sql = 'insert into user(username,password,email,identity,uuid) values(?,?,?,?,?)';
  arg = [];
  arg.push(username);
  arg.push(password);
  arg.push(email);
  arg.push(identity);
  arg.push(uuid());
  db_res = await connection.dbQuery(sql, arg);

  switch (db_res.err) {
    case -1: {
      console.log('数据库连接失败');
      ctx.response.body = ErrorObject[ErrorCode.DbConnectError];
      return;
    }
    case ErrorCode.DbOperationError: {
      console.log('操作失败');
      ctx.response.body = ErrorObject[ErrorCode.DbOperationError];
      return;
    }
    case 0:
    default: {
      ctx.response.body = {
        errcode: 0,
        result: {
          'nickname': username, 'identity': identity, 'email': email
        }
      };
    }
  }
});

homeRouter.post('/check', async (ctx: Koa.Context, next) => {
  await next();
  const body = ctx.request.body as {
    email: string;
  };
  const email = body.email;
  const sql = 'select id from user where email = ?';
  const arg = [];
  arg.push(email);
  const db_res = await connection.dbQueryWithErrorCatch(sql, arg);
  if (db_res.result.length === 0) {
    assign(ctx.response.body, {
      errcode: 0,
      result: false
    });
    await next();
  } else {
    assign(ctx.response.body, {
      errcode: 0,
      result: true
    });
    await next();
  }
});

// router.post('/check', async (req, res) => {
// const email = req.body.email;
// const sql = 'select id from user where email = ?';
// const arg = [];
// arg.push(email);
// const db_res = await connection.dbQuery(sql, arg);
// if (db_res.err === 0) {
//   if (db_res.result.length === 0) {
//     res.send({
//       'result': false
//     });
//     res.end();
//   } else {
//     res.send({
//       'result': true
//     });
//     res.end();
//   }
// }
// });

homeRouter.post('/logout', async (ctx: Koa.Context, next) => {
  await next();
  console.log('logout', ctx.session?.isNew ? 'New' : 'NotNew');
  ctx.session = null;
  // await ctx.session?.manuallyCommit();
  assign(ctx.response.body, {
    errcode: 0,
    result: {
    },
  });
  return;
});

// router.post('/login_check', (req, res) => {
//   if (!req.session.username) {
//     res.send({
//       'errcode': 1
//     });
//     res.end();
//     return;
//   }
//   res.send({
//     'errcode': 0, 'username': req.session.username, 'identity': req.session.identity
//   });
//   res.end();
// });

homeRouter.post('/login_check', async (ctx: Koa.Context, next) => {
  const response = {};
  if (ctx.session?.username) {
    assign(response, {
      errcode: 0,
      result: {
        login: true,
        username: ctx.session?.username,
        identity: ctx.session?.identity,
      },
    });
    ctx.response.body = response;
    // console.log('login_check', ctx.response.body, ctx.session?.username, ctx.session?.identity);
    await next();
    return;
  } else {
    assign(response, {
      errcode: 0,
      result: {
        login: false,
      },
    });
    ctx.response.body = response;
    // console.log('login_check', ctx.response.body);
    await next();
    return;
  }
});

export default homeRouter;
