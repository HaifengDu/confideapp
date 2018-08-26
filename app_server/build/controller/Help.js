"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize_1 = require("Sequelize");
const ErrorMsg_1 = require("../model/ErrorMsg");
const User_1 = require("./User");
const Bluebird = require("bluebird");
const CalucateService_1 = require("../helper/CalucateService");
const mysqlSeq_1 = require("../mysqlSeq");
const Help_1 = require("../model/Help");
const HelpRecieve_1 = require("./HelpRecieve");
const EHelpStatus_1 = require("../enum/EHelpStatus");
const User_2 = require("../model/User");
class HelpService {
    constructor() {
        this.userService = User_1.default.getInstance();
        this.helpRecieve = HelpRecieve_1.default.getInstance();
    }
    create(help) {
        if (!help) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "求助不能为空"));
        }
        if (!help.uid) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "用户不能为空"));
        }
        if (!help.content) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "求助内容不能为空"));
        }
        if (!help.labelid) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "标签不能为空"));
        }
        if (!help.money) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "金额不能为空"));
        }
        return this.userService.find(help.uid).then(user => {
            if (!user) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "未找到用户"));
            }
            if (!user.money || user.money < help.money) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "用户余额不足"));
            }
            const money = CalucateService_1.default.numSub(user.money, help.money);
            return mysqlSeq_1.default.transaction(tran => {
                const createPromise = Help_1.default.create(help, {
                    transaction: tran
                });
                const updatePromise = this.userService.update({
                    id: user.id,
                    money,
                }, tran);
                return Promise.all([createPromise, updatePromise]);
            });
        });
    }
    getList(labelid, page) {
        if (!labelid) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "标签id不能为空"));
        }
        return Help_1.default.findAll({
            offset: page.start,
            limit: page.limit,
            where: {
                labelid,
                status: {
                    [Sequelize_1.Op.ne]: EHelpStatus_1.EHelpStatus.删除
                }
            },
            include: [
                {
                    model: User_2.default,
                    as: 'user',
                }
            ]
        }).then(res => {
            const recieveids = res.filter(item => item.status === EHelpStatus_1.EHelpStatus.关闭 && item.recieveid).map(item => item.recieveid);
            if (recieveids.length) {
                return this.helpRecieve.getByids(recieveids).then(recieves => {
                    res.forEach(item => {
                        if (item.recieveid) {
                            item.accept = recieves.find(model => model.id === item.recieveid);
                        }
                    });
                    return res;
                });
            }
            return res;
        });
    }
    static createInstance() {
        HelpService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = HelpService;
