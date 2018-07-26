"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 订单状态
 */
var EOrderStatus;
(function (EOrderStatus) {
    /**
     * 待付款
     */
    EOrderStatus[EOrderStatus["Awaiting_Payment"] = 1] = "Awaiting_Payment";
    /**
     * 已付款
     */
    EOrderStatus[EOrderStatus["Paid"] = 2] = "Paid";
    /**
     * 服务中
     */
    EOrderStatus[EOrderStatus["Servicing"] = 3] = "Servicing";
    /**
     * 待评论
     */
    EOrderStatus[EOrderStatus["Awaiting_Comment"] = 4] = "Awaiting_Comment";
    /**
     * 已取消
     */
    EOrderStatus[EOrderStatus["Cancelled"] = 5] = "Cancelled";
    /**
     * 已完成
     */
    EOrderStatus[EOrderStatus["Completed"] = 6] = "Completed";
})(EOrderStatus = exports.EOrderStatus || (exports.EOrderStatus = {}));
exports.default = EOrderStatus;
