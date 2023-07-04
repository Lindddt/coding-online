import connection from '../database/connection';
import email from '../util/sendmail';
import Router from 'koa-router';
import * as Koa from 'koa';


const verificationcodeRouter = new Router();

verificationcodeRouter.post('/', async (ctx: Koa.Context, next) => {
  const body = ctx.request.body as {
    email: string;
  };
  console.log('req.body:' + body.email);
  const mail = body.email;
  if (!mail) {
    ctx.response.body = {
      errMsg: '邮箱不能为空',
      errcode: 1,
    };
    return;
  } // email出错时或者为空时
  let code = parseInt(String(Math.random() * 1000000), 10).toString(); // 生成随机验证码
  code = pad(code, 6);
  console.log(code);
  // 发送邮件
  email.sendMail(mail, code, (state) => {
    console.log('sendmail:' + code);
    if (state) {
      ctx.response.body = {
        errcode: 0,
      };
      return;
    } else {
      ctx.response.body = {
        errcode: 1,
        errMsg: '发送邮件失败',
      };
      return;
    }

  });
  const sql = 'replace into verificationcode(email,code) values(?,?)';
  const arg = [];
  arg.push(mail);
  arg.push(code);
  const db_res = await connection.dbQuery(sql, arg);
  ctx.response.body = {
    errcode: 0,
    errMsg: '发送邮件成功',
  };
  await next();
});

function pad(num: string, n: number) {
  let len = num.length;
  while (len < n) {
    // eslint-disable-next-line no-param-reassign
    num = '0' + num;
    len++;
  }
  return num;
}
export default verificationcodeRouter;