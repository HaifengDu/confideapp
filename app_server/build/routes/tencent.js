"use strict";
const express = require("express");
const check_1 = require("express-validator/check");
const ErrorMsg_1 = require("../model/ErrorMsg");
const { genUserSig, genPrivateMapKey } = require("../../tencent/WebRTCSigApi");
const router = express.Router();
const sdkappid = '1400106449';
const accountType = '30119';
router.get("/getSig", [
    check_1.query("userid").isNumeric().withMessage("用户名不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    genUserSig({
        userid: req.query.userid,
        sdkappid,
        accountType
    }, function (err, data) {
        if (err) {
            res.json(new ErrorMsg_1.default(false, err.message, err));
            return;
        }
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    });
});
router.get("/genPrivateMapKey", [
    check_1.query("userid").isNumeric().withMessage("用户名不能为空"),
    check_1.query("roomid").not().isEmpty().withMessage("房间id不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    genPrivateMapKey({
        userid: req.query.userid,
        roomid: req.query.roomid,
        sdkappid,
        accountType
    }, function (err, data) {
        if (err) {
            res.json(new ErrorMsg_1.default(false, err.message, err));
            return;
        }
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    });
});
module.exports = router;
