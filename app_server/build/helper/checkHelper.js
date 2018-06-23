"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkNumber(theObj) {
    const reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(theObj)) {
        return true;
    }
    return false;
}
exports.checkNumber = checkNumber;
