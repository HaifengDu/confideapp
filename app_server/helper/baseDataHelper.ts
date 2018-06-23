import AreaHelper from "./areaHelper";
import { IAreaConfig } from "../interface/IArea";
import { IBaseData } from "../interface/IBaseData";
import { ITreeData } from "../interface/ITreeData";

const edu = <IBaseData[]>require("../../config/edu.json");
const family = <IBaseData[]>require("../../config/family.json");
const job = <ITreeData[]>require("../../config/job.json");

export default class BaseDataHelper {

    private static _instance: BaseDataHelper;

    private areaHelper:AreaHelper;

    private constructor() {
        this.areaHelper = AreaHelper.getInstance();
    }

    public getArea(){
        return this.areaHelper.getArea();
    }

    private getTreeNode(root:ITreeData[],id:number){
        let result:ITreeData = null;
        for(let i=0,length=root.length;i<length;i++){
            if(root[i].id===id){
                result = root[i];
                break;
            }
            if(root[i].children&&root[i].children.length){
                result = this.getTreeNode(root[i].children,id);
                if(result){
                    break;
                }
            }
        }
        return result;
    }

    public getJob(id?:number){
        if(typeof id!=='undefined'){
            return this.getTreeNode(job,id);
        }
        return job;
    }

    public getFamily(id?:number){
        if(typeof id!=='undefined'){
            return family.find(item=>item.id===id);
        }
        return family;
    }

    public getEdu(id?:number){
        if(typeof id!=='undefined'){
            return edu.find(item=>item.id===id);
        }
        return edu;
    }

    static createInstance() {
        BaseDataHelper.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}