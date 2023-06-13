import connection from '../database/connection';
import Router from 'koa-router';
import Koa from 'koa';


const roomRouter = new Router();

roomRouter.post('/new_room', async (ctx: Koa.Context, next) => {
  await next();
  const body = ctx.request.body as {
    interviewer: string;
    interviewee: string;
    QIDs: string[];
  };
  console.log(body);
  const interviewer = body.interviewer;
  const interviewee = body.interviewee;
  let QIDs = null;
  if (body.QIDs instanceof Array) {
    QIDs = (body.QIDs).map(Number).toString();
  }
  else {
    QIDs = [];
    QIDs.push(body.QIDs);
  }

  console.log(QIDs);
  const result = {
    'RID': '',
    'errcode': 0
  };
  // 检查面试官登录
  if (req.session.email === null) {
    result.errcode = -7;
    res.send(result);
    res.end();
    return;
  }

  // 生成房间号
  let RID = '';
  let isRIDExist = true;
  const random_char = function () {
    const n = Math.floor(Math.random() * 62);
    if (n < 10) return n; // 1-10
    if (n < 36) return String.fromCharCode(n + 55); // A-Z
    return String.fromCharCode(n + 61); // a-z
  };
  while (isRIDExist) {
    RID = '';
    while (RID.length < 8) RID += random_char();
    const sql = 'select RID from Rooms where RID = ?';
    const args = [RID];
    const resDB = await connection.dbQuery(sql, args);
    console.log(resDB);
    if (resDB.err === 0) {
      isRIDExist = resDB.result.length !== 0;
    }
    else {// 数据库错误处理
      if (resDB.err === -1) {
        result.errcode = -1;
        res.send(result);
        res.end();
        return;
      }
      else {
        result.errcode = -2;
        console.log(result);
        res.send(result);
        res.end();
        return;
      }
    }
  }
  console.log('RID:', RID);

  // 新建房间，插入房间信息
  const sql = 'insert Rooms(RID,Interviewer,Interviewee,Time,QIDs, SubmittedCode, isFinalSubmit) values (?,?,?,now(),?,"",false)';
  const args = [RID, interviewer, interviewee, QIDs];
  const resDB = await connection.dbQuery(sql, args);
  if (resDB.err === 0) {
    result.RID = RID;
    res.send(result);
    res.end();
  }
  else {// 数据库错误处理
    if (resDB.err === -1) {
      result.errcode = -1;
      res.send(result);
      res.end();
    }
    else {
      result.errcode = -2;
      console.log(result);
      res.send(result);
      res.end();
    }

  }
});


router.post('/new_room', async (req, res) => {
  console.log(req.body);
  const interviewer = req.body.interviewer;
  const interviewee = req.body.interviewee;
  let QIDs = null;
  if (req.body.QIDs instanceof Array) {
    QIDs = (req.body.QIDs).map(Number).toString();
  }
  else {
    QIDs = [];
    QIDs.push(req.body.QIDs);
  }

  console.log(QIDs);
  const result = {
    'RID': '',
    'errcode': 0
  };
  // 检查面试官登录
  if (req.session.email === null) {
    result.errcode = -7;
    res.send(result);
    res.end();
    return;
  }

  // 生成房间号
  let RID = '';
  let isRIDExist = true;
  const random_char = function () {
    const n = Math.floor(Math.random() * 62);
    if (n < 10) return n; // 1-10
    if (n < 36) return String.fromCharCode(n + 55); // A-Z
    return String.fromCharCode(n + 61); // a-z
  };
  while (isRIDExist) {
    RID = '';
    while (RID.length < 8) RID += random_char();
    const sql = 'select RID from Rooms where RID = ?';
    const args = [RID];
    const resDB = await connection.dbQuery(sql, args);
    console.log(resDB);
    if (resDB.err === 0) {
      isRIDExist = resDB.result.length !== 0;
    }
    else {// 数据库错误处理
      if (resDB.err === -1) {
        result.errcode = -1;
        res.send(result);
        res.end();
        return;
      }
      else {
        result.errcode = -2;
        console.log(result);
        res.send(result);
        res.end();
        return;
      }
    }
  }
  console.log('RID:', RID);

  // 新建房间，插入房间信息
  const sql = 'insert Rooms(RID,Interviewer,Interviewee,Time,QIDs, SubmittedCode, isFinalSubmit) values (?,?,?,now(),?,"",false)';
  const args = [RID, interviewer, interviewee, QIDs];
  const resDB = await connection.dbQuery(sql, args);
  if (resDB.err === 0) {
    result.RID = RID;
    res.send(result);
    res.end();
  }
  else {// 数据库错误处理
    if (resDB.err === -1) {
      result.errcode = -1;
      res.send(result);
      res.end();
    }
    else {
      result.errcode = -2;
      console.log(result);
      res.send(result);
      res.end();
    }

  }
});

