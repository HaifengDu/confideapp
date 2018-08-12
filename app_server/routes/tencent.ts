import * as express from "express";
import { query, Result, validationResult } from "express-validator/check";
import ErrorMsg from "../model/ErrorMsg";
const {genUserSig, genPrivateMapKey} = require("../../tencent/WebRTCSigApi")
const router = express.Router();
const sdkappid = '1400106449';
const accountType = '30119';
router.get("/getSig",[
    query("userid").isNumeric().withMessage("用户名不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    genUserSig({
        userid:req.query.userid,
        sdkappid,
        accountType
    },function(err,data){
        if(err){
            res.json(new ErrorMsg(false, err.message, err));
            return;
        }
        res.json({
            data,...new ErrorMsg(true)
        });
    });
});

router.get("/genPrivateMapKey",[
    query("userid").isNumeric().withMessage("用户名不能为空"),
    query("roomid").not().isEmpty().withMessage("房间id不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    genPrivateMapKey({
        userid:req.query.userid,
        roomid:req.query.roomid,
        sdkappid,
        accountType
    },function(err,data){
        if(err){
            res.json(new ErrorMsg(false, err.message, err));
            return;
        }
        res.json({
            data,...new ErrorMsg(true)
        });
    });
});
export = router;