import * as express from "express";
import { body,query, validationResult, Result } from 'express-validator/check';
import ListService from "../controller/List";
import ErrorMsg from "../model/ErrorMsg";
import ObjectHelper from "../helper/objectHelper";
// import ObjectHelper from "../helper/objectHelper";
// import OrderService from "../controller/Order";
const router = express.Router();
const listCtl = ListService.getInstance();

router.post("/",function(req:express.Request,res:express.Response){
    const data = req.body.data;
    if (!data) {
        res.json(new ErrorMsg(false,"参数错误"));
        return;
    }
    listCtl.getList(ObjectHelper.parseJSON(data)).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});
router.get("/search",[
    query("name").not().isEmpty().withMessage("名称不能为空"),
    query("start").isNumeric().withMessage("分页不能为空"),
    query("limit").isNumeric().withMessage("分页不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    listCtl.getSearch(req.query.name,{
        start:parseInt(req.query.start),
        limit:parseInt(req.query.limit)
    }).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});
export = router;