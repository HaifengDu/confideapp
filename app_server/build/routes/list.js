"use strict";
const express = require("express");
const check_1 = require("express-validator/check");
const List_1 = require("../controller/List");
const ErrorMsg_1 = require("../model/ErrorMsg");
const objectHelper_1 = require("../helper/objectHelper");
// import ObjectHelper from "../helper/objectHelper";
// import OrderService from "../controller/Order";
const router = express.Router();
const listCtl = List_1.default.getInstance();
router.post("/", function (req, res) {
    const data = req.body.data;
    if (!data) {
        res.json(new ErrorMsg_1.default(false, "参数错误"));
        return;
    }
    listCtl.getList(objectHelper_1.default.parseJSON(data)).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
router.get("/search", [
    check_1.query("name").not().isEmpty().withMessage("名称不能为空"),
    check_1.query("start").isNumeric().withMessage("分页不能为空"),
    check_1.query("limit").isNumeric().withMessage("分页不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    listCtl.getSearch(req.query.name, {
        start: parseInt(req.query.start),
        limit: parseInt(req.query.limit)
    }).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
