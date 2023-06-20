import connection from '../database/connection';
import * as Router from 'koa-router';
import Koa from 'koa';
import * as Joi from 'joi';
import { RowDataPacket } from 'mysql2';
import { ErrorCode, ErrorObject } from '../../types/errcode';
import { v4 as uuid } from 'uuid';
import validateSchemaJoi from '../middlewares/validateSchemaJoi';

const questionsListRouter = new Router();

const getQuestionsListSchema = Joi.object({
  startNum: Joi.number(),
  endNum: Joi.number(),
  requestID: Joi.string(),
});

questionsListRouter.post('/get_questions_list', validateSchemaJoi('post', getQuestionsListSchema), async (ctx: Koa.Context, next) => {
  // console.log(JSON.stringify(ctx.session), JSON.stringify(ctx.response.header), JSON.stringify(ctx.request.header));
  const body = ctx.request.body as {
    startNum: number;
    endNum: number;
  };
  let startNum = body.startNum;
  let endNum = body.endNum;
  const result = {
    'questionsList': [] as any[],
    'totalNum': -1,
    'errcode': 0
  };
  let n = ctx.session?.views || 0;
  // console.log('ctx', ctx.cookies.get('code.sess'), JSON.stringify(ctx.session), ctx.session?.save());
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ctx.session!.views = ++n;
  if (ctx.session?.isNew) {
    // console.log('New');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ctx.session!.test = uuid();
    ctx.session.save();
  }
  console.log('New', ctx.session!.views);

  if (startNum === undefined || endNum === undefined) {
    startNum = 1;
    endNum = 10;
  }
  // 获取题目总数
  const sql_1 = 'select count(*) as totalNum from Questions';
  const args_1: never[] = [];
  const resDB_1 = await connection.dbQueryWithErrorCatch(sql_1, args_1);

  // 数据库操作结果处理
  if (resDB_1.err === 0) {
    const resData = resDB_1.result[0] as RowDataPacket;
    result.totalNum = resData.totalNum;
  }
  // 获取题目
  const sql_2 = 'select QID,Title,DATE_FORMAT(Time,"%Y-%m-%d") as Time,Difficulty from questions where QID between ? and ?';
  const args_2 = [startNum, endNum];
  const resDB_2 = await connection.dbQueryWithErrorCatch(sql_2, args_2);
  if (resDB_2.err === 0) {
    // console.log(resDB_2.result, JSON.stringify(resDB_2.result));
    const resData = resDB_2.result as any[];

    result.questionsList = resData;
    ctx.response.body = {
      'errcode': 0, 'result': result
    };
    await next();
    return;
  }

});


export default questionsListRouter;
