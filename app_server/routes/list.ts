import * as express from "express";
import { body,query, validationResult, Result } from 'express-validator/check';
import ListService from "../controller/List";
import ErrorMsg from "../model/ErrorMsg";
const router = express.Router();
const listCtl = ListService.getInstance();

router.get("/",function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    listCtl.getList(req.query).then(data=>{
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
        start:req.query.start,
        limit:req.query.limit
    }).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
})
export = router;