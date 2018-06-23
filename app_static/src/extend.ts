import Vue from "vue";
import axios,{AxiosRequestConfig,AxiosResponse,AxiosStatic} from "axios";
import crypto from "crypto-browserify";
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

Vue.filter("datefilter", (value:any)=> {
  // 返回处理后的值
  let tempDate:any = new Date(value);
  return (<any>tempDate).format("yyyy-MM-dd hh:mm:ss");
});
Vue.filter("jsonfilter", (value:any)=> {
  // 返回处理后的值
  if(value&&value.split) {
    return value;
  }
  return JSON.stringify(value||{});
});

// // add a request interceptor
// axios.interceptors.request.use((config:AxiosRequestConfig)=> {
//     // do something before request is sent
//     return config;
//   // tslint:disable-next-line:typedef
//   }, function (error:Error) {
//     // do something with request error
//     return Promise.reject(error);
//   });

// // add a response interceptor
// axios.interceptors.response.use((response:AxiosResponse) => {
//     // do something with response data
//     return response;
//   // tslint:disable-next-line:typedef
//   }, function (error) {
//     // do something with response error
//     return Promise.reject(error);
//   });

const cacheWraperAxios:(axios:AxiosStatic)=>any = (axios:AxiosStatic)=> {
    let cacheContainer:any = {};
    let unCacheMethods:any = {};
    let get:any = axios.get.bind(axios);
    // tslint:disable-next-line:forin
    for(const key in axios) {
        unCacheMethods[key] = axios[key];
    }
    (<any>axios).get = (...args:any[])=> {
        if(args&&args.length>1&&args[1]&&args[1].cache) {
            let hash:any = (<any>crypto).createHash("sha1");
            hash.update(JSON.stringify(args));
            let cache:any = cacheContainer[hash.digest()];
            if(cache) {
                return new Promise((resolve:any,reject:any)=> {
                    resolve({
                        __fromAxiosCache: true,
                        ...cache
                    });
                });
            }else {
                let promise:Promise<any> = get(...args);
                promise.then(res=> {
                    let hash:any = (<any>crypto).createHash("sha1");
                    hash.update(JSON.stringify(args));
                    cacheContainer[hash.digest()] = res;
                });
                return promise;
            }
        }
        return get(...args);
    };
};
cacheWraperAxios(axios);