import * as express from "express";
import { body,query, validationResult, Result } from 'express-validator/check';
import * as multer from "multer";
import * as fs from "fs";
import * as path from "path";
import * as uuid from "uuid";
import ErrorMsg from "../model/ErrorMsg";
import ListenerService from "../controller/Listener";
import ObjectHelper from "../helper/objectHelper";
import { IListener } from "../interface/model/IListener";
import _ = require("lodash");
import PriceSettingService from "../controller/PriceSetting";
const router = express.Router();
const listenCtrl = ListenerService.getInstance();
const priceSettingCtrl = PriceSettingService.getInstance();
const execPath = process.cwd();
const storage = multer.diskStorage({
    destination: function (req:express.Request, file, cb) {
        let dir = `files/images/${req.query.userid}`;
        dir = path.resolve(execPath,dir);
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
  
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 6
    } 
})

router.get("/",
    [query("userid").isNumeric().withMessage("用户编号非法")],
    function(req,res,next){
        const errors:Result<{msg:string}> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json(new ErrorMsg(false,errors.array()[0].msg ));
        }
        listenCtrl.findByUserid(req.query.userid).then(data=>{
            res.json({
                data,...new ErrorMsg(true)
            });
        },err=>{
            res.json(new ErrorMsg(false,err.message,err));
        }).catch(err=>{
            res.json(new ErrorMsg(false,err||err.message,err));
        });
    }
);
router.post("/",
    [query("userid").isNumeric().withMessage("用户编号非法")],
    [body("data").not().isEmpty().withMessage("提交数据不能为空")],
    upload.array("files",6),
    function(req:express.Request,res:express.Response,next){
        const errors:Result<{msg:string}> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json(new ErrorMsg(false,errors.array()[0].msg ));
        }
        const listener = ObjectHelper.serialize<IListener>(req.body.data);
        listener.uid = req.query.userid;
        try{
            listener.certificateurls = JSON.stringify((<any[]>(req.files || [])).map(item => item.path).map(item => item.replace(execPath, "")));
        }catch(e){
            listener.certificateurls="[]";
        } 
        
        listenCtrl.bindListener(listener).then(data=>{
            res.json(new ErrorMsg(true,"创建成功"));
        },err=>{
            res.json(new ErrorMsg(false,err.message));
        }).catch(err=>{
            res.json(new ErrorMsg(false,err||err.message));
        });
    }
);
router.post("/updateLabels",[
    query("userid").isNumeric().withMessage("用户编号非法"),
    body("labels").custom((value,{req,location,path})=>{
        const checkValues = ObjectHelper.parseJSON(value);
        if(!_.isArray(checkValues)){
            throw new Error("标签数据类型非法")
        }
        return value;
    })
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    const labels =  ObjectHelper.parseJSON(req.body.labels)||[];
    listenCtrl.updateLabels(labels,parseInt(req.query.userid)).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        })
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

router.post("/setprice",[
    query("userid").isNumeric().withMessage("用户编号非法"),
    body("type").isNumeric().withMessage("类型不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }

    const prices = ObjectHelper.parseJSON(req.body.prices)||[];
    priceSettingCtrl.updatePrice(parseInt(req.body.type),prices,req.query.userid).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

router.get("/price",[
    query("userid").isNumeric().withMessage("用户编号非法"),
    query("type").isNumeric().withMessage("价格类型非法")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    priceSettingCtrl.getPrice(req.query.type,req.query.userid).then(data=>{
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