router.post('/submit', async (req, res) => {
  console.log(req.body);

  const RID = req.body.RID;
  let isFinalSubmit = req.body.isFinalSubmit;
  if (isFinalSubmit == 'true') {
    isFinalSubmit = true;
  }
  else {
    isFinalSubmit = false;
  }
  const SubmittedCode = JSON.stringify(req.body.SubmittedCode);
  console.log(SubmittedCode);
  const result = {
    'err': 0
  };
  // 检查面试者登录
  let sql = 'select interviewee from Rooms where RID = ?';
  let args = [RID];
  let resDB = await connection.dbQuery(sql, args);
  console.log(resDB);
  if (resDB.err === 0) {
    if (resDB.result[0].interviewee !== req.session.email) {
      result.errcode = -3;
      res.send(result);
      res.end();
      return;
    }
  }
  else {// 数据库错误处理
    if (resDB.err === -1) {
      result.errcode = -1;
      res.send(result);
      res.end();
      return;
    }
    else {
      result.errcode = -2;
      console.log(result);
      res.send(result);
      res.end();
      return;
    }
  }

  // 检查最终提交
  sql = 'select isFinalSubmit from Rooms where RID = ?';
  resDB = await connection.dbQuery(sql, args);
  console.log(resDB);
  if (resDB.err === 0) {
    if (resDB.result[0].isFinalSubmit) {
      result.errcode = -3;
      res.send(result);
      res.end();
      return;
    }
  }
  else {// 数据库错误处理
    if (resDB.err === -1) {
      result.errcode = -1;
      res.send(result);
      res.end();
      return;
    }
    else {
      result.errcode = -2;
      console.log(result);
      res.send(result);
      res.end();
      return;
    }
  }
  // 更新提交代码
  sql = 'update Rooms set SubmittedCode = ?, isFinalSubmit = ? where RID = ?';
  args = [SubmittedCode, isFinalSubmit, RID];
  resDB = await connection.dbQuery(sql, args);
  if (resDB.err === 0) {
    res.send(result);
    res.end();
  }
  else {// 数据库错误处理
    if (resDB.err === -1) {
      result.errcode = -1;
      res.send(result);
      res.end();
    }
    else {
      result.errcode = -2;
      console.log(result);
      res.send(result);
      res.end();
    }

  }
});

router.post('/get_submitted', async (req, res) => {
  const RID = req.body.RID;

  const result = {
    'SubmittedCode': '',
    'isFinalSubmit': false,
    'err': 0
  };
  // 检查面试官or面试者登录
  let sql = 'select interviewer,interviewee from Rooms where RID = ?';
  let args = [RID];
  let resDB = await connection.dbQuery(sql, args);
  console.log(resDB);
  if (resDB.err === 0) {
    if (resDB.result[0].interviewer !== req.session.email && resDB.result[0].interviewee !== req.session.email) {
      result.errcode = -3;
      res.send(result);
      res.end();
      return;
    }
  }
  else {// 数据库错误处理
    if (resDB.err === -1) {
      result.errcode = -1;
      res.send(result);
      res.end();
      return;
    }
    else {
      result.errcode = -2;
      console.log(result);
      res.send(result);
      res.end();
      return;
    }
  }


  // 更新提交代码
  sql = 'select SubmittedCode, isFinalSubmit from Rooms where RID = ?';
  args = [RID];
  resDB = await connection.dbQuery(sql, args);
  console.log(resDB);
  if (resDB.err === 0) {
    if (resDB.result[0].SubmittedCode.length !== 0) result.SubmittedCode = JSON.parse(resDB.result[0].SubmittedCode);
    result.isFinalSubmit = resDB.result[0].isFinalSubmit;
    res.send(result);
    res.end();
  }
  else {// 数据库错误处理
    if (resDB.err === -1) {
      result.errcode = -1;
      res.send(result);
      res.end();
    }
    else {
      result.errcode = -2;
      console.log(result);
      res.send(result);
      res.end();
    }
  }
});

