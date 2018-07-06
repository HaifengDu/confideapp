"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const ErrorMsg_1 = require("../model/ErrorMsg");
const objectHelper_1 = require("../helper/objectHelper");
const _ = require("lodash");
const ChatSyncService_1 = require("../controller/ChatSyncService");
const router = express.Router();
const chatSyncService = ChatSyncService_1.default.getInstance();
router.get("/", function (req, res) {
    if (!req.query.cids) {
        res.json(new ErrorMsg_1.default(false, "传入的id不能为空"));
        return;
    }
    const cids = objectHelper_1.default.serialize(req.query.cids);
    if (!_.isArray(cids) || cids.length === 0) {
        res.json(new ErrorMsg_1.default(false, "传入的id不能为空"));
        return;
    }
    chatSyncService.syncAudio(cids).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
