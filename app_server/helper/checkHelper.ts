export function checkNumber(theObj) {
    const reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(theObj)) {
      return true;
    }
    return false;
}