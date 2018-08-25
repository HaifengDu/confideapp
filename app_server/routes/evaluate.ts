import * as express from "express";
import { body, Result, validationResult, query } from "express-validator/check";
import ObjectHelper from "../helper/objectHelper";
import { IEvaluate } from "../interface/model/IEvaluate";
import EvaluateService from "../controller/Evaluate";
import ErrorMsg from "../model/ErrorMsg";
const router = express.Router();
const service = EvaluateService.getInstance();
router.put("/",[
    body("data").not().isEmpty().withMessage("参数不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    const model = ObjectHelper.parseJSON<IEvaluate>(req.body.data);
    service.create(model).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    })
});
router.get("/list",[
    query("start").isNumeric().withMessage("start必须是数字"),
    query("limit").isNumeric().withMessage("limit必须是数字"),
    query("status").isNumeric().withMessage("满意度不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    const lid = parseInt(req.query.lid);
    const uid = parseInt(req.query.uid);
    if(isNaN(lid)&&isNaN(uid)){
        res.json(new ErrorMsg(false,"倾听者和倾诉者不能同时为空"))
    }
    let promise:any;
    if(lid){
        promise = service.getList(lid,parseInt(req.query.status),{
            start:parseInt(req.query.start),
            limit:parseInt(req.query.limit)
        });
    }else{
        promise = service.getListByUid(uid,parseInt(req.query.status),{
            start:parseInt(req.query.start),
            limit:parseInt(req.query.limit)
        });
    }
    promise.then(data=>{
        res.json({
            ...data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    })
});

router.get("/getaggregate",[
    query("lid").isNumeric().withMessage("倾听者id非法")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    service.getAggregate(parseInt(req.query.lid)).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    })
});

router.post("/reply",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("eid").isNumeric().withMessage("评论id不能为空"),
    body("message").not().isEmpty().withMessage("回复信息不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    service.reply(parseInt(req.query.eid),parseInt(req.body.userid),req.body.message).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    })
});

export = router;