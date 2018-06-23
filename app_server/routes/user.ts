import * as express from "express";
import UserService from "../controller/User";
import { body,query, validationResult, Result } from 'express-validator/check';
import ErrorMsg from "../model/ErrorMsg";
const router = express.Router();
const userContrl = UserService.getInstance();

router.put("/",[
    body("code").not().isEmpty().withMessage('微信code不能为空'),
    body("code").isString().withMessage('微信code必须是字符串')
],(req,res)=>{
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    userContrl.bindUser(req.body.code).then(data => { 
        res.json({ data:data ,...new ErrorMsg(true,"绑定成功")});
    },err => {
        res.json(new ErrorMsg(false,err.message));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message));
    });
});

router.get("/",[
    query("weixinid").not().isEmpty().withMessage('微信id不能为空'),
    query("weixinid").isString().withMessage('微信id必须是字符串')
],(req:express.Request,res:express.Response)=>{
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    userContrl.findByWeixin(req.query.weixinid).then(result=>{
        if(!result){
            res.json(new ErrorMsg(false,"未找到对应记录"));
            return;
        }
        res.json({ data: result,...new ErrorMsg(true) });
    },err=>{
        res.json(new ErrorMsg(false,err.message));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message));
    });
});


export = router;