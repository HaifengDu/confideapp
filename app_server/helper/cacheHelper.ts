import * as NodeCache from "node-cache";
import * as Bluebird from "bluebird";
import ObjectHelper from "./objectHelper";
const myCache = new NodeCache();
export function getCacheData<T>(key: string, cb:()=>Bluebird<T>|Promise<T>, options:NodeCache.Options): Promise<T> {
    //优先使用MemCache
    return new Promise<T>(function(resolve,reject){
        try{
            myCache.get(key,function(err,data){
                if(err||!data){
                    resolve(null);
                }else{
                    resolve(<T>data);
                }
            });
        }catch(e){
            resolve(null);
        }
    }).then(res=>{
        if(!res){
            let promise = cb();
            (<Promise<T>>promise).then(res=>{
                myCache.set(key,ObjectHelper.serialize(res));
            });
            return promise;
        }
        return Promise.resolve(res);
    });
}