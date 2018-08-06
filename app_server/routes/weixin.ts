import * as express from "express";
const crypto = require('crypto');
import { body, query, validationResult, Result } from 'express-validator/check';
import WeixinHelper from "../helper/weixinHelper";
import ErrorMsg from "../model/ErrorMsg";

const router = express.Router();

router.get("/", function(req, res, next) {
    const signature = req.query.signature, //微信加密签名
        timestamp = req.query.timestamp, //时间戳
        nonce = req.query.nonce, //随机数
        echostr = req.query.echostr; //随机字符串

    //2.将token、timestamp、nonce三个参数进行字典序排序
    const array = ["confide_test", timestamp, nonce];
    array.sort();

    //3.将三个参数字符串拼接成一个字符串进行sha1加密
    const tempStr = array.join('');
    const hashCode = crypto.createHash('sha1'); //创建加密类型 
    const resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); //对传入的字符串进行加密

    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (resultCode === signature) {
        res.send(echostr);
    } else {
        res.send('mismatch');
    }
});

router.get("/getConfig",function(req,res){
    console.log(req.query);
    WeixinHelper.getJsConfig(req.query.url).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

router.get("/getAccesstoken",[
    query("code").not().isEmpty().withMessage("code不能为空"),
    query("code").isString().withMessage("code必须是字符串")
], function(req:express.Request, res:express.Response, next) {
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ success:false,msg: errors.array()[0].msg });
    }
    WeixinHelper.getAccesstoken(req.query.code).then(response=>{
        res.json(response);
    },err=>{
        res.json({
            success:false,
            msg:"服务器内部错误，请稍后重试"
        })
    }).catch(err=>{
        res.json({
            success:false,
            msg:"服务器内部错误，请稍后重试"
        })
    });
});
router.get("/getUserinfo",[
    query("code").not().isEmpty().withMessage("code不能为空"),
    query("code").isString().withMessage("code必须是字符串")
],function(req:express.Request,res:express.Response,next){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ success:false,msg: errors.array()[0].msg });
    }
    WeixinHelper.getUserinfoByCode(req.query.code).then(response=>{
        res.json({data:response,...new ErrorMsg(true)});
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err))
    });
});
export = router;
