"use strict";
const express = require("express");
const check_1 = require("express-validator/check");
const ErrorMsg_1 = require("../model/ErrorMsg");
const EHelpStatus_1 = require("../enum/EHelpStatus");
const Help_1 = require("../controller/Help");
const router = express.Router();
const service = Help_1.default.getInstance();
router.put("/", [
    check_1.query("userid").not().isEmpty().withMessage("用户id不能为空"),
    check_1.body("labelid").isNumeric().withMessage("话题分类不能为空"),
    check_1.body("content").not().isEmpty().withMessage("求助内容不能为空"),
    check_1.body("money").isNumeric().withMessage("求助金额不能为空"),
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    const help = req.body;
    help.uid = req.query.userid;
    help.status = EHelpStatus_1.EHelpStatus.正常;
    service.create(help).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
router.get("/list", [
    check_1.query("labelid").isInt().withMessage("话题分离非法"),
    check_1.query("start").isInt().withMessage("分页数据不正确"),
    check_1.query("limit").isInt().withMessage("分页数据不正确")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    const page = {
        start: parseInt(req.query.start),
        limit: parseInt(req.query.limit)
    };
    service.getList(req.query.labelid, page).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
