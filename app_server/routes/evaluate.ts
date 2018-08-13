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
    query("lid").isNumeric().withMessage("倾听者id非法")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    service.getList(parseInt(req.query.lid)).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
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

export = router;