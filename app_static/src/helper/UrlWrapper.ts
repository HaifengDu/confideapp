declare var unescape: (str: string) => string;
export class UrlHelper {
    /**
     * 根据名称获取url参数
     * @param url
     * @param name
     */
    public static getQueryString(url: string, name: string): string {
        let index: number = url.indexOf("?");

        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = url.substr(index+1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return "";
    }

    /**
     * 获取查询参数对象
     * @param url
     */
    public static getParams(url: string): Object {
        let index: number = url.indexOf("?");
        let tempUrl = url.substr(index); //获取url中"?"符后的字串
        let theRequest: any = new Object();
        if (tempUrl.indexOf("?") != -1) {
            let str = tempUrl.substr(1)
            ,strs:Array<string> = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    public static decode(url: string): string {
        return decodeURI(url);
    }

    public static encode(url: string): string {
        return encodeURI(url);
    }

    public static addParam(url: string, paramKey: string, paramVal: any): string {
        var andStr = "?";
        var beforeparam = url.indexOf("?");
        if (beforeparam != -1) {
            andStr = "&";
        }
        return url + andStr + paramKey + "=" + encodeURIComponent(paramVal);
    }
}