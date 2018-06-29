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
