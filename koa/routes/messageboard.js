let express = require('express');
let router = express.Router();
let connection = require('../database/connection');
let message_util = require('../util/message');

router.post('/send',async function (req,res){
    console.log(req.body);
    if(!req.session.username){
        res.send({'errcode':1});//用户未登录
        res.end();
        return;
    }
    let identity = req.session.identity;
    let cur_user = req.session.username;
    let message = req.body.msg;
    let receiver = req.body.receiver;
    console.log(identity,cur_user);
    let arg = [];
    arg.push(cur_user);
    arg.push(message);
    arg.push(receiver);
    if(identity===0){
        let sql = "insert into message(sender,content,time,receiver,is_message) values(?,?,now(),?,?)";
        let time = await message_util.update_message(sql,arg,0);
        res.send({'sender':cur_user,'msg':message,'time':time,'errcode':0});
        res.end();
    }else{
        let sql = "select id from message where sender=? and receiver=?";
        arg = [];
        arg.push(cur_user);
        arg.push(receiver);
        let db_res = await connection.dbQuery(sql,arg);
        let is_message = 0;
        if(db_res.result.length===0){
            is_message=1;
        }else{
            is_message=0;
        }
        arg = [];
        arg.push(cur_user);
        arg.push(message);
        arg.push(receiver);
        /*console.log(arg);*/
        sql = "insert into message(sender,content,time,receiver,is_message) values(?,?,now(),?,?)";
        let time = await message_util.update_message(sql,arg,is_message);
        res.send({'sender':cur_user,'msg':message,'time':time,'errcode':0});
        res.end();
    }
})

router.post('/get_message',async function(req,res){
    if(!req.session.username){
        res.send({'errcode':1});//用户未登录
        res.end();
        return;
    }
    let cur_user = req.session.username;
    let identity = req.session.identity;
    let sql = "";
    let arg = [];
    if(identity===0){
        sql = "select sender,content,DATE_FORMAT(time,\"%Y-%m-%d %H:%i:%S\") as time from message where receiver=? and is_message=1";
        arg = [];
        arg.push(cur_user);
        let db_res = await connection.dbQuery(sql,arg);
        res.send({'errcode':0,'result':db_res.result,'num':db_res.result.length,'is_interviewer':1});
        res.end();
    }else{
        sql = "select content,DATE_FORMAT(time,\"%Y-%m-%d %H:%i:%S\") as time,receiver from message where sender=? and is_message=1";
        arg = [];
        arg.push(cur_user);
        let db_res = await connection.dbQuery(sql,arg);
        res.send({'errcode':0,'result':db_res.result,'num':db_res.result.length,'is_interviewer':0});
        res.end();
    }
})

router.post('/get_reply',async function(req,res){
    console.log(req.body);
    if(!req.session.username) {
        res.send({'errcode':1});//用户未登录
        res.end();
        return;
    }
    console.log(req.session.username);
    let cur_user = req.session.username;
    let other_user = req.body.other_user;
    let sql = "select sender,content,DATE_FORMAT(time,\"%Y-%m-%d %H:%i:%S\") as time,receiver,is_message from message where sender in (?,?) and receiver in (?,?)";
    let arg = [];
    arg.push(cur_user);
    arg.push(other_user);
    arg.push(cur_user);
    arg.push(other_user);
    let db_res = await  connection.dbQuery(sql,arg);
    console.log(db_res);
    res.send({'errcode':0,'result':db_res.result,'num':db_res.result.length});
    res.end();
})
router.post('/get_interviewers',async function(req,res){
    if(!req.session.username) {
        res.send({'errcode':1});//用户未登录
        res.end();
        return;
    }
    let sql = "select username,email from user where identity = 0";
    let db_res = await connection.dbQuery(sql);
    if(db_res.err===0){
        res.send({'errcode':0,'result':db_res.result});
        res.end();
    }
})
module.exports = router;