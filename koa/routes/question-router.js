/***********All edited by ZHJ**************/
let express = require('express');
let router = express.Router();
let connection = require('../database/connection');
router.post('/get_question_detail',async function (req, res){
    let id = req.query.id;
    let result = {
        "QID": -1,
        "title": "",
        "time": "",
        "difficulty": "",
        "content": "",
        "remark": "",
        "inputFormat": "",
        "inputExample": "",
        "outputExample": "",
        "errcode": 0
    }
    //sql语句
    let sql = "select QID, Title, Time, Difficulty, Content, Remark, InputFormat, InputExample, OutputExample from Questions where QId = ?";
    let args = [id]
    let resDB = await connection.dbQuery(sql, args)
    console.log(resDB)
    //数据库操作结果处理
    if(resDB.err === 0){
        console.log("damadmda");
        console.log(resDB.result);
        if(resDB.result.length == 0){
            console.log("damadmda");
            result.errcode = -2;
            res.send(result);
            res.end();
            return;
        }
        result.QID = resDB.result[0].QID
        result.title = resDB.result[0].Title
        result.time = resDB.result[0].Time
        result.difficulty = resDB.result[0].Difficulty
        result.content = resDB.result[0].Content
        result.remark = resDB.result[0].Remark
        result.inputFormat = resDB.result[0].InputFormat
        result.inputExample = resDB.result[0].InputExample
        result.outputExample = resDB.result[0].OutputExample
        console.log(result)
        res.send(result)
        res.end()
    }
    else {//错误处理
        if(resDB.err === -1){
            result.errcode = -1
            res.send(result)
            res.end()
        }
        else {
            result.errcode = -2;
            console.log(result)
            res.send(result)
            res.end()
        }
    }
})

router.post('/new_question', async (req,res)=>{
    console.log(req.body);
    let title = req.body.title;
    let difficulty = req.body.difficulty;
    let content = req.body.content;
    let remark = req.body.remark;
    let inputFormat = req.body.inputFormat;
    let inputExample = req.body.inputExample;
    let outputExample = req.body.outputExample;

    let result = {
        "QID": -1,
        "errcode": 0
    }

    //新建问题
    let sql = "insert Questions(Title, Time, Difficulty, Content, Remark, InputFormat, InputExample, OutputExample) values (?,now(),?,?,?,?,?,?);";
    let args = [title, difficulty, content, remark, inputFormat, inputExample, outputExample];
    let resDB = await connection.dbQuery(sql, args);
    console.log(resDB)
    if(resDB.err === 0){
        result.QID = resDB.result.insertId;
        res.send(result);
        res.end();
    }
    else{
        console.log(resDB)
        if (resDB.err === -1) {
            //数据库错误处理
            result.errcode = -1
            res.send(result)
            res.end()
        } else {
            result.errcode = -2;
            console.log(result)
            res.send(result)
            res.end()
        }
    }
})

module.exports = router;