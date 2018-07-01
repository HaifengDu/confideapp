"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObjectHelper {
    /**
     * 不覆盖source的merge
     * @param source
     * @param target
     */
    static merge(source, target) {
        for (const key in target) {
            if (target.hasOwnProperty(key)) {
                const element = target[key];
                if (!(key in source)) {
                    source[key] = element;
                }
            }
        }
    }
    static serialize(obj) {
        let result;
        try {
            if (typeof obj === "string") {
                result = JSON.parse(obj);
            }
            else {
                result = JSON.parse(JSON.stringify(obj));
            }
        }
        catch (e) {
            result = null;
        }
        return result;
    }
    static mergeChildToSource(obj) {
        if (!obj) {
            return null;
        }
        const deletekeys = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                if (typeof element === "object") {
                    this.merge(obj, element);
                    deletekeys.push(key);
                }
            }
        }
        for (let index = 0; index < deletekeys.length; index++) {
            const element = deletekeys[index];
            delete obj[element];
        }
    }
    static parseJSON(str) {
        if (!str) {
            return null;
        }
        //非字符串直接返回
        if (typeof str !== "string" || Object.prototype.toString.call(str) !== '[object String]') {
            return str;
        }
        let result = null;
        try {
            result = JSON.parse(str);
        }
        catch (e) {
            //
        }
        return result;
    }
}
exports.default = ObjectHelper;
