import * as NodeCache from "node-cache";
import * as Bluebird from "bluebird";
import ObjectHelper from "./objectHelper";
const myCache = new NodeCache();
export function getCacheData<T>(key: string, cb:()=>Bluebird<T>, options:NodeCache.Options): Bluebird<T> {
    //优先使用MemCache
    return new Bluebird<T>(function(resolve,reject){
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
            promise.then(res=>{
                myCache.set(key,ObjectHelper.serialize(res));
            });
            return promise;
        }
        return Promise.resolve(res);
    });
}