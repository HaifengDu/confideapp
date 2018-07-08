"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GeneralSetting_1 = require("../model/GeneralSetting");
const MainLabel_1 = require("./MainLabel");
const Bluebird = require("bluebird");
const EGeneralStatus_1 = require("../enum/EGeneralStatus");
const cacheHelper_1 = require("../helper/cacheHelper");
const CacheKey_1 = require("../model/CacheKey");
const _ = require("lodash");
const rankRandomHelper_1 = require("../helper/rankRandomHelper");
const Listener_1 = require("../model/Listener");
const ERecieveStatus_1 = require("../enum/ERecieveStatus");
const objectHelper_1 = require("../helper/objectHelper");
const rankRandomGen = rankRandomHelper_1.rankRandom([80, 95]);
class RecommendService {
    constructor() {
        this.Count = 100;
        this.labelService = MainLabel_1.default.getInstance();
    }
    getHomeRecommend() {
        const systemLabels = this.labelService.findSystemLabel();
        return cacheHelper_1.getCacheData(CacheKey_1.CacheKey.Recommend, () => {
            //可接单状态
            return GeneralSetting_1.default.findAll({
                include: [{
                        model: Listener_1.default,
                        where: {
                            recievestatus: ERecieveStatus_1.ERecieveStatus.可接单
                        },
                        as: 'listener'
                    }],
                where: {
                    status: EGeneralStatus_1.EGeneralStatus.Enable
                }
            });
        }, {
            stdTTL: 60 * 60
        }).then(res => {
            const labledic = {};
            systemLabels.forEach(item => {
                labledic[item.id] = { arr: [], name: item.name };
                for (let i = 0; i < res.length; i++) {
                    let labelids = res[i].listener.labelids;
                    labelids = objectHelper_1.default.parseJSON(labelids);
                    if (!labelids) {
                        continue;
                    }
                    if (labelids.indexOf(item.id) > -1) {
                        labledic[item.id].arr.push(res[i]);
                    }
                }
            });
            return Bluebird.resolve(labledic);
        }).then(res => {
            const existids = [];
            for (let key in res) {
                const arr = res[key].arr;
                res[key].arr = [];
                //0-2  2-5  5-无穷
                const obj = _.groupBy(arr, (item) => {
                    if (item.price >= 5) {
                        return 1;
                    }
                    if (item.price >= 2 && item.price < 5) {
                        return 2;
                    }
                    return 3;
                });
                if (arr && arr.length) {
                    const randomKeys = rankRandomGen(this.Count);
                    //从对应分组的数组中，随机抽取对应的条数
                    let randomArr = getArrayItems(obj[1] || [], randomKeys[80]);
                    randomArr = randomArr.concat(getArrayItems(obj[2] || [], randomKeys[95]));
                    randomArr = randomArr.concat(getArrayItems(obj[3] || [], randomKeys[100]));
                    //查找相同的
                    const same = _.intersectionBy(randomArr, existids, function (item) {
                        if (typeof item === "number") {
                            return item;
                        }
                        return item.uid;
                    });
                    //去除相同的
                    if (same.length) {
                        const sameuids = same.map(item => item.uid);
                        _.remove(randomArr, item => sameuids.indexOf(item.uid) > -1);
                    }
                    if (randomArr.length < this.Count) {
                        //从第一级补齐
                        obj[1].forEach(item => {
                            if (randomArr.length >= this.Count) {
                                return false;
                            }
                            if (!randomArr.find(model => model.uid === item.uid)) {
                                randomArr.push(item);
                            }
                        });
                    }
                    randomArr.forEach(item => {
                        existids.push(item.uid);
                    });
                    res[key].arr = randomArr;
                }
            }
            return Bluebird.resolve(res);
        });
    }
    getListRecommend() {
        //可接单状态
        return GeneralSetting_1.default.findAll({
            include: [{
                    model: Listener_1.default,
                    where: {
                        recievestatus: ERecieveStatus_1.ERecieveStatus.可接单
                    },
                    as: 'listener'
                }],
            where: {
                status: EGeneralStatus_1.EGeneralStatus.Enable
            }
        }).then(res => {
            const obj = _.groupBy(res, (item) => {
                if (item.price >= 5) {
                    return 1;
                }
                if (item.price >= 2 && item.price < 5) {
                    return 2;
                }
                return 3;
            });
            const randomKeys = rankRandomGen(this.Count);
            let randomArr = getArrayItems(obj[1] || [], randomKeys[80]);
            randomArr = randomArr.concat(getArrayItems(obj[2] || [], randomKeys[95]));
            randomArr = randomArr.concat(getArrayItems(obj[3] || [], randomKeys[100]));
            const sortedArr = res.sort((a, b) => a.price > b.price ? -1 : 1);
            if (randomArr.length < this.Count) {
                //从第一级补齐
                for (let i = 0, count = sortedArr.length; i < count; i++) {
                    if (randomArr.length >= this.Count) {
                        break;
                    }
                    if (!randomArr.find(model => model.uid === sortedArr[i].uid)) {
                        randomArr.push(sortedArr[i]);
                    }
                }
            }
            return randomArr;
        });
    }
    static createInstance() {
        RecommendService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = RecommendService;
function getArrayItems(arr, num) {
    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
    let temp_array = new Array();
    for (let index in arr) {
        temp_array.push(arr[index]);
    }
    //取出的数值项,保存在此数组
    let return_array = new Array();
    for (let i = 0; i < num; i++) {
        //判断如果数组还有可以取出的元素,以防下标越界
        if (temp_array.length > 0) {
            //在数组中产生一个随机索引
            let arrIndex = Math.floor(Math.random() * temp_array.length);
            //将此随机索引的对应的数组元素值复制出来
            return_array[i] = temp_array[arrIndex];
            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
            temp_array.splice(arrIndex, 1);
        }
        else {
            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
            break;
        }
    }
    return return_array;
}
