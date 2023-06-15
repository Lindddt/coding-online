import { Identity } from '~/types';
import { v4 as uuid } from 'uuid';
import connection from '../database/connection';
import { RowDataPacket } from 'mysql2';

const CREATE_STATEMENT = 'CREATE  TABLE IF NOT EXISTS `_mysql_session_store` (`id` VARCHAR(255) NOT NULL, `expires` BIGINT NULL, `data` TEXT NULL, PRIMARY KEY (`id`), KEY `_mysql_session_store__expires` (`expires`));';
const GET_STATEMENT = 'SELECT * FROM `_mysql_session_store` WHERE id  = ? AND expires > ?';
const SET_STATEMENT = 'INSERT INTO _mysql_session_store(id, expires, data) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE expires=?, data =?';
const DELETE_STATEMENT = 'DELETE FROM `_mysql_session_store` WHERE id  = ?';
const CLEANUP_STATEMENT = 'DELETE FROM `_mysql_session_store` WHERE expires  < ?';

const FORTY_FIVE_MINUTES = 45 * 60 * 1000;
const FIFTEEN_MINUTES = 15 * 60 * 1000;

const getExpiresOn = function (session: any, ttl = FORTY_FIVE_MINUTES) {
  let expiresOn = null;

  if (session && session.cookie && session.cookie.expires) {
    if (session.cookie.expires instanceof Date) {
      expiresOn = session.cookie.expires;
    } else {
      expiresOn = new Date(session.cookie.expires);
    }
  } else {
    const now = new Date();
    expiresOn = new Date(now.getTime() + ttl);
  }
  return expiresOn;
};

export class MysqlStore {
  private queryPromise = async function (sqlStr: string, paramArray: any[]) {
    try {
      const dbRes1 = await connection.dbQueryWithErrorCatch(sqlStr, paramArray);
      return dbRes1.result;
    } catch (err) {
      console.error(err);
    }
  };
  private cleanup = async () => {
    const time = new Date().getTime();
    const results = this.queryPromise(CLEANUP_STATEMENT, [time]);
  };

  private logger = function (data: any) {
    console.info(`path:${__filename}:\n`, data);
  };
  constructor(options?: { clean: boolean; }) {
    // const cleanInterval = (!options.clean) ? FIFTEEN_MINUTES : options.clean;

    this.cleanup();

    this.queryPromise(CREATE_STATEMENT, []);

    // setInterval(this.cleanup.bind(this), cleanInterval);
  }

  async set(sid: string, session: {
    email: string;
    username: string;
    identity: Identity;
  }, ttl = 600000) {
    const expires = getExpiresOn(session, ttl).valueOf();
    const data = JSON.stringify(session);

    try {
      const results = await this.queryPromise(SET_STATEMENT, [sid, expires, data, expires, data]);
      return results;

    } catch (error) {
      this.logger(error);
    }
  }


  // 读取session
  async get(sid: string) {
    try {
      const results = await this.queryPromise(GET_STATEMENT, [sid, Date.now()]);
      let session = null;
      if (results && results[0]) {
        const resData = results[0] as RowDataPacket;
        session = JSON.parse(resData.data);
      }
      return session;
    } catch (error) {
      this.logger(error);
    }

  }

  // 删除session
  async destroy(sid: string) {
    try {
      await this.queryPromise(DELETE_STATEMENT, [sid]);
    } catch (err) {
      this.logger(err);

    }
  }

}

