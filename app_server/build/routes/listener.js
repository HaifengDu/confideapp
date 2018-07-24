"use strict";
const express = require("express");
const check_1 = require("express-validator/check");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const ErrorMsg_1 = require("../model/ErrorMsg");
const Listener_1 = require("../controller/Listener");
const objectHelper_1 = require("../helper/objectHelper");
const _ = require("lodash");
const PriceSetting_1 = require("../controller/PriceSetting");
const ERecieveStatus_1 = require("../enum/ERecieveStatus");
const GeneralSetting_1 = require("../controller/GeneralSetting");
const EAuthStatus_1 = require("../enum/EAuthStatus");
const router = express.Router();
const listenCtrl = Listener_1.default.getInstance();
const priceSettingCtrl = PriceSetting_1.default.getInstance();
const generalSettingCtrl = GeneralSetting_1.default.getInstance();
const execPath = process.cwd();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = `files/images/${req.query.userid}`;
        dir = path.resolve(execPath, dir);
        fs.exists(dir, exist => {
            if (!exist) {
                fs.mkdir(dir, err => {
                    if (err) {
                        cb(err, null);
                        return;
                    }
                    cb(null, dir);
                });
            }
            else {
                cb(null, dir);
            }
        });
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(null, uuid().toString() + extname);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 6
    }
});
/**
 * 根据用户id获取倾听者
 */
router.get("/", [check_1.query("userid").isNumeric().withMessage("用户编号非法")], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    listenCtrl.findByUserid(req.query.userid).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err || err.message, err));
    });
});
/**
 * 申请倾听者
 */
router.post("/", [
    check_1.query("userid").isNumeric().withMessage("用户编号非法"),
    check_1.body("data").not().isEmpty().withMessage("提交数据不能为空")
], upload.array("files", 6), function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    const listener = objectHelper_1.default.serialize(req.body.data);
    listener.uid = req.query.userid;
    try {
        listener.certificateurls = JSON.stringify((req.files || []).map(item => item.path).map(item => item.replace(execPath, "")));
    }
    catch (e) {
        listener.certificateurls = "[]";
    }
    listenCtrl.bindListener(listener).then(data => {
        res.json(new ErrorMsg_1.default(true, "创建成功"));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err || err.message));
    });
});
router.post("/uploadcert", [
    check_1.query("userid").isNumeric().withMessage("用户编号非法")
], upload.array("files", 6), function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    const files = req.files;
    if (!files || !files.length) {
        return res.json(new ErrorMsg_1.default(false, "上传文件不能为空"));
    }
    const certificateurls = JSON.stringify((req.files || []).map(item => item.path).map(item => item.replace(execPath, "")));
    listenCtrl.updateListenerById(req.query.userid, {
        certificateurls: certificateurls,
        authstatus: EAuthStatus_1.EAuthStatus.认证中
    }).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 更新标签（话题）
 */
router.post("/updateLabels", [
    check_1.query("userid").isNumeric().withMessage("用户编号非法"),
    check_1.body("labels").custom((value, { req, location, path }) => {
        const checkValues = objectHelper_1.default.parseJSON(value);
        if (!_.isArray(checkValues)) {
            throw new Error("标签数据类型非法");
        }
        return value;
    })
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    const labels = objectHelper_1.default.parseJSON(req.body.labels) || [];
    listenCtrl.updateLabels(labels, parseInt(req.query.userid)).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 更新经历
 */
router.post("/updateExp", [
    check_1.query("userid").isNumeric().withMessage("用户编号非法"),
    check_1.body("exp").custom((value, { req, location, path }) => {
        const checkValues = objectHelper_1.default.parseJSON(value);
        if (!checkValues || !checkValues.id) {
            throw new Error("经历id不能为空");
        }
        return value;
    })
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    const exp = objectHelper_1.default.parseJSON(req.body.exp);
    if (!exp) {
        res.json(new ErrorMsg_1.default(false, "参数错误"));
        return;
    }
    listenCtrl.updateExp(req.query.userid, exp).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 设置价格
 */
router.post("/setprice", [
    check_1.query("userid").isNumeric().withMessage("用户编号非法"),
    check_1.body("type").isNumeric().withMessage("类型不能为空")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    const prices = objectHelper_1.default.parseJSON(req.body.prices) || [];
    priceSettingCtrl.updatePrice(parseInt(req.body.type), prices, req.query.userid).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 获取价格
 */
router.get("/price", [
    check_1.query("userid").isNumeric().withMessage("用户编号非法"),
    check_1.query("type").isNumeric().withMessage("价格类型非法")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    priceSettingCtrl.getPrice(req.query.type, req.query.userid).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 推广设置
 */
router.post("/generalsetting", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.body("data").isNumeric().withMessage("价格设置非法")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    const data = objectHelper_1.default.parseJSON(req.body.data) || {};
    const generalSetting = {
        uid: parseInt(req.query.userid),
        price: data.price
    };
    if (data.limitprice) {
        generalSetting.limitprice = data.limitprice;
    }
    generalSettingCtrl.setGeneral(generalSetting).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 设置推广状态
 */
router.post("/setgeneralstatus", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.body("status").isNumeric().withMessage("状态非法")
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    generalSettingCtrl.enableGeneral(req.body.status, req.query.userid).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 获取推广设置
 */
router.get("/generalsetting", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
], function (req, res) {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new ErrorMsg_1.default(false, errors.array()[0].msg));
    }
    generalSettingCtrl.getGeneral(req.query.userid).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 用户点击记录
 */
router.get("/recordclick", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.query("lid").isNumeric().withMessage("倾听者id不能为空")
], function (req, res) {
    generalSettingCtrl.checkGeneral(req.query.userid, req.query.lid).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
/**
 * 设置接受状态
 */
router.post("/setrecievestatus", [
    check_1.query("userid").isNumeric().withMessage("用户id不能为空"),
    check_1.body("status").isNumeric().withMessage("状态参数非法")
], function (req, res) {
    const values = _.values(ERecieveStatus_1.ERecieveStatus);
    const status = parseInt(req.body.status);
    if (values.indexOf(status) === -1) {
        res.json(new ErrorMsg_1.default(false, "状态参数非法"));
        return;
    }
    listenCtrl.updateListenerById(req.query.userid, {
        recievestatus: status
    }).then(data => {
        res.json(Object.assign({ data }, new ErrorMsg_1.default(true)));
    }, err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    }).catch(err => {
        res.json(new ErrorMsg_1.default(false, err.message, err));
    });
});
module.exports = router;
