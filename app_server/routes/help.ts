import * as express from "express";
import { query, body, Result, validationResult } from "express-validator/check";
import ErrorMsg from "../model/ErrorMsg";
import { IHelp } from "../interface/model/IHelp";
import { EHelpStatus } from "../enum/EHelpStatus";
import HelpService from "../controller/Help";
import { IPager } from "../interface/IPager";
const router = express.Router();
const service = HelpService.getInstance();
router.put("/",[
    query("userid").not().isEmpty().withMessage("用户id不能为空"),
    body("labelid").isNumeric().withMessage("话题分类不能为空"),
    body("content").not().isEmpty().withMessage("求助内容不能为空"),
    body("money").isNumeric().withMessage("求助金额不能为空"),
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    const help:IHelp = req.body;
    help.uid = req.query.userid;
    help.status = EHelpStatus.正常;
    service.create(help).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

router.get("/list",[
    query("labelid").isInt().withMessage("话题分离非法"),
    query("start").isInt().withMessage("分页数据不正确"),
    query("limit").isInt().withMessage("分页数据不正确")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    const page:IPager = {
        start:parseInt(req.query.start),
        limit:parseInt(req.query.limit)
    };
    service.getList(req.query.labelid,page).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        })
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
})

export = router;