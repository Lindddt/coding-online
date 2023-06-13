import connection from '../database/connection';

async function update_message(sql: string, arg: any, is_message: boolean) {
  arg.push(is_message);
  const db_res = await connection.dbQuery(sql, arg);
  if (db_res.err === 0) {
    const id = db_res.result.insertId;
    const newSql = 'select DATE_FORMAT(time,"%Y-%m-%d %H:%i:%S") as time from message where id = ?';
    const newArg = [...arg];
    newArg.push(id);
    const db_res_time = await connection.dbQuery(newSql, newArg);
    return db_res_time.err === 0 ? db_res_time.result[0].time : null;
  }
}

module.exports = {
  update_message
};