export enum ErrorCode {
  DuplicateKey = 11000,
  /** 数据库连接失败 */
  DbConnectError = 2,
  /** 验证码错误 */
  VerificationcodeError = 3,
  /** 操作失败 */
  DbOperationError = 4,
  /** 密码错误 */
  PasswordError = 5,
  /** 邮箱已注册 */
  EmailExist = 6,
  /** 没有找到结果 */
  DbNoResult = 7,
  /** 参数错误或缺失 */
  ParameterError = 8,
}

export const ErrorObject:{
  [key in number]: {
    errMsg: string;
    errcode: ErrorCode;
  };
} = {
  /** 数据库连接失败 */
  [ErrorCode.DbConnectError]: {
    errMsg: '数据库连接失败',
    errcode: ErrorCode.DbConnectError,
  },
  /** 操作失败 */
  [ErrorCode.DbOperationError]: {
    errMsg: '操作失败',
    errcode: ErrorCode.DbOperationError,
  },
  /** 数据没找到 */
  [ErrorCode.DbNoResult]: {
    errMsg: '数据没找到',
    errcode: ErrorCode.DbNoResult,
  },
  /** 密码错误 */
  [ErrorCode.PasswordError]: {
    errMsg: '密码错误',
    errcode: ErrorCode.PasswordError,
  },
  /** 验证码错误 */
  [ErrorCode.VerificationcodeError]: {
    errMsg: '验证码错误',
    errcode: ErrorCode.VerificationcodeError,
  },
  /** 邮箱已注册 */
  [ErrorCode.EmailExist]: {
    errMsg: '邮箱已注册',
    errcode: ErrorCode.EmailExist,
  },
  /** 重复的键 */
  [ErrorCode.DuplicateKey]: {
    errMsg: '重复的键',
    errcode: ErrorCode.DuplicateKey,
  },
  /** 参数错误或缺失 */
  [ErrorCode.ParameterError]: {
    errMsg: '参数错误或缺失',
    errcode: ErrorCode.ParameterError,
  },
};