"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 订单来源
 */
var EOrderSource;
(function (EOrderSource) {
    /**
     * 自动下单
     */
    EOrderSource[EOrderSource["Auto"] = 1] = "Auto";
    /**
     * 转单
     */
    EOrderSource[EOrderSource["Transfer"] = 2] = "Transfer"; //
})(EOrderSource = exports.EOrderSource || (exports.EOrderSource = {}));
exports.default = EOrderSource;
