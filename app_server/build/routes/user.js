"use strict";
const express = require("express");
const User_1 = require("../controller/User");
const check_1 = require("express-validator/check");
const ErrorMsg_1 = require("../model/ErrorMsg");
const router = express.Router();
const userContrl = User_1.default.getInstance();
router.put("/", [
    check_1.body("code").not().isEmpty().withMessage('微信code不能为空'),
    check_1.body("code").isString().withMessage('微信code必须是字符串')
], (req, res) => {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    userContrl.bindUser(req.body.code).then(data => {
        res.json(Object.assign({ data: data }, new ErrorMsg_1.default(true, "绑定成功")));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message));
    });
});
router.get("/", [
    check_1.query("weixinid").not().isEmpty().withMessage('微信id不能为空'),
    check_1.query("weixinid").isString().withMessage('微信id必须是字符串')
], (req, res) => {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    userContrl.findByWeixin(req.query.weixinid).then(result => {
        if (!result) {
            res.json(new ErrorMsg_1.default(false, "未找到对应记录"));
            return;
        }
        res.json(Object.assign({ data: result }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message));
    });
});
module.exports = router;
