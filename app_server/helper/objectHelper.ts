export default class ObjectHelper{
    /**
     * 不覆盖source的merge
     * @param source 
     * @param target 
     */
    static merge(source:any,target:any,cover=false){
        for (const key in target) {
            if (target.hasOwnProperty(key)) {
                const element = target[key];
                if(cover){
                    source[key] = element;
                }else if(!(key in source)){
                    source[key] = element;
                }
            }
        }
    }

    static serialize<T>(obj:any){
        let result:T
        try{
            if(typeof obj==="string"){
                result = JSON.parse(obj);
            }else{
                result = JSON.parse(JSON.stringify(obj));
            }
        }catch(e){
            result = null;
        }
        return result;
    }

    static mergeChildToSource(obj:any){
        if(!obj){
            return null;
        }
        const deletekeys:string[] = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                if(typeof element==="object"){
                    this.merge(obj,element);
                    deletekeys.push(key);
                }
            }
        }
        for (let index = 0; index < deletekeys.length; index++) {
            const element = deletekeys[index];
            delete obj[element];
        }
    }
    static parseJSON<T extends any>(str?:string|any){
        if(!str){
            return null;
        }
        //非字符串直接返回
        if(typeof str!=="string"||Object.prototype.toString.call(str)!=='[object String]'){
            return str as any;
        }
        let result = null;
        try{
            result = JSON.parse(str)
        }catch(e){
            //
        }
        return result as T;
    }
}