"use strict";
const express = require("express");
const check_1 = require("express-validator/check");
const ErrorMsg_1 = require("../model/ErrorMsg");
const BaseData_1 = require("../controller/BaseData");
const checkHelper_1 = require("../helper/checkHelper");
const MainLabel_1 = require("../controller/MainLabel");
const ELabelType_1 = require("../enum/ELabelType");
const ELabelStatus_1 = require("../enum/ELabelStatus");
const Listener_1 = require("../controller/Listener");
const EBaseDataType_1 = require("../enum/EBaseDataType");
const router = express.Router();
const service = BaseData_1.default.getInstance();
const listenService = Listener_1.default.getInstance();
const mainLabelCtl = MainLabel_1.default.getInstance();
router.get("/", [
    check_1.query("type").not().isEmpty().withMessage("type不能为空"),
    check_1.query("type").isNumeric().withMessage("type必须是数字")
], function (req, res, next) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    let id = checkHelper_1.checkNumber(req.query.id) ? Number(req.query.id) : req.query.id;
    let result = service.getBaseData(parseInt(req.query.type), id);
    if (result) {
        res.json(Object.assign({ data: result }, new ErrorMsg_1.default(true)));
        return;
    }
    res.json(new ErrorMsg_1.default(false, "未找到该记录"));
});
router.get("/getAll", function (req, res) {
    const job = service.getBaseData(EBaseDataType_1.EBaseDataType.Job);
    const area = service.getBaseData(EBaseDataType_1.EBaseDataType.Area);
    const family = service.getBaseData(EBaseDataType_1.EBaseDataType.Family);
    const edu = service.getBaseData(EBaseDataType_1.EBaseDataType.Edu);
    res.json({
        success: true,
        job,
        family,
        area,
        edu
    });
});
router.get("/label", [
    check_1.query("userid").isNumeric().withMessage("userid不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    let labels;
    try {
        labels = mainLabelCtl.findSystemUnionUser(req.query.userid);
    }
    catch (error) {
        labels = [];
    }
    res.json(Object.assign({ data: labels }, new ErrorMsg_1.default(true)));
});
router.put("/label", [
    check_1.body("name").not().isEmpty().withMessage("名称不能为空"),
    check_1.body("stype").isNumeric().withMessage("标签类型不能为空"),
    check_1.query("userid").isNumeric().withMessage("用户id不能为空且必须是数字类型")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    mainLabelCtl.addLabel({
        name: req.body.name,
        ctype: ELabelType_1.ELabelCType.Custom,
        stype: req.body.type === ELabelType_1.ELabelSType.Experience ? ELabelType_1.ELabelSType.Experience : ELabelType_1.ELabelSType.Label,
        status: ELabelStatus_1.ELabelStatus.审核中,
        cuid: req.query.userid
    }).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(true, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(true, err.message, err));
    });
});
router.post("/label", [
    check_1.body("id").isNumeric().withMessage("标签id不能为空"),
    check_1.body("name").isEmpty().withMessage("标签名称不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    mainLabelCtl.update({
        id: req.body.id,
        name: req.body.name
    }).then(data => {
        res.json(new ErrorMsg_1.default(true));
    }, err => {
        res.json(new ErrorMsg_1.default(true, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(true, err.message, err));
    });
});
router.delete("/label", [
    check_1.query("id").isNumeric().withMessage("标签id不能为空"),
    check_1.query("stype").isNumeric().withMessage("标签类型不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    mainLabelCtl.deleteLabel(req.query.id, req.query.stype).then(data => {
        if (data && data.cuid) {
            listenService.deleteLabels(data.cuid, req.query.id);
        }
        res.json(new ErrorMsg_1.default(true));
    }, err => {
        res.json(new ErrorMsg_1.default(true, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(true, err.message, err));
    });
});
module.exports = router;
