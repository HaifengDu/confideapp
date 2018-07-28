import * as express from "express";
const middleware = require('wechat-pay').middleware;
import OrderService from "../controller/Order";
import {initConfig} from "../helper/wxPayHelper";
import { body, query, Result, validationResult } from "express-validator/check";
import ErrorMsg from "../model/ErrorMsg";
const orderService = OrderService.getInstance();
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

router.use("/payaction",middleware(initConfig).getNotify().done(function(message, req, res, next) {
    try{
        orderService.recievePay(message).then(data=>{
            res.reply('success');
        },err=>{
            res.reply(new Error(err.message));
        }).catch(err=>{
            res.reply(new Error(err.message));
        });
    }catch(e){
        //
        res.reply(e);
    }
}));

/**
 * 退款
 */
router.post("/refund",[
    body("orderid").isNumeric().withMessage("订单id不能为空"),
    query("userid").isNumeric().withMessage("用户id不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    orderService.refund(parseInt(req.query.userid),parseInt(req.body.orderid)).then(data=>{
        res.json(new ErrorMsg(true));
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

export = router;