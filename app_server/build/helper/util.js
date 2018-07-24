"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function retryInsertMongo(count) {
    let current = 0;
    return function insert(model, docs, callback) {
        model.insertMany(docs, (err, docs) => {
            if (err && current++ < count) {
                setTimeout(function () {
                    insert(model, docs);
                    return;
                }, 2 * 1000);
            }
            callback(err, docs);
        });
    };
}
exports.retryInsertMongo = retryInsertMongo;
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;
}
exports.getClientIp = getClientIp;
function createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
}
exports.createNonceStr = createNonceStr;
;
