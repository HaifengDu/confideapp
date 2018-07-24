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
import { ERecieveStatus } from "../enum/ERecieveStatus";
import { IGeneralSetting } from "../interface/model/IGeneralSetting";
import GeneralSettingService from "../controller/GeneralSetting";
import { EAuthStatus } from "../enum/EAuthStatus";
const router = express.Router();
const listenCtrl = ListenerService.getInstance();
const priceSettingCtrl = PriceSettingService.getInstance();
const generalSettingCtrl = GeneralSettingService.getInstance();
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

/**
 * 根据用户id获取倾听者
 */
router.get("/",
    [query("userid").isNumeric().withMessage("用户编号非法")],
    function(req,res){
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
/**
 * 申请倾听者
 */
router.post("/",
    [
        query("userid").isNumeric().withMessage("用户编号非法"),
        body("data").not().isEmpty().withMessage("提交数据不能为空")
    ],
    upload.array("files",6),
    function(req:express.Request,res:express.Response){
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

router.post("/uploadcert",[
    query("userid").isNumeric().withMessage("用户编号非法")
],
upload.array("files",6),function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    const files = <any[]>req.files;
    if(!files||!files.length){
        return res.json(new ErrorMsg(false,"上传文件不能为空"));
    }
    const certificateurls = JSON.stringify((<any[]>(req.files || [])).map(item => item.path).map(item => item.replace(execPath, "")));
    listenCtrl.updateListenerById(req.query.userid,{
        certificateurls:certificateurls,
        authstatus:EAuthStatus.认证中
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

/**
 * 更新标签（话题）
 */
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

/**
 * 更新经历
 */
router.post("/updateExp",[
    query("userid").isNumeric().withMessage("用户编号非法"),
    body("exp").custom((value,{req,location,path})=>{
        const checkValues = ObjectHelper.parseJSON(value);
        if(!checkValues||!checkValues.id){
            throw new Error("经历id不能为空");
        }
        return value;
    })
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    const exp = ObjectHelper.parseJSON(req.body.exp);
    if(!exp){
        res.json(new ErrorMsg(false,"参数错误"));
        return;
    }
    listenCtrl.updateExp(req.query.userid,exp).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

/**
 * 设置价格
 */
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

/**
 * 获取价格
 */
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

/**
 * 推广设置
 */
router.post("/generalsetting",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("data").isNumeric().withMessage("价格设置非法")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    const data:any = ObjectHelper.parseJSON(req.body.data)||{};
    const generalSetting:IGeneralSetting = {
        uid:parseInt(req.query.userid),
        price:data.price
    };
    if(data.limitprice){
        generalSetting.limitprice = data.limitprice;
    }
    generalSettingCtrl.setGeneral(generalSetting).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

/**
 * 设置推广状态
 */
router.post("/setgeneralstatus",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("status").isNumeric().withMessage("状态非法")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    generalSettingCtrl.enableGeneral(req.body.status,req.query.userid).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

/**
 * 获取推广设置
 */
router.get("/generalsetting",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    generalSettingCtrl.getGeneral(req.query.userid).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
})

/**
 * 用户点击记录
 */
router.get("/recordclick",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    query("lid").isNumeric().withMessage("倾听者id不能为空")
],function(req:express.Request,res:express.Response){
    generalSettingCtrl.checkGeneral(req.query.userid,req.query.lid).then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

/**
 * 设置接受状态
 */
router.post("/setrecievestatus",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("status").isNumeric().withMessage("状态参数非法")
],function(req:express.Request,res:express.Response){
    const values:any[] = _.values(ERecieveStatus);
    const status = parseInt(req.body.status);
    if(values.indexOf(status)===-1){
        res.json(new ErrorMsg(false,"状态参数非法"));
        return;
    }
    listenCtrl.updateListenerById(req.query.userid,{
        recievestatus:status
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