"use strict";
const express = require("express");
const check_1 = require("express-validator/check");
const ErrorMsg_1 = require("../model/ErrorMsg");
const BaseData_1 = require("../controller/BaseData");
const checkHelper_1 = require("../helper/checkHelper");
const router = express.Router();
const service = BaseData_1.default.getInstance();
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
module.exports = router;