router.post('/get_questions', async (req, res) => {
  const RID = req.body.RID;
  let QIDs = [];

  const result = {
    'questions': [],
    'err': 0
  };

  // 检查面试官登录
  let sql = 'select interviewer,interviewee from Rooms where RID = ?';
  let args = [RID];
  let resDB = await connection.dbQuery(sql, args);
  console.log(resDB);
  if (resDB.err === 0) {
    console.log(req.session.email);
    if (resDB.result[0].interviewer !== req.session.email && resDB.result[0].interviewee !== req.session.email) {
      result.errcode = -4;
      res.send(result);
      res.end();
      return;
    }
  }
  else {// 数据库错误处理
    if (resDB.err === -1) {
      result.errcode = -1;
      res.send(result);
      res.end();
      return;
    }
    else {
      result.errcode = -2;
      console.log(result);
      res.send(result);
      res.end();
      return;
    }
  }


  // 获得题目序号列表
  sql = 'select QIDs from Rooms where RID = ?';
  args = [RID];
  resDB = await connection.dbQuery(sql, args);
  console.log(resDB);
  if (resDB.err === 0) {
    if (resDB.result.length === 0) {
      // 房间不存在/未设置题目
      result.errcode = -3;
      res.send(result);
      res.end();
      return;
    }
    else QIDs = resDB.result[0].QIDs.split(',');
  }
  else {// 数据库错误处理
    if (resDB.err === -1) {
      result.errcode = -1;
      res.send(result);
      res.end();
      return;
    }
    else {
      result.errcode = -2;
      console.log(result);
      res.send(result);
      res.end();
      return;
    }
  }

  // 获得题目
  for (let i = 0; i < QIDs.length; i++) {
    sql = 'select  QID, Title, Difficulty, Content, Remark, InputFormat, InputExample, OutputExample from Questions where QID = ?';
    args = [QIDs[i]];
    const resDB = await connection.dbQuery(sql, args);
    if (resDB.err === 0) {
      console.log(resDB);
      if (resDB.result.length === 0) {
        // 题目不存在
        result.questions.push({
 'QID': Number(QIDs[i])
});
      }
      else result.questions.push(JSON.parse(JSON.stringify(resDB.result[0])));
    }
    else {// 数据库错误处理
      if (resDB.err === -1) {
        result.errcode = -1;
        res.send(result);
        res.end();
        return;
      }
      else {
        result.errcode = -2;
        console.log(result);
        res.send(result);
        res.end();
        return;
      }
    }
  }

  console.log(result);
  res.send(result);
  res.end();
});
router.get('/delete_room', async (req, res) => {
  const RID = req.body.RID;

  const result = {
    'errcode': 0
  };

  // 检查面试官登录
  let sql = 'select interviewer from Rooms where RID = ?';
  let args = [RID];
  let resDB = await connection.dbQuery(sql, args);
  console.log(resDB);
  if (resDB.err === 0) {
    if (resDB.result[0].interviewer !== req.session.email) {
      result.errcode = -4;
      res.send(result);
      res.end();
      return;
    }
  }
  else {// 数据库错误处理
    if (resDB.err === -1) {
      result.errcode = -1;
      res.send(result);
      res.end();
      return;
    }
    else {
      result.errcode = -2;
      console.log(result);
      res.send(result);
      res.end();
      return;
    }
  }

  sql = 'delete from Rooms where RID = ?';
  args = [RID];
  resDB = await connection.dbQuery(sql, args);
  console.log(resDB);
  if (resDB.err === 0) {
    if (resDB.result.affectedRows === 1) {
      res.send(result);
      res.end();
    }
    else {
      result.errcode = -3;
      res.send(result);
      res.end();
    }
  }
  else {// 数据库错误处理
    if (resDB.err === -1) {
      result.errcode = -1;
      res.send(result);
      res.end();
    }
    else {
      result.errcode = -2;
      console.log(result);
      res.send(result);
      res.end();
    }
  }
});
module.exports = router;