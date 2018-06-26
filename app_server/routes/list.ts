import * as express from "express";
import { body,query, validationResult, Result } from 'express-validator/check';
import ListService from "../controller/List";
import ErrorMsg from "../model/ErrorMsg";
const router = express.Router();
const listCtl = ListService.getInstance();

router.get("/",[
    query("labelid").isNumeric().withMessage("标签id不能为空并且必须是数字")
],function(req:express.Request,res:express.Response){
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
export = router;