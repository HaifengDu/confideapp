import * as express from "express";
import { IOrder } from "../interface/model/IOrder";
import { getClientIp } from "../helper/util";
import ObjectHelper from "../helper/objectHelper";
import { query, body, Result, validationResult } from "express-validator/check";
import OrderService from "../controller/Order";
import ErrorMsg from "../model/ErrorMsg";
const orderService = OrderService.getInstance();
const router = express.Router();
router.post("/",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("data").not().isEmpty().withMessage("订单数据不能为空")
],function(req:express.Request,res:express.Response){
    const data = ObjectHelper.parseJSON(req.body.data)||{};
    const order:IOrder = {
        ip : getClientIp(req),
        useragent:<string>req.headers['user-agent'],
        uid:req.query.userid,
        lid:data.lid,
        payprice:data.payprice,
        totalprice:data.totalprice,
        balance:data.balance,
        source:data.source,
        servicetype:data.servicetype,
        payservicetime:data.payservicetime,
        uprice:data.uprice,
        comment:data.comment||""
    };
    order.ip = getClientIp(req);
    orderService.create(order).then(data=>{
        return res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        return res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        return res.json(new ErrorMsg(false,err.message,err));
    });
});

router.post("/pay",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("orderid").isNumeric().withMessage("订单id不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    orderService.pay(parseInt(req.query.userid),parseInt(req.body.orderid)).then(data=>{
        return res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        return res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        return res.json(new ErrorMsg(false,err.message,err));
    });
});

router.get("/checkHasOrder",[
    query("uid").isNumeric().withMessage("用户id不能为空"),
    query("lid").isNumeric().withMessage("倾听者不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    orderService.checkHasOrder(req.query.uid,req.query.lid).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

/**
 * 聊天完成订单
 */
router.post("/chatComplete",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("orderid").isNumeric().withMessage("订单id不能为空"),
    body("servicetime").isNumeric().withMessage("服务时长不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    orderService.chatComplete(parseInt(req.query.userid),parseInt(req.body.orderid),parseFloat(req.body.servicetime))
    .then(data=>{
        let order:IOrder = null;
        if(data[1]&&data[1].length){
            order = data[1][0];
        }
        res.json({
            data:order,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

/**
 * 更新服务时间
 */
router.post("/updateServicetime",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("orderid").isNumeric().withMessage("订单id不能为空"),
    body("servicetime").isNumeric().withMessage("服务时长不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    orderService.updateServicetime(parseInt(req.query.userid),parseInt(req.body.orderid),parseFloat(req.body.servicetime)).then(data=>{
        let order:IOrder = null;
        if(data[1]&&data[1].length){
            order = data[1][0];
        }
        res.json({
            data:order,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

/**
 * 更新订单为服务中
 */
router.post("/updateServicing",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("orderid").isNumeric().withMessage("订单id不能为空"),
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    orderService.updateServicing(parseInt(req.query.userid),parseInt(req.body.orderid)).then(data=>{
        let order:IOrder = null;
        if(data[1]&&data[1].length){
            order = data[1][0];
        }
        res.json({
            data:order,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

/**
 * 获取统计数据
 */
router.get("/getSummaryData",[
    query("lid").isNumeric().withMessage("用户id不能为空"),
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    orderService.getSummaryData(parseInt(req.query.lid)).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

/**
 * 退款
 */
router.post("/refound",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("orderid").isNumeric().withMessage("订单id不能为空")
],function(req:express.Request,res:express.Response){
    orderService.refund(req.query.userid,req.body.orderid).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

/**
 * 支付
 */
router.post("/pay",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("orderid").isNumeric().withMessage("订单id不能为空")
],function(req:express.Request,res:express.Response){
    orderService.pay(req.query.userid,req.body.orderid).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

/**
 * 获取订单列表
 */
router.get("/getOrderList",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    query("status").not().isEmpty().withMessage("状态不能为空"),
    query("start").isNumeric().withMessage("分页数据出错"),
    query("limit").isNumeric().withMessage("分页数据错误")
],function(req:express.Request,res:express.Response){
    const status = req.query.status.split(",").map(item=>parseInt(item));
    const start = parseInt(req.query.start);
    const limit = parseInt(req.query.limit);
    orderService.getOrderList(req.query.userid,status,{start,limit}).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

module.exports = router;