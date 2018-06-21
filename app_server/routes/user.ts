import * as express from "express";
import UserService from "../controller/User";
import { body,query, validationResult, Result } from 'express-validator/check';
import { IUser } from "../interface/model/IUser";
import { ERole } from "../enum/ERole";
const router = express.Router();
const userContrl = UserService.getInstance();

router.put("/",[
    body("weixinid").not().isEmpty().withMessage('微信id不能为空'),
    body("weixinid").isString().withMessage('微信id必须是字符串')
],(req,res)=>{
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ success:false,msg: errors.array()[0].msg });
    }
    const user:IUser = {weixinid:req.body.weixinid,role:ERole.Pourouter};
    userContrl.create(user).then(() => {
        res.json({ success: true, msg: "新增成功" });
    },err => {
            res.json({ success: false, msg: "服务器内部错误，稍后重试" });
    }).catch(err=>{
        res.json({ success: false, msg: "服务器内部错误，稍后重试" });
    });
});

router.get("/",[
    query("weixinid").not().isEmpty().withMessage('微信id不能为空'),
    query("weixinid").isString().withMessage('微信id必须是字符串')
],(req:express.Request,res:express.Response)=>{
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ success:false,msg: errors.array()[0].msg });
    }
    userContrl.findByWeixin(req.query.weixinid).then(result=>{
        if(!result){
            res.json({ success: false, msg: "未找到对应记录" });
        }
        res.json({ success: true, data: result });
    },err=>{
        res.json({ success: false, msg: "服务器内部错误，稍后重试" });
    }).catch(err=>{
        res.json({ success: false, msg: "服务器内部错误，稍后重试" });
    });
});


export = router;