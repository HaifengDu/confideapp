// import UserModel from "../model/User";
import MainLabelModel from "../model/MainLabel";
import { IMainLabel } from "../interface/model/IMainLabel";
import * as Bluebird from "bluebird";
import { ELabelStatus } from "../enum/ELabelStatus";
import { ELabelCType,ELabelSType } from "../enum/ELabelType";
import ObjectHelper from "../helper/objectHelper";
import _ = require("lodash");

export default class MainLabelService {

    private static _instance: MainLabelService;
    private _labelList:IMainLabel[] = [];
    private _expList:IMainLabel[] = [];

    private constructor() {
        this.initMainLabel();
    }

    public findSystemLabel(){
        return this._labelList.filter(item=>item.ctype===ELabelCType.Admin&&item.status===ELabelStatus.正常)||[];
    }

    public findLabel(ids:Array<number>){
        return this._labelList.filter(item=>item.status===ELabelStatus.正常&&ids.indexOf(item.id)>1)||[];
    }


    public findSystemUnionUser(uid:number){
        return this._labelList.filter(item=>(item.ctype===ELabelCType.Admin||item.cuid===uid)&&item.status===ELabelStatus.正常)||[];
    }

    /**
     * 查找自己的标签（包含审核中）
     * @param ids 
     */
    public findLabelByMyself(ids:Array<number>){
        return this._labelList.filter(item=>(item.status===ELabelStatus.正常||item.status===ELabelStatus.审核中)&&ids.indexOf(item.id)>-1)||[];
    }

    public findExprience(ids:number[]){
        return this._expList.filter(item=>item.status===ELabelStatus.正常&&ids.indexOf(item.id)>1)||[];
    }

    public addLabel(model:IMainLabel){
        if(!model){
            return Bluebird.reject({message:"标签不能为空"});
        }
        return MainLabelModel.create(model).then(res=>{
            let tempModel = ObjectHelper.serialize<IMainLabel>(res);
            if(tempModel){
                if(model.stype===ELabelSType.Experience){
                    this._expList.push(tempModel);
                }else{
                    this._labelList.push(tempModel);
                }
            }
            return Promise.resolve(res);
        });
    }

    public update(model:IMainLabel){
        const promise = MainLabelModel.update(model,{
            where:{
                id:model.id
            }
        });
        promise.then(res=>{
            let current:IMainLabel;
            if(model.stype===ELabelSType.Label){
                current = this._labelList.find(item=>item.id===model.id);
            }else{
                current = this._expList.find(item=>item.id===model.id);
            }
            
            if(current){
                _.extend(current,model);
            }
        });;
        return promise;
    }

    public deleteLabel(id:number,stype:ELabelSType){
        const promise = MainLabelModel.destroy({
            where:{
                id:id
            }
        });
        return promise.then(res=>{
            let current:IMainLabel;
            if(stype===ELabelSType.Label){
                current = _.remove(this._labelList,item=>item.id===id)[0];
            }else{ 
                current = _.remove(this._expList,item=>item.id===id)[0];
            }
            return current;
        });
    }

    private initMainLabel(){
        MainLabelModel.findAll().then(res=>{
            const list = <IMainLabel[]>JSON.parse(JSON.stringify(res))||[];
            this._labelList = list.filter(item=>item.stype===ELabelSType.Label);
            this._expList = list.filter(item=>item.stype===ELabelSType.Experience);
        });
    }

    static createInstance() {
        MainLabelService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

MainLabelService.createInstance();

