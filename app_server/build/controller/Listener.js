"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import UserModel from "../model/User";
const Listener_1 = require("../model/Listener");
const Bluebird = require("bluebird");
const User_1 = require("../model/User");
const sequelize_1 = require("sequelize");
const objectHelper_1 = require("../helper/objectHelper");
const MainLabel_1 = require("./MainLabel");
const ListenerBiz_1 = require("../biz/ListenerBiz");
const mysqlSeq_1 = require("../mysqlSeq");
const User_2 = require("./User");
const ErrorMsg_1 = require("../model/ErrorMsg");
const ERoleStatus_1 = require("../enum/ERoleStatus");
const MongoSortFilterModel_1 = require("../model/mongo/MongoSortFilterModel");
const edu = require("../../config/edu.json");
class ListenerService {
    constructor() {
        this.PAGE_SIZE = 20;
        this.biz = ListenerBiz_1.default.getInstance();
        this.mainlabelService = MainLabel_1.default.getInstance();
        this.userService = User_2.default.getInstance();
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
                const updateUserPromise = this.userService.update(listener.user, tran);
                // listener.uid = listener.user.id;
                // delete listener.user;
                const createListenerPromise = Listener_1.default.create(listener, { transaction: tran });
                return Bluebird.all([updateUserPromise, createListenerPromise]);
            });
        });
    }
    find(id) {
        return Listener_1.default.findById(id);
    }
    parseLabels(labelids, labeldesc) {
        labelids = objectHelper_1.default.parseJSON(labelids) || [];
        const labels = this.mainlabelService.findLabel(labelids);
        if (labels.length && labeldesc) {
            const descObj = objectHelper_1.default.parseJSON(labeldesc) || [];
            if (descObj && descObj.length) {
                labels.forEach(label => {
                    const current = descObj.find(item => item.id === label.id);
                    if (current) {
                        label.desc = current.desc;
                    }
                });
            }
        }
        return labels;
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
    }
    updateUser(user) {
        const promise = this.userService.update(user);
        promise.then(res => {
            this.syncMongo(user.id);
        });
    }
    updateListener(listener) {
        const uid = listener.uid;
        delete listener.uid;
        const promise = Listener_1.default.update(listener, {
            where: {
                uid: uid
            }
        });
        promise.then(res => {
            this.syncMongo(listener.uid);
        });
    }
    syncMongo(id) {
        this.findByUserid(id).then(res => {
            MongoSortFilterModel_1.default.create({
                uid: id,
                generalprice: Math.min(res.phoneprice, res.wordprice),
                auth: res.labelids,
                praisepercent: 0,
                sex: res.user.sex,
                family: res.family,
                birthday: res.user.birthday,
                edu: res.edu,
                sealtimes: 0,
                receivestatus: res.recievestatus,
                labelids: res.labelids
            });
        });
    }
    findByUserid(id) {
        return Listener_1.default.find({
            include: [{
                    model: User_1.default,
                    as: 'user',
                    where: { id: id }
                }]
        }).then(res => {
            if (!res || !res.user) {
                Bluebird.reject({ message: "未查到对应的用户" });
                return;
            }
            const labels = this.parseLabels(res.labelids, res.labeldesc);
            objectHelper_1.default.merge(res, {
                labels: labels
            });
            // if(res){
            //     ObjectHelper.mergeChildToSource(res);
            // }
            return Promise.resolve(res);
        });
    }
    findInUserids(ids) {
        return Listener_1.default.findAll({
            include: [{
                    model: User_1.default,
                    as: 'user',
                    where: { id: { [sequelize_1.Op.in]: ids } }
                }]
        }).then(res => {
            res.forEach(item => {
                const labels = this.parseLabels(item.labelids, item.labeldesc);
                objectHelper_1.default.merge(item, {
                    labels: labels
                });
                // if(item){
                //     ObjectHelper.mergeChildToSource(item);
                // }
            });
            return Bluebird.resolve(res);
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
            res.forEach(item => {
                const labels = this.parseLabels(item.labelids, item.labeldesc);
                objectHelper_1.default.merge(item, {
                    labels: labels
                });
                // if(item){
                //     ObjectHelper.mergeChildToSource(item);
                // }
            });
            return Bluebird.resolve(res);
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
