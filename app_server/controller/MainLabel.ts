// import UserModel from "../model/User";
import MainLabelModel from "../model/MainLabel";
import { IMainLabel } from "../interface/model/IMainLabel";
import * as Bluebird from "bluebird";
import { ELabelStatus } from "../enum/ELabelStatus";
import { ELabelType } from "../enum/ELabelType";

export default class MainLabelService {

    private static _instance: MainLabelService;
    private _list:IMainLabel[] = [];

    private constructor() {
        this.initMainLabel();
    }

    public findLabel(ids:Array<number>){
        return this._list.filter(item=>item.status===ELabelStatus.正常&&ids.indexOf(item.id)>1);
    }

    public findLabelByUser(ids:number[],listenerid:number){
        return this.findLabel(ids).filter(item=>item.type===ELabelType.Admin||item.cuid===listenerid);
    }

    public addLabel(model:IMainLabel){
        if(!model){
            return Bluebird.reject({message:"标签不能为空"});
        }
        MainLabelModel.create(model).then(res=>{
            this._list.push(model);
        });
    }

    private initMainLabel(){
        MainLabelModel.findAll().then(res=>{
            this._list = JSON.parse(JSON.stringify(res));
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

