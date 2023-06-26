import * as mysql2 from 'mysql2';
import Koa from 'koa';
import {
 cunstomLogger
} from '../logger/logs/log4js';
import { ErrorCode } from '~/types';

class DbError extends Error {
  errCode: number;
  constructor(message: string, errCode: number) {
    super(message);
    this.name = 'DbConnectError';
    this.errCode = errCode;
  }
}

class DbConnectError extends DbError {
  constructor(message: string) {
    super(message, ErrorCode.DbConnectError);
  }
}

class DbOperationError extends DbError {
  constructor(message: string) {
    super(message, ErrorCode.DbOperationError);
  }
}

export type DatabaseError = DbOperationError | DbConnectError;

const pool = mysql2.createPool({
  host: 'localhost',   // 数据库地址
  user: 'root',    // 数据库用户
  password: 'gXa7dB8y380',  // 数据库密码
  database: 'code',  // 选中数据库
  dateStrings: true // <-  强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回
});


// 数据库操作封装函数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dbQuery = function (sql: string, args: any | any[] | { [param: string]: any }): Promise<{
  err: 0,
  result: mysql2.RowDataPacket[] | mysql2.RowDataPacket[][],
} | {
  err: -1 | ErrorCode.DbOperationError,
}> {
  // 返回一个 Promise
  return new Promise((resolve, reject: (reason?: DbConnectError | DbOperationError) => void) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log('数据库连接错误');
        resolve({
          'err': -1
        });
      } else {
        connection.query(sql, args, (err, result) => {
          if (err) {
            console.log('数据库操作错误');
            console.log(err);
            resolve({
              'err': ErrorCode.DbOperationError
            });
          } else {
            // 调用操作成功方法
            resolve({
              'err': 0,
              'result': result as mysql2.RowDataPacket[] | mysql2.RowDataPacket[][]
            });
          }
          // 结束会话
          connection.release();
        });
      }
    });
  });
};

const dbQueryWithErrorCatch = function (sql: string, args: any | any[] | { [param: string]: any }): Promise<{
  err: 0,
  result: mysql2.RowDataPacket[] | mysql2.RowDataPacket[][],
}> {
  // 返回一个 Promise
  return new Promise((resolve, reject: (reason?: DbConnectError | DbOperationError) => void) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log('数据库连接错误');
        reject(new DbConnectError('数据库连接错误'));
      } else {
        connection.query(sql, args, (err, result) => {
          if (err) {
            console.log('数据库操作错误');
            console.log(err);
            // console.error(['数据库操作错误', sql, args].join('|'));
            cunstomLogger.logError(['数据库操作错误', sql, args].join('|'));
            reject(new DbOperationError('数据库操作错误'));
          } else {
            // console.log(['数据库操作成功', sql, args].join('|'));
            cunstomLogger.logDebug(['数据库操作成功', sql, args, JSON.stringify(result)].join('|'));
            // 调用操作成功方法
            resolve({
              'err': 0,
              'result': result as mysql2.RowDataPacket[] | mysql2.RowDataPacket[][]
            });
          }
          // 结束会话
          connection.release();
        });
      }
    });
  });
};


const dbQueryV2 = async ({
  sql,
  args,
  ctx,
  process,
}: {
  sql: string;
  args: any | any[] | { [param: string]: any };
  ctx: Koa.Context;
  process?: (dbRes: mysql2.RowDataPacket[] | mysql2.RowDataPacket[][]) => void;
}) => {
  try {
    const dbRes = await dbQueryWithErrorCatch(sql, args);
    await process?.(dbRes.result);
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
    console.log(error);
  }
};

const connection = {
  dbQuery,
  dbQueryWithErrorCatch,
  dbQueryV2,
};

export default connection;
