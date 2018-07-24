"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 消息类型
 */
var EChatMsgType;
(function (EChatMsgType) {
    /**
     * 文字
     */
    EChatMsgType[EChatMsgType["Text"] = 1] = "Text";
    /**
     * 语音
     */
    EChatMsgType[EChatMsgType["Audio"] = 2] = "Audio";
})(EChatMsgType = exports.EChatMsgType || (exports.EChatMsgType = {}));
exports.default = EChatMsgType;
