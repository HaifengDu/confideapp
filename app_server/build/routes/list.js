"use strict";
const express = require("express");
const check_1 = require("express-validator/check");
const List_1 = require("../controller/List");
const ErrorMsg_1 = require("../model/ErrorMsg");
const router = express.Router();
const listCtl = List_1.default.getInstance();
router.get("/", [
    check_1.query("labelid").isNumeric().withMessage("标签id不能为空并且必须是数字")
], function (req, res) {
    listCtl.getList(req.query).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
