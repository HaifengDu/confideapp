"use strict";
const ChatRecord_1 = require("../controller/ChatRecord");
const express = require("express");
const check_1 = require("express-validator/check");
const ErrorMsg_1 = require("../model/ErrorMsg");
// import * as path from "path";
const router = express.Router();
const service = ChatRecord_1.default.getInstance();
// router.get("/",function(req,res,next){
//     res.sendFile(path.resolve("./views/chat.html"));
// });
router.get("/", [
    check_1.query("roomid").not().isEmpty().withMessage("roomid不能为空")
], function (req, res) {
    service.getRecord(req.query.roomid).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
