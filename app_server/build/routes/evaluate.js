"use strict";
const express = require("express");
const check_1 = require("express-validator/check");
const objectHelper_1 = require("../helper/objectHelper");
const Evaluate_1 = require("../controller/Evaluate");
const ErrorMsg_1 = require("../model/ErrorMsg");
const router = express.Router();
const service = Evaluate_1.default.getInstance();
router.put("/", [
    check_1.body("data").not().isEmpty().withMessage("参数不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    const model = objectHelper_1.default.parseJSON(req.body.data);
    service.create(model).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
router.get("/list", [
    check_1.query("lid").isNumeric().withMessage("倾听者id非法")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    service.getList(parseInt(req.query.lid)).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
router.get("/getaggregate", [
    check_1.query("lid").isNumeric().withMessage("倾听者id非法")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    service.getAggregate(parseInt(req.query.lid)).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
