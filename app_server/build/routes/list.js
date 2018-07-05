"use strict";
const express = require("express");
const check_1 = require("express-validator/check");
const List_1 = require("../controller/List");
const ErrorMsg_1 = require("../model/ErrorMsg");
const router = express.Router();
const listCtl = List_1.default.getInstance();
router.get("/", function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    listCtl.getList(req.query).then(data => {
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
        start: req.query.start,
        limit: req.query.limit
    }).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
