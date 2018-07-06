import * as request from "request";
class SyncHelper {

    private static _instance: SyncHelper;
    private readonly syncUrl = "http://127.0.0.1:3003";

    private constructor() {
    }

    /**
     * 同步音频
     * @param ids 
     */
    public syncAudio(ids:number[]){
        const url = this.syncUrl+"?cids="+JSON.stringify(ids);
        return new Promise<any>(function(resolve,reject){
            request.get(url,(err,res)=>{
                if(err){
                    reject(err);
                    return;
                }
                if(res.statusCode!==200){
                    reject(res);
                    return;
                }
                resolve(res);
            });
        });
    }

    static createInstance() {
        SyncHelper.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}