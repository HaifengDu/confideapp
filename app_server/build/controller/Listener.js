"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Bluebird = require("bluebird");
const sequelize_1 = require("sequelize");
const Listener_1 = require("../model/Listener");
const User_1 = require("../model/User");
const objectHelper_1 = require("../helper/objectHelper");
const MainLabel_1 = require("./MainLabel");
const ListenerBiz_1 = require("../biz/ListenerBiz");
const mysqlSeq_1 = require("../mysqlSeq");
const User_2 = require("./User");
const ErrorMsg_1 = require("../model/ErrorMsg");
const ERoleStatus_1 = require("../enum/ERoleStatus");
const PriceSetting_1 = require("../model/PriceSetting");
const MongoSyncBiz_1 = require("../biz/MongoSyncBiz");
const EListenerLabelStatus_1 = require("../enum/EListenerLabelStatus");
const ListenerPriceMediator_1 = require("./ListenerPriceMediator");
const ERole_1 = require("../enum/ERole");
const baseDataHelper_1 = require("../helper/baseDataHelper");
const ELabelType_1 = require("../enum/ELabelType");
class ListenerService {
    constructor() {
        this.PAGE_SIZE = 20;
        this.pricesettingMediator = ListenerPriceMediator_1.default.getInstance();
        this.pricesettingMediator.setListener(this);
        this.baseDataHelper = baseDataHelper_1.default.getInstance();
        this.biz = ListenerBiz_1.default.getInstance();
        this.mongoSyncbiz = MongoSyncBiz_1.default.getInstance();
        this.mainlabelService = MainLabel_1.default.getInstance();
        this.userService = User_2.default.getInstance(this);
    }
    bindListener(listenerp) {
        const listener = objectHelper_1.default.serialize(listenerp);
        let result = this.biz.checkBindListenerModel(listener);
        if (!result.success) {
            return Bluebird.reject(result);
        }
        const findUserPromise = this.userService.find(listener.uid).then(res => {
            if (!res) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "未查到对应账号"));
            }
            return Bluebird.resolve(res);
        });
        const findUserBindPromise = this.findByUserid(listener.uid).then(res => {
            if (res) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "当前账号已经是倾听者"));
            }
            return Bluebird.resolve(new ErrorMsg_1.default(true));
        });
        return Bluebird.all([findUserPromise, findUserBindPromise]).then(res => {
            return mysqlSeq_1.default.transaction(tran => {
                listener.user.status = ERoleStatus_1.ERoleStatus.审核中;
                listener.user.id = listener.uid;
                listener.user.role = ERole_1.ERole.Listener;
                const updateUserPromise = this.userService.update(listener.user, tran);
                // listener.uid = listener.user.id;
                // delete listener.user;
                const createListenerPromise = Listener_1.default.create(listener, { transaction: tran });
                const createDefaultPricePromise = this.pricesettingMediator.createDefaultPrice(listener.uid, { transaction: tran });
                return Bluebird.all([updateUserPromise, createListenerPromise, createDefaultPricePromise]);
            });
        });
    }
    find(id) {
        return Listener_1.default.findById(id);
    }
    /**
     * 获取带有描述的标签
     * @param labels
     * @param labeldesc
     */
    getLabels(labels, labeldesc) {
        if (labels.length && labeldesc) {
            const descObj = objectHelper_1.default.parseJSON(labeldesc) || [];
            if (descObj && descObj.length) {
                labels.forEach(label => {
                    const current = descObj.find(item => item.id === label.id);
                    if (current) {
                        label.desc = current.desc;
                        label.lsstatus = current.lsstatus || EListenerLabelStatus_1.EListenerLabelStatus.正常;
                    }
                });
            }
        }
        return labels;
    }
    /**
     * 转换标签
     * @param labelids
     * @param labeldesc
     * @param hasStatus 是否包含状态（当前用户取不包含状态）
     */
    parseLabels(labelids, labeldesc, hasStatus = true) {
        labelids = objectHelper_1.default.parseJSON(labelids) || [];
        let labels = [];
        if (hasStatus) {
            labels = this.mainlabelService.findLabel(labelids);
        }
        else {
            labels = this.mainlabelService.findLabelNoStatus(labelids);
        }
        labels = objectHelper_1.default.serialize(labels);
        return this.getLabels(labels, labeldesc);
    }
    /**
     * 转换经历
     * @param labelids
     * @param labeldesc
     * @param hasStatus
     */
    parseExprience(labelids, labeldesc, hasStatus = true) {
        labelids = objectHelper_1.default.parseJSON(labelids) || [];
        let labels = [];
        if (hasStatus) {
            labels = this.mainlabelService.findExprience(labelids);
        }
        else {
            labels = this.mainlabelService.findExprienceNoStatus(labelids);
        }
        labels = objectHelper_1.default.serialize(labels);
        return this.getLabels(labels, labeldesc);
    }
    /**
     * 审核
     * @param id
     */
    confirm(id) {
        const promise = User_1.default.update({
            status: ERoleStatus_1.ERoleStatus.正常
        }, {
            where: {
                id: id
            }
        });
        promise.then(res => {
            this.syncMongo(id);
        });
        return promise;
    }
    updateListener(listener) {
        const uid = listener.uid;
        delete listener.uid;
        const promise = Listener_1.default.update(listener, {
            where: {
                uid: uid
            }
        });
        promise.then((res) => {
            if (res[0] > 0) {
                listener.uid = uid;
                return this.mongoSyncbiz.updateByListener(listener);
            }
            return res;
        });
        return promise;
    }
    updateListenerById(userid, listener) {
        const promise = Listener_1.default.update(listener, {
            where: {
                uid: userid
            }
        });
        promise.then((res) => {
            if (res[0] > 0) {
                listener.uid = userid;
                return this.mongoSyncbiz.updateByListener(listener);
            }
            return res;
        });
        return promise;
    }
    syncMongo(uid) {
        this.findByUserid(uid).then(res => {
            this.mongoSyncbiz.create(res);
        });
    }
    /**
     * 根据用户id仅获取倾听者
     * @param userid
     */
    findOnlyListenerByUserid(userid) {
        return Listener_1.default.find({
            where: {
                uid: userid
            }
        });
    }
    findByUserid(userid) {
        return Listener_1.default.find({
            include: [{
                    model: User_1.default,
                    as: 'user',
                    include: [{
                            model: PriceSetting_1.default
                        }],
                    where: { id: userid }
                }]
        }).then(res => {
            if (!res || !res.user) {
                Bluebird.reject(new ErrorMsg_1.default(false, "未查到对应的用户"));
                return;
            }
            const listener = objectHelper_1.default.serialize(res);
            this.mergeBaseData(listener);
            return Promise.resolve(listener);
        });
    }
    findInUserids(ids) {
        return Listener_1.default.findAll({
            include: [{
                    model: User_1.default,
                    as: 'user',
                    where: { id: { [sequelize_1.Op.in]: ids } },
                    include: [{
                            model: PriceSetting_1.default
                        }],
                }]
        }).then(res => {
            const listeners = objectHelper_1.default.serialize(res);
            listeners.forEach(item => {
                this.mergeBaseData(item);
            });
            return Bluebird.resolve(listeners);
        });
    }
    findByName(name, page) {
        const tempPage = {
            start: 0,
            limit: this.PAGE_SIZE
        };
        if (page) {
            tempPage.start = page.start || 0;
            if (page.limit) {
                tempPage.limit = page.limit;
            }
        }
        return Listener_1.default.findAll({
            offset: page.start,
            limit: page.limit,
            include: [{
                    model: User_1.default,
                    as: 'user',
                    where: {
                        [sequelize_1.Op.or]: [
                            { nickname: { [sequelize_1.Op.like]: name } },
                            { labeldesc: { [sequelize_1.Op.like]: name } },
                            { expdesc: { [sequelize_1.Op.like]: name } }
                        ]
                    }
                }]
        }).then(res => {
            const listeners = objectHelper_1.default.serialize(res);
            listeners.forEach(item => {
                this.mergeBaseData(item);
            });
            return Bluebird.resolve(listeners);
        });
    }
    mergeBaseData(listener) {
        const labels = this.parseLabels(listener.labelids, listener.labeldesc, false);
        const exps = this.parseExprience(listener.expids, listener.expdesc, false);
        objectHelper_1.default.merge(listener, {
            labels,
            exps
        }, true);
        const job = this.baseDataHelper.getJob(listener.job);
        if (job) {
            listener.jobname = job.name;
        }
        const edu = this.baseDataHelper.getEdu(listener.edu);
        if (edu) {
            listener.eduname = edu.name;
        }
        const family = this.baseDataHelper.getFamily(listener.family);
        if (edu) {
            listener.familyname = family.name;
        }
    }
    /**
     * 更新标签
     * @param labels
     * @param userid
     */
    updateLabels(labels, userid) {
        if (!userid) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "用户id不能为空"));
        }
        if (!labels || !labels.length) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "更新的标签不能为空"));
        }
        const result = labels.filter(item => !!item.id).reduce((ori, item) => {
            ori.ids.push(item.id);
            ori.descs.push({ id: item.id, desc: item.desc, lsstatus: EListenerLabelStatus_1.EListenerLabelStatus.审核中 });
            return ori;
        }, {
            ids: [],
            descs: []
        });
        return this.updateListener({
            uid: userid,
            labelids: JSON.stringify(result.ids),
            labeldesc: JSON.stringify(result.descs)
        });
    }
    deleteLabels(userid, labelid, stype) {
        return this.findByUserid(userid).then(res => {
            let isChange = false;
            const temp = {};
            if (res && res.labelids) {
                const key = stype === ELabelType_1.ELabelSType.Label ? "labelids" : "expids";
                const keyids = objectHelper_1.default.parseJSON(res[key]) || [];
                if (_.isArray(keyids)) {
                    _.remove(keyids, item => item === labelid);
                }
                temp[key] = JSON.stringify(keyids);
                isChange = true;
            }
            if (res && res.labeldesc) {
                const key = stype === ELabelType_1.ELabelSType.Label ? "labeldesc" : "expdesc";
                const keydescs = objectHelper_1.default.parseJSON(res[key]) || [];
                if (_.isArray(keydescs)) {
                    _.remove(keydescs, item => item.id === labelid);
                }
                temp[key] = JSON.stringify(keydescs);
                ;
                isChange = true;
            }
            if (isChange) {
                return this.updateListener(Object.assign({ uid: userid }, temp));
            }
        });
    }
    /**
     * 更新经历
     */
    updateExp(userid, exp) {
        if (!exp.id) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "经历id不能为空"));
        }
        exp.lsstatus = EListenerLabelStatus_1.EListenerLabelStatus.审核中;
        return this.findOnlyListenerByUserid(userid).then(listener => {
            if (!listener) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "未找到对应用户"));
            }
            const expids = objectHelper_1.default.parseJSON(listener.expids) || [];
            const expdesc = objectHelper_1.default.parseJSON(listener.expdesc) || [];
            if (expids.indexOf(exp.id) > -1) {
                const current = expdesc.find(item => item.id);
                if (current) {
                    Object.assign(current, exp);
                }
                else {
                    expdesc.push(exp);
                }
            }
            else {
                expids.push(exp.id);
                expdesc.push(exp);
            }
            return this.updateListener({
                uid: userid,
                expids: JSON.stringify(expids),
                expdesc: JSON.stringify(expdesc)
            });
        });
    }
    static createInstance() {
        ListenerService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = ListenerService;
