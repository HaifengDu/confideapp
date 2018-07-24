"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 消息状态
 */
var EChatMsgStatus;
(function (EChatMsgStatus) {
    /**
     * 已发送
     */
    EChatMsgStatus[EChatMsgStatus["Send"] = 1] = "Send";
    /**
     * 已读
     */
    EChatMsgStatus[EChatMsgStatus["Readed"] = 2] = "Readed";
})(EChatMsgStatus = exports.EChatMsgStatus || (exports.EChatMsgStatus = {}));
exports.default = EChatMsgStatus;
