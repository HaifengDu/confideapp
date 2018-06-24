import axios from "axios";
import _ from "lodash";
const host = "/";
_.extend(axios.defaults,{
    baseURL: host,
    timeout: 300000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    // method: 'post',
    // 跨域请求，是否带上认证信息
    withCredentials: false, // default
    // http返回的数据类型
    // 默认是json，可选'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    responseType: 'json', // default
    // http请求返回状态码检查
    validateStatus: (status:number) =>
        status >= 200 && status < 300, // default
    // 请求数据预处理
    transformRequest: [(data:any, headers:any) => {
        // 请求对象转换成jon字符串
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var cacheSqe:any[] = [];
        var keySqe:string[] = [];
        var param = function(obj:any) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            var index = -1;
            for (name in obj) {
                value = obj[name];
                //已经存在 说明出现了环路
                if (cacheSqe.indexOf(value) > -1 && typeof value === 'object') {
                    keySqe.push(name);
                    continue;
                }
                if (value instanceof Array) {
                    keySqe.push(name);
                    cacheSqe.push(value);
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                    index = cacheSqe.indexOf(value);
                    cacheSqe.splice(index, 1);
                    keySqe.splice(index, 1);
                } else if (value instanceof Object) {
                    keySqe.push(name);
                    cacheSqe.push(value);
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                    index = cacheSqe.indexOf(value);
                    cacheSqe.splice(index, 1);
                    keySqe.splice(index, 1);
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return (typeof data === 'object') && String(data) !== '[object File]' ? param(data) : data;
        // return data
    }],
    // 返回数据预处理
    transformResponse: [(respData:any) =>
        // 检查返回status值
        // if (typeof respData.status !== 'undefined') {
        //   if (respData.status === 1) {
        //     return respData
        //   }
        //   throw new Error(respData.errMsg || 'respData.status不为0')
        // }
        respData,
    ],
});