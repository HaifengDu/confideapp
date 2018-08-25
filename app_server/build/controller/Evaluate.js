"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorMsg_1 = require("../model/ErrorMsg");
const Bluebird = require("bluebird");
const Sequelize = require("sequelize");
const Evaluate_1 = require("../model/Evaluate");
const EEvaluateStatus_1 = require("../enum/EEvaluateStatus");
const objectHelper_1 = require("../helper/objectHelper");
const mysqlSeq_1 = require("../mysqlSeq");
const User_1 = require("./User");
class EvaluateService {
    constructor() {
        this.userService = User_1.default.getInstance();
    }
    create(model) {
        if (!model) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "参数不能为空"));
        }
        if (!model.uid) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "用户名不能为空"));
        }
        if (!model.uid) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "倾听者不能为空"));
        }
        if (!model.orderid) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "订单不能为空"));
        }
        return Evaluate_1.default.create(model);
    }
    /**
     *
     * @param lid 倾听者id
     */
    getList(lid, status, page) {
        return Evaluate_1.default.findAll({
            offset: page.start,
            limit: page.limit,
            where: {
                lid: lid,
                satisfaction: status,
                status: EEvaluateStatus_1.EEvaluateStatus.正常
            }
        }).then(res => {
            return this.addUser(res);
        });
    }
    getListByUid(uid, status, page) {
        return Evaluate_1.default.findAll({
            offset: page.start,
            limit: page.limit,
            where: {
                uid: uid,
                satisfaction: status,
                status: EEvaluateStatus_1.EEvaluateStatus.正常
            }
        }).then(res => {
            return this.addUser(res);
        });
    }
    addUser(datas) {
        const tempDatas = objectHelper_1.default.serialize(datas);
        if (datas && datas.length) {
            return this.userService.findInIds(datas.map(item => item.uid)).then(res => {
                tempDatas.forEach(item => {
                    item.user = res.find(model => model.id === item.uid);
                });
                return tempDatas;
            });
        }
        return Bluebird.resolve(tempDatas);
    }
    getAggregate(lid) {
        const whereOp = {
            lid: lid,
            status: EEvaluateStatus_1.EEvaluateStatus.正常
        };
        const findPromise = Evaluate_1.default.find({
            attributes: [
                [Sequelize.fn("AVG", Sequelize.literal('`timerate`')), 'timerate'],
                [Sequelize.fn("AVG", Sequelize.literal('`serviceattitude`')), 'serviceattitude'],
                [Sequelize.fn("AVG", Sequelize.literal('`servicepower`')), 'servicepower']
            ],
            where: whereOp
        });
        const totalPromise = mysqlSeq_1.default.query(`
            SELECT ROUND(T1.count/T2.total*100,1) as goodrate
            FROM  
            (SELECT COUNT(id) AS count FROM \`evaluate\` WHERE \`timerate\`+\`serviceattitude\`+\`servicepower\`>${EvaluateService.GOOD_PRAISE_FLOOR}) AS T1,
            (SELECT COUNT(id) AS total FROM \`evaluate\`) AS T2
        `).spread((results) => {
            return results[0].goodrate;
        });
        const labelsPromise = Evaluate_1.default.findAll({
            where: whereOp,
            attributes: ["labels"]
        }).then((res) => {
            const labels = res;
            const resultLabels = [];
            if (labels && labels.length) {
                labels.forEach(item => {
                    const itemlabels = objectHelper_1.default.parseJSON(item) || [];
                    itemlabels.forEach(element => {
                        const label = resultLabels.find(item => item.text === element);
                        if (label) {
                            label.count++;
                        }
                        else {
                            resultLabels.push({ text: element, count: 1 });
                        }
                    });
                });
            }
            return resultLabels;
        });
        return Promise.all([findPromise, totalPromise, labelsPromise]).then(res => {
            const model = {
                timerate: parseInt(res[0].timerate || "5"),
                serviceattitude: parseInt(res[0].serviceattitude || "5"),
                servicepower: parseInt(res[0].servicepower || "5"),
                applauserate: res[1] || 1,
                labels: res[2]
            };
            return model;
        });
    }
    reply(eid, lid, replymessage) {
        if (!replymessage) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "回复数据不能为空"));
        }
        if (replymessage.length > 500) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "回复的消息太常"));
        }
        Evaluate_1.default.findOne({
            where: {
                id: eid,
                lid: lid,
            }
        }).then(evaluate => {
            if (!evaluate) {
                return Bluebird.reject(new ErrorMsg_1.default(false, '未找到对应数据'));
            }
            return Evaluate_1.default.update({
                replymessage: replymessage
            }, {
                where: {
                    id: eid
                }
            });
        });
    }
    static createInstance() {
        EvaluateService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
/**
 * 好评界限
 */
EvaluateService.GOOD_PRAISE_FLOOR = 10;
exports.default = EvaluateService;
