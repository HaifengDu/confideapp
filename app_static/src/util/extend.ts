import Vue from "vue";
// tslint:disable-next-line:interface-name
interface Date {
    format ?: (fmt: string)=>string;
}
(<any>Date.prototype).format = function (fmt: string): string {
    var o: any = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    // tslint:disable-next-line:curly
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    // tslint:disable-next-line:curly
    for (var k in o)
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:triple-equals
        // tslint:disable-next-line:curly
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
