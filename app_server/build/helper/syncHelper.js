"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
class SyncHelper {
    constructor() {
        this.syncUrl = "http://127.0.0.1:3003";
    }
    /**
     * 同步音频
     * @param ids
     */
    syncAudio(ids) {
        const url = this.syncUrl + "/chatsync?cids=" + JSON.stringify(ids);
        return new Promise(function (resolve, reject) {
            request.get(url, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (res.statusCode !== 200) {
                    reject(res);
                    return;
                }
                resolve(res);
            });
        });
    }
    static createInstance() {
        SyncHelper.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = SyncHelper;
