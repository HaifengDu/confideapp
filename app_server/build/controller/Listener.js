"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import UserModel from "../model/User";
const Listener_1 = require("../model/Listener");
const Bluebird = require("bluebird");
const User_1 = require("../model/User");
const objectHelper_1 = require("../helper/objectHelper");
const MainLabel_1 = require("./MainLabel");
const ListenerBiz_1 = require("../biz/ListenerBiz");
const mysqlSeq_1 = require("../mysqlSeq");
const User_2 = require("./User");
const ErrorMsg_1 = require("../model/ErrorMsg");
const ERoleStatus_1 = require("../enum/ERoleStatus");
const edu = require("../../config/edu.json");
class ListenerService {
    constructor() {
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
    create(user) {
        return Listener_1.default.create(user);
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
    findByUserid(id) {
        return Listener_1.default.find({
            include: [{
                    model: User_1.default,
                    as: 'user',
                    where: { id: id }
                }]
        }).then(res => {
            if (!res.user) {
                Bluebird.reject({ message: "未查到对应的用户" });
                return;
            }
            const labels = this.parseLabels(res.labelids, res.labeldesc);
            objectHelper_1.default.merge(res, {
                labels: labels
            });
            if (res) {
                objectHelper_1.default.mergeChildToSource(res);
            }
            return Promise.resolve(res);
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
