export enum ErrorCode {
  DuplicateKey = 11000,
  /** 数据库连接失败 */
  DbConnectError = 2,
  /** 操作失败 */
  DbOperationError = 4,
  /** 没有找到结果 */
  DbNoResult = 4,
  /** 密码错误 */
  PasswordError = 5,
  VerificationcodeError = 3,
}

export const ErrorObject = {
  /** 数据库连接失败 */
  DbConnectError: {
    errMsg: '数据库连接失败',
    errcode: ErrorCode.DbConnectError,
  },
  /** 操作失败 */
  DbOperationError: {
    errMsg: '操作失败',
    errcode: ErrorCode.DbOperationError,
  },
  /** 数据没找到 */
  DbNoResult: {
    errMsg: '数据没找到',
    errcode: ErrorCode.DbNoResult,
  },
  /** 密码错误 */
  PasswordError: {
    errMsg: '密码错误',
    errcode: ErrorCode.PasswordError,
  },
  /** 验证码错误 */
  VerificationcodeError: {
    errMsg: '验证码错误',
    errcode: ErrorCode.VerificationcodeError,
  },
};