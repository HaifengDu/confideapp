"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoSortFilterModel_1 = require("../model/mongo/MongoSortFilterModel");
const objectHelper_1 = require("../helper/objectHelper");
const ErrorMsg_1 = require("../model/ErrorMsg");
class MongoSyncBiz {
    constructor() {
    }
    create(res) {
        return MongoSortFilterModel_1.default.create({
            uid: res.uid,
            generalprice: res.minprice,
            auth: res.authstatus,
            praisepercent: 0,
            sex: res.user.sex,
            family: res.family,
            address: res.user.address,
            birthday: res.user.birthday,
            edu: res.edu,
            sealtimes: 0,
            receivestatus: res.recievestatus,
            labelids: res.labelids
        });
    }
    updateByUser(user) {
        const doc = {};
        if ('sex' in user) {
            doc.sex = user.sex;
        }
        if ("birthday" in user) {
            doc.birthday = user.birthday;
        }
        if ("address" in user) {
            doc.address = user.address;
        }
        if (Object.keys(doc).length > 0) {
            return MongoSortFilterModel_1.default.update({
                uid: user.id,
            }, doc);
        }
        return Promise.resolve(new ErrorMsg_1.default(true));
    }
    updateByListener(listener) {
        const doc = {};
        if ("minprice" in listener) {
            doc.generalprice = listener.minprice;
        }
        if ("auth" in listener) {
            doc.auth = listener.authstatus;
        }
        if ("family" in listener) {
            doc.family = listener.family;
        }
        if ("edu" in listener) {
            doc.edu = listener.edu;
        }
        if ("recievestatus" in listener) {
            doc.receivestatus = listener.recievestatus;
        }
        if ("labelids" in listener) {
            doc.labelids = objectHelper_1.default.parseJSON(listener.labelids);
        }
        if (Object.keys(doc).length > 0) {
            return MongoSortFilterModel_1.default.update({
                uid: listener.uid,
            }, doc);
        }
        return Promise.resolve(new ErrorMsg_1.default(true));
    }
    static createInstance() {
        MongoSyncBiz.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = MongoSyncBiz;
