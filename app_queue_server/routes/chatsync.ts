import * as express from "express";
import ErrorMsg from "../model/ErrorMsg";
import ObjectHelper from "../helper/objectHelper";
import _ = require("lodash");
import ChatSyncService from "../controller/ChatSyncService";
const router = express.Router();
const chatSyncService = ChatSyncService.getInstance();

router.get("/",function(req,res){
    if(!req.query.cids){
        res.json(new ErrorMsg(false,"传入的id不能为空"));
        return;
    }
    const cids = ObjectHelper.serialize(req.query.cids);
    if(!_.isArray(cids)||cids.length===0){
        res.json(new ErrorMsg(false,"传入的id不能为空"));
        return;
    }
    chatSyncService.syncAudio(cids).then(data=>{
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