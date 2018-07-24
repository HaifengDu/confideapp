import ChatRecordService from '../controller/ChatRecord';
import * as express from 'express';
import { query } from 'express-validator/check';
import ErrorMsg from '../model/ErrorMsg';
// import * as path from "path";
const router = express.Router();
const service = ChatRecordService.getInstance();
// router.get("/",function(req,res,next){
//     res.sendFile(path.resolve("./views/chat.html"));
// });

router.get("/",[
    query("roomid").not().isEmpty().withMessage("roomid不能为空")
],function(req:express.Request,res:express.Response){
    service.getRecord(req.query.roomid).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    })
})

export = router;