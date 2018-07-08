import * as express from "express";
import { query, body,Result, validationResult } from "express-validator/check";
import ErrorMsg from "../model/ErrorMsg";
import BaseDataService from "../controller/BaseData";
import { checkNumber } from "../helper/checkHelper";
import MainLabelService from "../controller/MainLabel";
import { IMainLabel } from "../interface/model/IMainLabel";
import { ELabelCType, ELabelSType } from "../enum/ELabelType";
import { ELabelStatus } from "../enum/ELabelStatus";
import ListenerService from "../controller/Listener";
import { EBaseDataType } from "../enum/EBaseDataType";
const router = express.Router();
const service = BaseDataService.getInstance();
const listenService = ListenerService.getInstance();
const mainLabelCtl = MainLabelService.getInstance();
router.get("/",[
    query("type").not().isEmpty().withMessage("type不能为空"),
    query("type").isNumeric().withMessage("type必须是数字")
],function(req:express.Request,res:express.Response,next:express.NextFunction){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    let id = checkNumber(req.query.id)?Number(req.query.id):req.query.id;
    let result = service.getBaseData(parseInt(req.query.type),id);
    if(result){
        res.json({data:result,...new ErrorMsg(true)});
        return;
    }
    res.json(new ErrorMsg(false,"未找到该记录"));
});
router.get("/getAll",function(req,res){
    const job = service.getBaseData(EBaseDataType.Job);
    const area = service.getBaseData(EBaseDataType.Area);
    const family = service.getBaseData(EBaseDataType.Family);
    const edu = service.getBaseData(EBaseDataType.Edu);
    res.json({
        success:true,
        job,
        family,
        area,
        edu
    });
});
router.get("/label",[
    query("userid").isNumeric().withMessage("userid不能为空")
],function(req,res){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
   let labels:IMainLabel[];
   try {
        labels =  mainLabelCtl.findSystemUnionUser(req.query.userid);
   } catch (error) {
        labels = [];
   }
   res.json({
       data:labels,
       ...new ErrorMsg(true)
   });
});
router.put("/label",[
    body("name").not().isEmpty().withMessage("名称不能为空"),
    body("stype").isNumeric().withMessage("标签类型不能为空"),
    query("userid").isNumeric().withMessage("用户id不能为空且必须是数字类型")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    mainLabelCtl.addLabel({
        name:req.body.name,
        ctype:ELabelCType.Custom,
        stype:req.body.type===ELabelSType.Experience?ELabelSType.Experience:ELabelSType.Label,
        status:ELabelStatus.审核中,
        cuid:req.query.userid
    }).then(data=>{
        res.json({data,...new ErrorMsg(true)});
    },err=>{
        res.json(new ErrorMsg(true,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(true,err.message,err));
    });
});
router.post("/label",[
    body("id").isNumeric().withMessage("标签id不能为空"),
    body("name").isEmpty().withMessage("标签名称不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    mainLabelCtl.update({
        id:req.body.id,
        name:req.body.name
    }).then(data=>{
        res.json(new ErrorMsg(true));
    },err=>{
        res.json(new ErrorMsg(true,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(true,err.message,err));
    });
});

router.delete("/label",[
    query("id").isNumeric().withMessage("标签id不能为空"),
    query("stype").isNumeric().withMessage("标签类型不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    mainLabelCtl.deleteLabel(req.query.id,req.query.stype).then(data=>{
        if(data&&data.cuid){
            listenService.deleteLabels(data.cuid,req.query.id);
        }
        res.json(new ErrorMsg(true));
    },err=>{
        res.json(new ErrorMsg(true,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(true,err.message,err));
    });
})
export = router;