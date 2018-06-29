import GeneralSetting from "../model/GeneralSetting";
import MainLabelService from "./MainLabel";
import * as Bluebird from "bluebird";
import { EGeneralStatus } from "../enum/EGeneralStatus";
import { getCacheData } from "../helper/cacheHelper";
import { CacheKey } from "../model/CacheKey";
import { IGeneralSetting } from "../interface/model/IGeneralSetting";
import _ = require("lodash");
import { rankRandom } from "../helper/rankRandomHelper";
import Listener from "../model/Listener";
import { ERecieveStatus } from "../enum/ERecieveStatus";
import ObjectHelper from "../helper/objectHelper";
const rankRandomGen = rankRandom([80,95]);
export default class RecommendService {

    private static _instance: RecommendService;
    private labelService:MainLabelService;
    private readonly Count =6;

    private constructor() {
        this.labelService = MainLabelService.getInstance();
    }

    public getHomeRecommend(){
        const systemLabels = this.labelService.findSystemLabel();
        return getCacheData(CacheKey.Recommend,()=>{
            //可接单状态
            return GeneralSetting.findAll({
                include:[{
                    model:Listener,
                    where:{
                        recievestatus:ERecieveStatus.可接单
                    },
                    as: 'listener'
                }],
                where:{
                    status:EGeneralStatus.Enable
                }
            });
        },{
            stdTTL: 60*60
        }).then(res=>{
            const labledic:{[index:number]:{arr:IGeneralSetting[],name:string}} = {};
            systemLabels.forEach(item=>{
                labledic[item.id]= {arr:[],name:item.name};
                for(let i=0;i<res.length;i++){

                    let labelids:any = res[i].listener.labelids;
                    labelids = ObjectHelper.parseJSON(labelids);
                    if(!labelids){
                        continue;
                    }
                    if(labelids.indexOf(item.id)>-1){
                        labledic[item.id].arr.push(res[i]);
                    }
                }
            });
            return Bluebird.resolve(labledic);
        }).then(res=>{
            const existids:number[] = [];
            for(let key in res){
                const arr = res[key].arr;
                res[key].arr = [];
                //0-2  2-5  5-无穷
                const obj = _.groupBy(arr,(item:IGeneralSetting)=>{
                   if(item.price>=5){
                       return 1;
                   }
                   if(item.price>=2&&item.price<5){
                       return 2;
                   }
                   return 3;
                });
                if(arr&&arr.length){
                    const randomKeys = rankRandomGen(this.Count);
                    //从对应分组的数组中，随机抽取对应的条数
                    let randomArr = getArrayItems(obj[1]||[],randomKeys[80]);
                    randomArr = randomArr.concat(getArrayItems(obj[2]||[],randomKeys[95]));
                    randomArr = randomArr.concat(getArrayItems(obj[3]||[],randomKeys[100]));
                    //查找相同的
                    const same = _.intersectionBy(randomArr,existids,function(item){
                        if(typeof item ==="number"){
                            return item;
                        }
                        return item.uid;
                    });
                    //去除相同的
                    if(same.length){
                        const sameuids = same.map(item=>item.uid);
                        _.remove(randomArr,item=>sameuids.indexOf(item.uid)>-1);
                    }
                    if(randomArr.length<this.Count){
                        //从第一级补齐
                        obj[1].forEach(item=>{
                            if(randomArr.length>=this.Count){
                                return false;
                            }
                            if(!randomArr.find(model=>model.uid===item.uid)){
                                randomArr.push(item);
                            }
                        });
                    }
                    randomArr.forEach(item=>{
                        existids.push(item.uid);
                    });
                    res[key].arr = randomArr;
                }
            }
            return Bluebird.resolve(res);
        });
    }

    static createInstance() {
        RecommendService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

function getArrayItems<T>(arr:T[], num) {
    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
    let temp_array = new Array();
    for (let index in arr) {
        temp_array.push(arr[index]);
    }
    //取出的数值项,保存在此数组
    let return_array = new Array<T>();
    for (let i = 0; i<num; i++) {
        //判断如果数组还有可以取出的元素,以防下标越界
        if (temp_array.length>0) {
            //在数组中产生一个随机索引
            let arrIndex = Math.floor(Math.random()*temp_array.length);
            //将此随机索引的对应的数组元素值复制出来
            return_array[i] = temp_array[arrIndex];
            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
            temp_array.splice(arrIndex, 1);
        } else {
            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
            break;
        }
    }
    return return_array;
}