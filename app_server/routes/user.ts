import * as express from "express";
import UserService from "../controller/User";
import { body,query, validationResult, Result } from 'express-validator/check';
import ErrorMsg from "../model/ErrorMsg";
import { IMailCode } from "../interface/IMailCode";
import { IUser } from "../interface/model/IUser";
import ListenerService from "../controller/Listener";
import ObjectHelper from "../helper/objectHelper";
import { IListener } from "../interface/model/IListener";
import ClickRateService from "../controller/ClickRate";
import _ = require("lodash");
const router = express.Router();
const listenerCtrl = ListenerService.getInstance();
const userContrl = UserService.getInstance(listenerCtrl);
const clickRateCtrl = ClickRateService.getInstance();

router.put("/",[
    body("code").not().isEmpty().withMessage('微信code不能为空'),
    body("code").isString().withMessage('微信code必须是字符串')
],(req,res)=>{
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    userContrl.bindUser(req.body.code).then(data => { 
        res.json({ data:data ,...new ErrorMsg(true,"绑定成功")});
    },err => {
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

router.get("/",[
    query("weixinid").not().isEmpty().withMessage('微信id不能为空'),
    query("weixinid").isString().withMessage('微信id必须是字符串')
],(req:express.Request,res:express.Response)=>{
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    } 
    userContrl.findByWeixin(req.query.weixinid).then(result=>{
        if(!result){
            res.json(new ErrorMsg(false,"未找到对应记录"));
            return;
        }
        res.json({ data: ObjectHelper.serialize(result),...new ErrorMsg(true) });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

router.get("/",[
    query("uid").isNumeric().withMessage('微信id不能为空')
],(req:express.Request,res:express.Response)=>{
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    } 
    userContrl.findByUserid(req.query.uid).then(result=>{
        if(!result){
            res.json(new ErrorMsg(false,"未找到对应记录"));
            return;
        }
        res.json({ data: ObjectHelper.serialize(result),...new ErrorMsg(true) });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

router.post("/",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("nickname").not().isEmpty().withMessage("用户名称不能为空"),
    body("sex").isNumeric().withMessage("性别不正确"),
    body("address").isNumeric().withMessage("地址不能为空"),
    body("birthday").not().isEmpty().withMessage("生日不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    const user:IUser = {
        id:req.query.userid,
        nickname:req.body.nickname,
        sex:req.body.sex,
        address:req.body.address,
        birthday:req.body.birthday,
        resume:req.body.resume||""
    }
    userContrl.update(user).then(data=>{
        res.json({data,...new ErrorMsg(true)});
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

router.post("/updateOther",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    body("job").isNumeric().withMessage("职位信息不能为空"),
    body("family").isNumeric().withMessage("家庭状况不能为空"),
    body("edu").isNumeric().withMessage("教育经历不能为空"),
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    const listener:IListener = {
        job:req.body.job,
        family:req.body.family,
        edu:req.body.edu
    }
    listenerCtrl.updateListenerById(req.query.userid,listener).then(data=>{
        res.json({data,...new ErrorMsg(true)});
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
})

router.get("/getCheckCode",[
    query("phone").isMobilePhone("zh-CN").withMessage("非法的手机号"),
    query("userid").isNumeric().withMessage("用户id不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    
    userContrl.getCheckCode(req.query.phone).then(data=>{
        (<any>req).session.bindphoneObj = data;
        res.json({
            code:data.code,
            ...new ErrorMsg(true)
        });
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    })
});

router.post("/bindphone",[
    body("phone").isMobilePhone("zh-CN").withMessage("非法的手机号"),
    body("code").isLength({min:6,max:6}).withMessage("验证码非法"),
    query("userid").isNumeric().withMessage("用户id不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    const sourceModel:IMailCode = (<any>req).session.bindphoneObj;
    if(!sourceModel){
        res.json(new ErrorMsg(false,"当前手机号未发验证码"));
        return;
    }
    userContrl.bindPhoneCode(sourceModel,{
        phone:req.body.phone,
        code:req.body.code,
    },req.query.userid).then(response=>{
        res.json(new ErrorMsg(true));
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

/**
 * 添加访问
 */
router.get("/addvisitrecord",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    query("lid").isNumeric().withMessage("倾听者id不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    clickRateCtrl.recordClickRate(parseInt(req.query.userid),parseInt(req.query.lid)).then(data=>{
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
 * 添加收藏
 */
router.get("/addfavorite",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    query("lid").isNumeric().withMessage("倾听者id不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    clickRateCtrl.addFavorite(parseInt(req.query.userid),parseInt(req.query.lid)).then(data=>{
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
 * 获取访问记录
 */
router.get("/getvisitrecords",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    query("start").isNumeric().withMessage("参数非法，分页参数不能为空"),
    query("limit").isNumeric().withMessage("参数非法，分页参数不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    clickRateCtrl.getVisitRecords(parseInt(req.query.userid),{
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
});

/**
 * 获取收藏记录
 */
router.get("/getfavorites",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    query("start").isNumeric().withMessage("参数非法，分页参数不能为空"),
    query("limit").isNumeric().withMessage("参数非法，分页参数不能为空")
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    clickRateCtrl.getFavorites(parseInt(req.query.userid),{
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
});

/**
 * 获取用户对应的点击者是否关注过
 */
router.get("/getcheckrecord",[
    query("userid").isNumeric().withMessage("用户id不能为空"),
    query("lids").custom(value=>{
        if(!value){
            throw new Error("关注的id不能为空")
        }
        const values = ObjectHelper.parseJSON(value);
        if(!values||!_.isArray(values)){
            throw new Error("关注的id非法");
        }
        return value;
    })
],function(req:express.Request,res:express.Response){
    const errors:Result<{msg:string}> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg(false,errors.array()[0].msg ));
    }
    const ids = ObjectHelper.parseJSON(req.query.lids)||[];
    clickRateCtrl.getRecordInIds(parseInt(req.query.userid),ids).then(data=>{
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