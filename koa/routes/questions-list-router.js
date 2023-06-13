/***********All edited by ZHJ**************/
var express = require('express');
var router = express.Router();
var connection = require('../database/connection');

router.post('/',async function (req, res){
    console.log(req.body);
})


router.post('/get_questions_list',async function (req, res){
    console.log(req.body);
    let startNum = req.body.startNum;
    let endNum = req.body.endNum;
    let result = {
        "questionsList": [],
        "totalNum": -1,
        "errcode": 0
    };
    if(startNum === undefined || endNum === undefined){
        startNum = 1;
        endNum = 10;
    }
    //获取题目总数
    let sql_1 = "select count(*) as totalNum from Questions";
    let args_1 = [];
    let resDB_1 = await connection.dbQuery(sql_1, args_1)
    //数据库操作结果处理
    if(resDB_1.err === 0){
        result.totalNum = resDB_1.result[0].totalNum
    }
    else {
        result.errcode = -1;
        console.log(result)
        res.send(result)
        res.end()
        return;
    }
    //获取题目
    let sql_2 = "select QID,Title,DATE_FORMAT(Time,\"%Y-%m-%d\") as Time,Difficulty from Questions where QID between ? and ?";
    let args_2 = [startNum, endNum]
    let resDB_2 = await connection.dbQuery(sql_2, args_2)
    if(resDB_2.err === 0){
        result.questionsList = resDB_2.result
        console.log(result)
        res.send(result);
        res.end()
    }
    else {//错误处理
        if (resDB_2.err === -1) {
            result.errcode = -1;
            console.log(result)
            res.send(result)
            res.end()
            return
        }
        if (resDB_2.err === -2) {
            result.errcode = -2;
            console.log(result)
            res.send(result)
            res.end()
        }
    }
})

module.exports = router;