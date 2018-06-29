
import axios,{AxiosRequestConfig,AxiosResponse,AxiosStatic} from "axios";
import crypto from "crypto-browserify";


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
export default cacheWraperAxios;