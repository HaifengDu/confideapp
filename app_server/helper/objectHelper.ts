export default class ObjectHelper{
    /**
     * 不覆盖source的merge
     * @param source 
     * @param target 
     */
    static merge(source:any,target:any){
        for (const key in target) {
            if (target.hasOwnProperty(key)) {
                const element = target[key];
                if(!(key in source)){
                    source[key] = element;
                }
            }
        }
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
    static parseJSON(str:string){
        let result = null;
        try{
            result = JSON.parse(str)
        }catch(e){
            //
        }
        return result;
    }
}