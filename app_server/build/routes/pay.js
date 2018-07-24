"use strict";
const express = require("express");
const Order_1 = require("../controller/Order");
const ErrorMsg_1 = require("../model/ErrorMsg");
const orderService = Order_1.default.getInstance();
const router = express.Router();
router.post("/payaction", function (req, res) {
    orderService.recieve(req).then(() => {
        res.send(`<xml>
        <return_code><![CDATA[SUCCESS]]></return_code>
        <return_msg><![CDATA[OK]]></return_msg>
        </xml>`);
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
