import * as express from "express";
import { query, Result, validationResult } from "express-validator/check";
import ErrorMsg from "../model/ErrorMsg";
import BaseDataService from "../controller/BaseData";
import { checkNumber } from "../helper/checkHelper";
const router = express.Router();
const service = BaseDataService.getInstance();
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

export = router;