"use strict";
const express = require("express");
const User_1 = require("../controller/User");
const check_1 = require("express-validator/check");
const ERole_1 = require("../enum/ERole");
const router = express.Router();
const userContrl = User_1.default.getInstance();
router.put("/", [
    check_1.body("weixinid").not().isEmpty().withMessage('微信id不能为空'),
    check_1.body("weixinid").isString().withMessage('微信id必须是字符串')
], (req, res) => {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ success: false, msg: errors.array()[0].msg });
    }
    const user = { weixinid: req.body.weixinid, role: ERole_1.ERole.Pourouter };
    userContrl.create(user).then(() => {
        res.json({ success: true, msg: "新增成功" });
    }, err => {
        res.json({ success: false, msg: "服务器内部错误，稍后重试" });
    }).catch(err => {
        res.json({ success: false, msg: "服务器内部错误，稍后重试" });
    });
});
router.get("/", [
    check_1.query("weixinid").not().isEmpty().withMessage('微信id不能为空'),
    check_1.query("weixinid").isString().withMessage('微信id必须是字符串')
], (req, res) => {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ success: false, msg: errors.array()[0].msg });
    }
    userContrl.findByWeixin(req.query.weixinid).then(result => {
        if (!result) {
            res.json({ success: false, msg: "未找到对应记录" });
        }
        res.json({ success: true, data: result });
    }, err => {
        res.json({ success: false, msg: "服务器内部错误，稍后重试" });
    }).catch(err => {
        res.json({ success: false, msg: "服务器内部错误，稍后重试" });
    });
});
module.exports = router;
