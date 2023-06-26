/** *********All edited by ZHJ**************/
import connection from '../database/connection';
import * as Router from 'koa-router';
import Koa from 'koa';
import * as Joi from 'joi';
import { RowDataPacket } from 'mysql2';
import { ErrorCode, ErrorObject } from '../../types';
import { v4 as uuid } from 'uuid';
import validateSchemaJoi from '../middlewares/validateSchemaJoi';

const questionsRouter = new Router();


const getQuestionSchema = Joi.object({
  requestID: Joi.string(),
  id: Joi.number(),
});

questionsRouter.post('/get_question_detail', validateSchemaJoi('post', getQuestionSchema), async (ctx: Koa.Context, next) => {
  // console.log(JSON.stringify(ctx.session), JSON.stringify(ctx.response.header), JSON.stringify(ctx.request.header));
  const body = ctx.request.body as {
    id: number;
  };
  // console.log(body, 'ctx.request.body');
  const id = body.id;
  const response = {
    result: {
      'QID': -1,
      'Title': '',
      'Time': '',
      'Difficulty': '',
      'Content': '',
      'Remark': '',
      'InputFormat': '',
      'InputExample': '',
      'OutputExample': '',
    },
    errcode: 0,
  };
  // sql语句
  const sql = 'select QID, Title, Time, Difficulty, Content, Remark, InputFormat, InputExample, OutputExample from Questions where QId = ?';
  const args = [id];
  try {
    const resDB_1 = await connection.dbQueryWithErrorCatch(sql, args);
    if (resDB_1.result.length === 0) {
      ctx.response.body = ErrorObject[ErrorCode.DbNoResult];
      return;
    } else {
      const resData = resDB_1.result[0] as RowDataPacket;
      response.result.QID = resData.QID;
      response.result.Title = resData.Title;
      response.result.Time = resData.Time;
      response.result.Difficulty = resData.Difficulty;
      response.result.Content = resData.Content;
      response.result.Remark = resData.Remark;
      response.result.InputFormat = resData.InputFormat;
      response.result.InputExample = resData.InputExample;
      response.result.OutputExample = resData.OutputExample;
      // console.log(result);
      // res.send(result);
      // res.end();
      ctx.response.body = response;
    }

  } catch (error) {
    const err = error as any;
    if (err.errcode !== undefined) {
      console.log(error);
      ctx.response.body = {
        errMsg: err.message,
        errcode: err.errCode,
      };
      return;
    }

  }
  await next();
  return;
});

// router.post('/get_question_detail', async (req, res) => {
//   let id = req.query.id;
//   let result = {
//     'QID': -1,
//     'title': '',
//     'time': '',
//     'difficulty': '',
//     'content': '',
//     'remark': '',
//     'inputFormat': '',
//     'inputExample': '',
//     'outputExample': '',
//     'errcode': 0
//   };
//   // sql语句
//   let sql = 'select QID, Title, Time, Difficulty, Content, Remark, InputFormat, InputExample, OutputExample from Questions where QId = ?';
//   let args = [id];
//   let resDB = await connection.dbQueryWithErrorCatch(sql, args);
//   console.log(resDB);
//   // 数据库操作结果处理
//   if (resDB.err === 0) {
//     console.log('damadmda');
//     console.log(resDB.result);
//     if (resDB.result.length == 0) {
//       console.log('damadmda');
//       result.errcode = -2;
//       res.send(result);
//       res.end();
//       return;
//     }
//     result.QID = resDB.result[0].QID;
//     result.title = resDB.result[0].Title;
//     result.time = resDB.result[0].Time;
//     result.difficulty = resDB.result[0].Difficulty;
//     result.content = resDB.result[0].Content;
//     result.remark = resDB.result[0].Remark;
//     result.inputFormat = resDB.result[0].InputFormat;
//     result.inputExample = resDB.result[0].InputExample;
//     result.outputExample = resDB.result[0].OutputExample;
//     console.log(result);
//     res.send(result);
//     res.end();
//   }
//   else {// 错误处理
//     if (resDB.err === -1) {
//       result.errcode = -1;
//       res.send(result);
//       res.end();
//     }
//     else {
//       result.errcode = -2;
//       console.log(result);
//       res.send(result);
//       res.end();
//     }
//   }
// });

