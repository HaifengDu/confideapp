"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const util_1 = require("../helper/util");
const objectHelper_1 = require("../helper/objectHelper");
const check_1 = require("express-validator/check");
const Order_1 = require("../controller/Order");
const ErrorMsg_1 = require("../model/ErrorMsg");
const orderService = Order_1.default.getInstance();
const router = express.Router();
router.post("/", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.body("data").not().isEmpty().withMessage("订单数据不能为空")
], function (req, res) {
    const data = objectHelper_1.default.parseJSON(req.body.data) || {};
    const order = {
        ip: util_1.getClientIp(req),
        useragent: req.headers['user-agent'],
        uid: req.query.userid,
        lid: data.lid,
        payprice: data.payprice,
        totalprice: data.totalprice,
        balance: data.balance,
        source: data.source,
        servicetype: data.servicetype,
        payservicetime: data.payservicetime,
        uprice: data.uprice,
        comment: data.comment || ""
    };
    order.ip = util_1.getClientIp(req);
    orderService.create(order).then(data => {
        return res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        return res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        return res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
router.post("/pay", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.body("orderid").isNumeric().withMessage("订单id不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    orderService.pay(parseInt(req.query.userid), parseInt(req.body.orderid)).then(data => {
        return res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        return res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        return res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
router.get("/checkHasOrder", [
    check_1.query("uid").isNumeric().withMessage("用户id不能为空"),
    check_1.query("lid").isNumeric().withMessage("倾听者不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    orderService.checkHasOrder(req.query.uid, req.query.lid).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 聊天完成订单
 */
router.post("/chatComplete", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.body("orderid").isNumeric().withMessage("订单id不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    orderService.chatComplete(parseInt(req.query.userid), parseInt(req.body.orderid))
        .then(data => {
        let order = null;
        if (data[1] && data[1].length) {
            order = data[1][0];
        }
        res.json(Object.assign({ data: order }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 更新服务时间
 */
router.post("/updateServicetime", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.body("orderid").isNumeric().withMessage("订单id不能为空"),
    check_1.body("servicetime").isNumeric().withMessage("服务时长不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    orderService.updateServicetime(parseInt(req.query.userid), parseInt(req.body.orderid), parseFloat(req.body.servicetime)).then(data => {
        let order = null;
        if (data[1] && data[1].length) {
            order = data[1][0];
        }
        res.json(Object.assign({ data: order }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 更新订单为服务中
 */
router.post("/updateServicing", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.body("orderid").isNumeric().withMessage("订单id不能为空"),
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    orderService.updateServicing(parseInt(req.query.userid), parseInt(req.body.orderid)).then(data => {
        let order = null;
        if (data[1] && data[1].length) {
            order = data[1][0];
        }
        res.json(Object.assign({ data: order }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 获取统计数据
 */
router.get("/getSummaryData", [
    check_1.query("lid").isNumeric().withMessage("用户id不能为空"),
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    orderService.getSummaryData(parseInt(req.query.lid)).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 退款
 */
router.post("/refound", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.body("orderid").isNumeric().withMessage("订单id不能为空")
], function (req, res) {
    orderService.refund(req.query.userid, req.body.orderid).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 支付
 */
router.post("/pay", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.body("orderid").isNumeric().withMessage("订单id不能为空")
], function (req, res) {
    orderService.pay(req.query.userid, req.body.orderid).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 获取订单列表
 */
router.get("/getOrderList", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.query("status").not().isEmpty().withMessage("状态不能为空"),
    check_1.query("start").isNumeric().withMessage("分页数据出错"),
    check_1.query("limit").isNumeric().withMessage("分页数据错误")
], function (req, res) {
    const status = req.query.status.split(",").map(item => parseInt(item));
    const start = parseInt(req.query.start);
    const limit = parseInt(req.query.limit);
    orderService.getOrderList(req.query.userid, status, { start, limit }).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
