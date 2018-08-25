"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorMsg_1 = require("../model/ErrorMsg");
const Bluebird = require("bluebird");
const Sequelize = require("sequelize");
const HelpRecieve_1 = require("../model/HelpRecieve");
const User_1 = require("../model/User");
const Op = Sequelize.Op;
class HelpRecieveService {
    constructor() {
    }
    create(model) {
        if (!model) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "参数不能为空"));
        }
        if (!model.helpid) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "求助id不能为空"));
        }
        if (!model.uid) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "用户id不能为空"));
        }
        if (!model.content) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "内容不能为空"));
        }
        return HelpRecieve_1.default.create(model);
    }
    getList(helpid, page) {
        HelpRecieve_1.default.findAll({
            offset: page.start,
            limit: page.limit,
            where: {
                helpid: helpid,
                recieveid: -1
            }
        }).then(res => {
            if (!res || !res.length) {
                return res;
            }
            return HelpRecieve_1.default.findAll({
                where: {
                    helpid: helpid,
                    recieveid: {
                        [Op.ne]: -1
                    }
                }
            }).then(recievies => {
                const linkList = this.arrayToLinklist(recievies);
                res.forEach(item => {
                    this.buildRecieveTree(item, linkList);
                });
                return res;
            });
        });
    }
    arrayToLinklist(list) {
        if (!list || !list.length) {
            return null;
        }
        const head = list[0];
        for (let index = 1; index < list.length; index++) {
            const element = list[index];
            if (list[index + 1]) {
                element.next = list[index + 1];
                list[index + 1].prev = element;
            }
            else {
                element.next = null;
            }
        }
        if (list[1]) {
            head.next = list[1];
            list[1].prev = head;
        }
        return head;
    }
    findRecieveAndRemove(head, pid) {
        let temp = head;
        let linkhead = head;
        let result = null;
        while (temp) {
            if (temp.recieveid === pid) {
                result = temp;
                if (temp === head) {
                    linkhead = temp.next;
                    if (linkhead) {
                        linkhead.prev = null;
                    }
                }
                else {
                    temp.prev.next = temp.next;
                    if (temp.next) {
                        temp.next.prev = temp.prev;
                    }
                }
                break;
            }
            temp = temp.next;
        }
        return {
            result,
            head: linkhead
        };
    }
    buildRecieveTree(element, head) {
        let tempHead = head;
        const recieveResult = this.findRecieveAndRemove(tempHead, element.id);
        tempHead = recieveResult.head;
        if (recieveResult.result) {
            element.recieved = recieveResult.result;
            this.buildRecieveTree(element.recieved, tempHead);
        }
    }
    getAggregate(hids) {
        if (!hids || !hids.length) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "帮助id不能为空"));
        }
        if (hids.length > 100) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "数量过大"));
        }
        HelpRecieve_1.default.findAll({
            attributes: ["helpid", Sequelize.fn("COUNT", Sequelize.literal('DISTINCT `helpid`')), 'ucount'],
            group: "helpid",
            where: {
                helpid: {
                    [Op.in]: hids
                },
                recieveid: -1
            }
        });
    }
    getByids(ids) {
        return HelpRecieve_1.default.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            },
            include: [{
                    model: User_1.default,
                    as: 'user',
                }]
        });
    }
    static createInstance() {
        HelpRecieveService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = HelpRecieveService;