const newQuestionSchema = Joi.object({
  requestID: Joi.string(),
  title: Joi.string(),
  difficulty: Joi.string(),
  content: Joi.string(),
  remark: Joi.string(),
  inputFormat: Joi.string(),
  inputExample: Joi.string(),
  outputExample: Joi.string(),
});


questionsRouter.post('/new_question', validateSchemaJoi('post', newQuestionSchema), async (ctx: Koa.Context, next) => {
  // console.log(JSON.stringify(ctx.session), JSON.stringify(ctx.response.header), JSON.stringify(ctx.request.header));
  const body = ctx.request.body as {
    title: string;
    difficulty: string;
    content: string;
    remark: string;
    inputFormat: string;
    inputExample: string;
    outputExample: string;
  };
  const title = body.title;
  const difficulty = body.difficulty;
  const content = body.content;
  const remark = body.remark;
  const inputFormat = body.inputFormat;
  const inputExample = body.inputExample;
  const outputExample = body.outputExample;
  const response = {
    result: {
      'QID': -1,
    },
    errcode: 0,
  };
  // sql语句
  const sql = 'insert Questions(Title, Time, Difficulty, Content, Remark, InputFormat, InputExample, OutputExample) values (?,now(),?,?,?,?,?,?);';
  const args = [title, difficulty, content, remark, inputFormat, inputExample, outputExample];
  try {
    const resDB_1 = await connection.dbQueryWithErrorCatch(sql, args);
    console.log('damadmda');
    console.log(resDB_1.result);
    if (resDB_1.result.length === 0) {
      console.log('damadmda');
      response.errcode = -2;
      ctx.response.body = ErrorObject[ErrorCode.DbNoResult];
      return;
    } else {
      const resData = resDB_1.result[0] as RowDataPacket;
      response.result.QID = resData.insertId;
      // console.log(result);
      // res.send(result);
      // res.end();
      ctx.response.body = response;
    }

  } catch (error) {
    const err = error as any;
    if (err.errcode !== undefined) {
      console.log(error);
      ctx.response.body = {
        errMsg: err.message,
        errcode: err.errCode,
      };
      return;
    }

  }
  await next();
  return;
});

// router.post('/new_question', async (req, res) => {
//   console.log(req.body);
//   const title = req.body.title;
//   const difficulty = req.body.difficulty;
//   const content = req.body.content;
//   const remark = req.body.remark;
//   const inputFormat = req.body.inputFormat;
//   const inputExample = req.body.inputExample;
//   const outputExample = req.body.outputExample;

//   const result = {
//     'QID': -1,
//     'errcode': 0
//   };

//   // 新建问题
//   const sql = 'insert Questions(Title, Time, Difficulty, Content, Remark, InputFormat, InputExample, OutputExample) values (?,now(),?,?,?,?,?,?);';
//   const args = [title, difficulty, content, remark, inputFormat, inputExample, outputExample];
//   const resDB = await connection.dbQueryWithErrorCatch(sql, args);
//   console.log(resDB);
//   if (resDB.err === 0) {
//     result.QID = resDB.result.insertId;
//     res.send(result);
//     res.end();
//   }
//   else {
//     console.log(resDB);
//     if (resDB.err === -1) {
//       // 数据库错误处理
//       result.errcode = -1;
//       res.send(result);
//       res.end();
//     } else {
//       result.errcode = -2;
//       console.log(result);
//       res.send(result);
//       res.end();
//     }
//   }
// });

export default questionsRouter;
