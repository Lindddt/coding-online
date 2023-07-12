import connection from '../database/connection';
import Router from 'koa-router';
import Koa from 'koa';
import * as Joi from 'joi';
import { RowDataPacket } from 'mysql2';
import { ErrorCode, ErrorObject } from '../../types/errcode';
import { v4 as uuid } from 'uuid';
import validateSchemaJoi from '../middlewares/validateSchemaJoi';
import { isEmpty } from 'lodash';

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
    result: {
      'questionsList': [] as any[],
      'totalNum': -1,
    },
    'errcode': 0
  };

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
    result.result.totalNum = resData.totalNum;
  }
  // 获取题目
  const sql_2 = 'select QID,Title,DATE_FORMAT(Time,"%Y-%m-%d") as Time,Difficulty from questions where QID between ? and ?';
  const args_2 = [startNum, endNum];
  const resDB_2 = await connection.dbQueryWithErrorCatch(sql_2, args_2);
  if (resDB_2.err === 0) {
    // console.log(resDB_2.result, JSON.stringify(resDB_2.result));
    const resData = resDB_2.result as any[];

    result.result.questionsList = resData;
    ctx.response.body = result;
    await next();
    return;
  }

});

const getQuestionsFilterListSchema = Joi.object({
  startNum: Joi.number(),
  endNum: Joi.number(),
  filter: Joi.object({
    difficulty: Joi.array().items(Joi.string()),
    title: Joi.string(),
  }),
  requestID: Joi.string(),
});
questionsListRouter.post('/get_questions_filter_list', validateSchemaJoi('post', getQuestionsFilterListSchema), async (ctx: Koa.Context, next) => {
  // console.log(JSON.stringify(ctx.session), JSON.stringify(ctx.response.header), JSON.stringify(ctx.request.header));
  const body = ctx.request.body as {
    startNum: number;
    endNum: number;
    filter: {
      difficulty?: string[];
      title?: string;
    }
  };

  let startNum = body.startNum;
  let endNum = body.endNum;
  const filter = body.filter;
  const result = {
    result: {
      'questionsList': [] as any[],
      'totalNum': -1,
    },
    'errcode': 0
  };

  if (startNum === undefined || endNum === undefined) {
    startNum = 1;
    endNum = 10;
  }
  // 获取题目总数
  const sql_1 = `select count(*) as totalNum from Questions ${!isEmpty(filter) ? 'where' : ''} ${filter?.difficulty ? 'Difficulty in (?)' : ''} ${filter?.title ? 'Title like ?' : ''}`;
  const args_1: string[] = [];
  if (filter?.difficulty) {
    args_1.push(`(${filter.difficulty.map((item) => `'${item}'`).join(',')})})`);
  }
  if (filter?.title) {
    args_1.push(`%${filter.title}%`);
  }
  const resDB_1 = await connection.dbQueryWithErrorCatch(sql_1, args_1);

  // 数据库操作结果处理
  if (resDB_1.err === 0) {
    const resData = resDB_1.result[0] as RowDataPacket;
    result.result.totalNum = resData.totalNum;
  }
  // 获取题目
  const sql_2 = `select QID,Title,DATE_FORMAT(Time,"%Y-%m-%d") as Time,Difficulty from Questions ${!isEmpty(filter) ? 'where' : ''} ${filter?.difficulty ? 'Difficulty in (?)' : ''} ${filter?.title ? 'Title like ?' : ''} limit ?,?`;
  const args_2 = [];
  if (filter?.difficulty) {
    args_2.push(`(${filter.difficulty.map((item) => `'${item}'`).join(',')})})`);
  }
  if (filter?.title) {
    args_2.push(`%${filter.title}%`);
  }
  args_2.push(startNum - 1);
  args_2.push(endNum - startNum + 1);
  const resDB_2 = await connection.dbQueryWithErrorCatch(sql_2, args_2);
  if (resDB_2.err === 0) {
    // console.log(resDB_2.result, JSON.stringify(resDB_2.result));
    const resData = resDB_2.result as any[];

    result.result.questionsList = resData;
    ctx.response.body = result;
    await next();
    return;
  }

});


export default questionsListRouter;
