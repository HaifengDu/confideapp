"use strict";
const express = require("express");
const middleware = require('wechat-pay').middleware;
const Order_1 = require("../controller/Order");
const wxPayHelper_1 = require("../helper/wxPayHelper");
const check_1 = require("express-validator/check");
const ErrorMsg_1 = require("../model/ErrorMsg");
const orderService = Order_1.default.getInstance();
const router = express.Router();
// router.post("/payaction",function(req,res){
//     orderService.recieve(req).then(()=>{
//         res.send(`<xml>
//         <return_code><![CDATA[SUCCESS]]></return_code>
//         <return_msg><![CDATA[OK]]></return_msg>
//         </xml>`);
//     },err=>{
//         res.json(new ErrorMsg(false,err.message,err));
//     }).catch(err=>{
//         res.json(new ErrorMsg(false,err.message,err));
//     });
// });
router.use("/payaction", middleware(wxPayHelper_1.initConfig).getNotify().done(function (message, req, res, next) {
    try {
        orderService.recievePay(message).then(data => {
            res.reply('success');
        }, err => {
            res.reply(new Error(err.message));
        }).catch(err => {
            res.reply(new Error(err.message));
        });
    }
    catch (e) {
        //
        res.reply(e);
    }
}));
/**
 * 退款
 */
router.post("/refund", [
    check_1.body("orderid").isNumeric().withMessage("订单id不能为空"),
    check_1.query("userid").isNumeric().withMessage("用户id不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    orderService.refund(parseInt(req.query.userid), parseInt(req.body.orderid)).then(data => {
        res.json(new ErrorMsg_1.default(true));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
