import Koa from 'koa';
import * as Joi from 'joi';
import { ErrorCode } from '~/types';

export function validateSchemaJoi(method: 'post' | 'get', schema: Joi.ObjectSchema<any>) {
  async function validateSchema(ctx: Koa.Context, next: Koa.Next) {
    let data;
    if (method === 'get') {
      data = ctx.request.query;
    } else {
      data = ctx.request.body;
    }
    const { error } = schema.validate(data);
    if (error !== undefined) {
      const errMsg = error.details[0].message || '参数错误';
      ctx.response.body = {
        errMsg,
        errcode: ErrorCode.ParameterError,
      };
      console.log(error);
    } else {
      await next();
    }
  }
  return validateSchema;
}

export default validateSchemaJoi;
