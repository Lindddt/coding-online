import connection from '../database/connection';
import * as Router from 'koa-router';
import Koa from 'koa';
import { RowDataPacket } from 'mysql2';
import { ErrorCode, ErrorObject } from './type';


const homeRouter = new Router();

homeRouter.post('/login', async (ctx: Koa.Context, next) => {
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
    case -2: {
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.session!.username = username;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.session!.identity = identity;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.session!.email = email;
      ctx.response.body = {
        'errcode': 0, 'nickname': username, 'identity': identity
      };
      await next();
      return;
    }
  }
});


homeRouter.post('/register', async (ctx: Koa.Context, next) => {
  await next();
  const body = ctx.request.body as {
    email: string;
    password: string;
    verificationcode: string;
    identity: string;
    username: string;
  };
  console.log(body);
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
  let db_res = await connection.dbQuery(sql, arg);
  switch (db_res.err) {
    case -1: {
      console.log('数据库连接失败');
      ctx.response.body = ErrorObject.DbConnectError;
      return;
    }
    case -2: {
      console.log('操作失败');
      ctx.response.body = ErrorObject.DbOperationError;
      return;
    }
    case 0:
    default: {
      if (db_res.result.length === 0) {
        console.log(db_res.result);
        ctx.response.body = ErrorObject.DbNoResult;
        flag = true;
        return;
      }
      const resData = db_res.result[0] as RowDataPacket;
      if (resData.code !== verificationcode) {
        console.log(resData.code);
        console.log(verificationcode);
        ctx.response.body = ErrorObject.VerificationcodeError;
        return;
      }
    }
  }
  sql = 'select id from user where email=?';
  arg = [];
  arg.push(email);
  db_res = await connection.dbQuery(sql, arg);
  switch (db_res.err) {
    case -1: {
      console.log('数据库连接失败');
      ctx.response.body = ErrorObject.DbConnectError;
      return;
    }
    case -2: {
      console.log('操作失败');
      ctx.response.body = ErrorObject.DbOperationError;
      return;
    }
    case 0:
    default: {
      if (db_res.result.length !== 0) {
        console.log(db_res.result);
        ctx.response.body = ErrorObject.DbNoResult;
        return;
      }
    }
  }

  sql = 'select id from user where username=?';
  arg = [];
  arg.push(username);
  db_res = await connection.dbQuery(sql, arg);

  switch (db_res.err) {
    case -1: {
      console.log('数据库连接失败');
      ctx.response.body = ErrorObject.DbConnectError;
      return;
    }
    case -2: {
      console.log('操作失败');
      ctx.response.body = ErrorObject.DbOperationError;
      return;
    }
    case 0:
    default: {
      if (db_res.result.length !== 0) {
        console.log(db_res.result);
        ctx.response.body = ErrorObject.DbNoResult;
        return;
      }
    }
  }

  sql = 'insert into user(username,password,email,identity) values(?,?,?,?)';
  arg = [];
  arg.push(username);
  arg.push(password);
  arg.push(email);
  arg.push(identity);
  db_res = await connection.dbQuery(sql, arg);

  switch (db_res.err) {
    case -1: {
      console.log('数据库连接失败');
      ctx.response.body = ErrorObject.DbConnectError;
      return;
    }
    case -2: {
      console.log('操作失败');
      ctx.response.body = ErrorObject.DbOperationError;
      return;
    }
    case 0:
    default: {
      ctx.response.body = {
        'errcode': 0, 'nickname': username, 'identity': identity
      };
    }
  }
});


// router.post('/check', async (req, res) => {
//   const email = req.body.email;
//   const sql = 'select id from user where email = ?';
//   const arg = [];
//   arg.push(email);
//   const db_res = await connection.dbQuery(sql, arg);
//   if (db_res.err === 0) {
//     if (db_res.result.length === 0) {
//       res.send({
//         'result': false
//       });
//       res.end();
//     } else {
//       res.send({
//         'result': true
//       });
//       res.end();
//     }
//   }
// // });

// router.post('/logout', (req, res) => {
//   delete req.session.username;
//   delete req.session.id;
//   if (!req.session.username) {
//     res.send({
//       'errcode': 0
//     });// 成功
//     res.end();
//     return;
//   }
//   res.send({
//     'errcode': 1
//   });// 失败
//   res.end();
// });

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


export default homeRouter;
