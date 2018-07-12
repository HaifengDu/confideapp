"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 订单来源
 */
var EOrderSource;
(function (EOrderSource) {
    EOrderSource[EOrderSource["Auto"] = 0] = "Auto";
    EOrderSource[EOrderSource["Transfer"] = 1] = "Transfer"; //转单
})(EOrderSource = exports.EOrderSource || (exports.EOrderSource = {}));
exports.default = EOrderSource;
