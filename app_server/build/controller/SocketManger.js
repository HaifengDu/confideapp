"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketMananger {
    constructor() {
        this.socketDict = {};
    }
    static createInstance() {
        SocketMananger.getInstance();
    }
    add(uid, socket) {
        this.socketDict[uid] = socket;
    }
    get(uid) {
        return this.socketDict[uid];
    }
    remove(socket) {
        let uid;
        for (const key in this.socketDict) {
            if (this.socketDict[key] === socket) {
                uid = key;
            }
        }
        if (uid) {
            delete this.socketDict[uid];
        }
    }
    clear() {
        this.socketDict = {};
    }
    removeByUid(uid) {
        return delete this.socketDict[uid];
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = SocketMananger;
