import { IAreaConfig, IArea } from "../interface/IArea";
import _ = require("lodash");

// import * as areaConfig from "../config/area.json"
const data = <IAreaConfig>require('../../config/area.json');

class AreaHelper {

    private static _instance: AreaHelper;
    private static _arealist:{code:string,name:string}[] = [];
    private constructor() {
        this.analisyArea(data);
    }

    private analisyArea(data:IAreaConfig|{[index:string]:string}){
        Object.keys(data).forEach(item=>{
            let tempData = data[item];
            if(_.isString(tempData)){
                AreaHelper._arealist.push({
                    code:item,
                    name:tempData
                });
            }else{
                AreaHelper._arealist.push({
                    code:item,
                    name:tempData.name
                });
                
                if(tempData.child){
                    this.analisyArea(tempData.child);
                }
            }
        });
    }

    public getCode(name:string):string{
        const current = AreaHelper._arealist.find(item=>item.name.indexOf(name)>-1)
        return current?current.code:"";
    }

    public getName(code:string):string{
        const current = AreaHelper._arealist.find(item=>item.code === code)
        return current?current.name:"";
    }

    static createInstance() {
        AreaHelper.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default AreaHelper;