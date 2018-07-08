"use strict";
const express = require("express");
const User_1 = require("../controller/User");
const check_1 = require("express-validator/check");
const ErrorMsg_1 = require("../model/ErrorMsg");
const Listener_1 = require("../controller/Listener");
const objectHelper_1 = require("../helper/objectHelper");
const router = express.Router();
const listenerCtrl = Listener_1.default.getInstance();
const userContrl = User_1.default.getInstance(listenerCtrl);
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
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
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
        res.json(Object.assign({ data: objectHelper_1.default.serialize(result) }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
router.post("/", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.body("nickname").not().isEmpty().withMessage("用户名称不能为空"),
    check_1.body("sex").isNumeric().withMessage("性别不正确"),
    check_1.body("address").isNumeric().withMessage("地址不能为空"),
    check_1.body("birthday").not().isEmpty().withMessage("生日不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    const user = {
        id: req.query.userid,
        nickname: req.body.nickname,
        sex: req.body.sex,
        address: req.body.address,
        birthday: req.body.birthday,
        resume: req.body.resume || ""
    };
    userContrl.update(user).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
router.post("/updateOther", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.body("job").isNumeric().withMessage("职位信息不能为空"),
    check_1.body("family").isNumeric().withMessage("家庭状况不能为空"),
    check_1.body("edu").isNumeric().withMessage("教育经历不能为空"),
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    const listener = {
        job: req.body.job,
        family: req.body.family,
        edu: req.body.edu
    };
    listenerCtrl.updateListenerById(req.query.userid, listener).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
router.get("/getCheckCode", [
    check_1.query("phone").isMobilePhone("zh-CN").withMessage("非法的手机号"),
    check_1.query("userid").isNumeric().withMessage("用户id不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    userContrl.getCheckCode(req.query.phone).then(data => {
        req.session.bindphoneObj = data;
        res.json(Object.assign({ code: data.code }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
router.post("/bindphone", [
    check_1.body("phone").isMobilePhone("zh-CN").withMessage("非法的手机号"),
    check_1.body("code").isLength({ min: 6, max: 6 }).withMessage("验证码非法"),
    check_1.query("userid").isNumeric().withMessage("用户id不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    const sourceModel = req.session.bindphoneObj;
    if (!sourceModel) {
        res.json(new ErrorMsg_1.default(false, "当前手机号未发验证码"));
        return;
    }
    userContrl.bindPhoneCode(sourceModel, {
        phone: req.body.phone,
        code: req.body.code,
    }, req.query.userid).then(response => {
        res.json(new ErrorMsg_1.default(true));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
