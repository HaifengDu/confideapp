"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeCache = require("node-cache");
const objectHelper_1 = require("./objectHelper");
const myCache = new NodeCache();
function getCacheData(key, cb, options) {
    //优先使用MemCache
    return new Promise(function (resolve, reject) {
        try {
            myCache.get(key, function (err, data) {
                if (err || !data) {
                    resolve(null);
                }
                else {
                    resolve(data);
                }
            });
        }
        catch (e) {
            resolve(null);
        }
    }).then(res => {
        if (!res) {
            let promise = cb();
            promise.then(res => {
                myCache.set(key, objectHelper_1.default.serialize(res));
            });
            return promise;
        }
        return Promise.resolve(res);
    });
}
exports.getCacheData = getCacheData;
