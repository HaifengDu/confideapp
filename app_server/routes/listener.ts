import * as express from "express";
import { body,query, validationResult, Result } from 'express-validator/check';
import * as multer from "multer";
import * as crypto from 'crypto';
import * as fs from "fs";
import * as path from "path";
import * as uuid from "uuid";
import ErrorMsg from "../model/ErrorMsg";
import ListenerService from "../controller/Listener";
const router = express.Router();
const listenCtrl = ListenerService.getInstance();

const storage = multer.diskStorage({
    destination: function (req:express.Request, file, cb) {
        let dir = `../../files/images/${req.query.userid}`;
        dir = path.resolve(__dirname,dir);
        fs.exists(dir,exist=>{
            if(!exist){
                fs.mkdir(dir,err=>{
                    if(err){
                        cb(err,null);
                        return;
                    }
                    cb(null, dir)
                })
            }else{
                cb(null,dir);
            }
        });
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(null, uuid().toString()+extname);
    }
  })
  
const upload = multer({ storage: storage })
router.put("/",
    [query("userid").isNumeric().withMessage("用户编号非法")],
    upload.array("certificatefiles",6),
    function(req:express.Request,res:express.Response,next){
        const errors:Result<{msg:string}> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json(new ErrorMsg(false,errors.array()[0].msg ));
        }
        req.body.uid = req.query.userid;
        listenCtrl.bindListener(req.body).then(data=>{
            res.json(new ErrorMsg(true,"创建成功"));
        },err=>{
            res.json(new ErrorMsg(false,err.message));
        }).catch(err=>{
            res.json(new ErrorMsg(false,err||err.message));
        });
    }
);

export = router;