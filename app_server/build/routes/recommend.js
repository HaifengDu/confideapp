"use strict";
const express = require("express");
const Recommend_1 = require("../controller/Recommend");
const ErrorMsg_1 = require("../model/ErrorMsg");
const recommendCtrl = Recommend_1.default.getInstance();
const router = express.Router();
router.get("/home", function (req, res) {
    recommendCtrl.getHomeRecommend().then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
