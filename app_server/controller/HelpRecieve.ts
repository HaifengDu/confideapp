import { IHelpRecieve } from "../interface/model/IHelpRecieve";
import ErrorMsg from "../model/ErrorMsg";
import * as Bluebird from "bluebird";
import * as Sequelize from "sequelize";
import HelpRecieve from "../model/HelpRecieve";
import User from "../model/User";
import { IPager } from "../interface/IPager";
const Op = Sequelize.Op;
export default class HelpRecieveService {

    private static _instance: HelpRecieveService;

    private constructor() {
    }

    public create(model:IHelpRecieve){
        if(!model){
            return Bluebird.reject(new ErrorMsg(false,"参数不能为空"));
        }
        if(!model.helpid){
            return Bluebird.reject(new ErrorMsg(false,"求助id不能为空"));
        }
        if(!model.uid){
            return Bluebird.reject(new ErrorMsg(false,"用户id不能为空"));
        }
        if(!model.content){
            return Bluebird.reject(new ErrorMsg(false,"内容不能为空"));
        }
        return HelpRecieve.create(model);
    }

    public getList(helpid:number,page:IPager){
        HelpRecieve.findAll({
            offset:page.start,
            limit:page.limit,
            where:{
                helpid:helpid,
                recieveid:-1
            }
        }).then(res=>{
            if(!res||!res.length){
                return res;
            }
            return HelpRecieve.findAll({
                where:{
                    helpid:helpid,
                    recieveid:{
                        [Op.ne]:-1
                    }
                }
            }).then(recievies=>{
                const linkList = this.arrayToLinklist(recievies);
                res.forEach(item=>{
                    this.buildRecieveTree(item,linkList);
                });
                return res;
            });
        });
    }
    
    private arrayToLinklist(list:IHelpRecieve[]){
        if(!list||!list.length){
            return null;
        }
        const head = list[0];
        for (let index = 1; index < list.length; index++) {
            const element = list[index];
            if(list[index+1]){
                element.next = list[index+1];
                list[index+1].prev = element;
            }else{
                element.next = null;
            }
        }
        if(list[1]){
            head.next = list[1];
            list[1].prev = head;
        }
        return head;
    }


    private findRecieveAndRemove(head:IHelpRecieve,pid:number){
        let temp = head;
        let linkhead = head;
        let result:IHelpRecieve = null;
        while(temp){
            if(temp.recieveid===pid){
                result = temp;
                if(temp===head){
                    linkhead = temp.next;
                    if(linkhead) {
                        linkhead.prev = null;
                    }
                }else{
                    temp.prev.next = temp.next;
                    if(temp.next){
                        temp.next.prev = temp.prev;
                    }
                }
                break;
            }
            temp = temp.next;
        }
        return {
            result,
            head:linkhead
        }
    }

    private buildRecieveTree(element:IHelpRecieve,head:IHelpRecieve){
        let tempHead = head;
        const recieveResult = this.findRecieveAndRemove(tempHead,element.id);
        tempHead = recieveResult.head;
        if(recieveResult.result){
            element.recieved = recieveResult.result;
            this.buildRecieveTree(element.recieved,tempHead);
        }
    }

    public getAggregate(hids:number[]){
        if(!hids||!hids.length){
            return Bluebird.reject(new ErrorMsg(false,"帮助id不能为空"));
        }
        if(hids.length>100){
            return Bluebird.reject(new ErrorMsg(false,"数量过大"));
        }
        HelpRecieve.findAll({
            attributes:["helpid",Sequelize.fn("COUNT",Sequelize.literal('DISTINCT `helpid`')),'ucount'],
            group:"helpid",
            where:{
                helpid:{
                    [Op.in]:hids
                },
                recieveid:-1
            }
        });
    }

    public getByids(ids:number[]){
        return HelpRecieve.findAll({
            where:{
                id:{
                    [Op.in]:ids
                }
            },
            include:[{
                model:User,
                as: 'user',
            }]
        })
    }

    static createInstance() {
        HelpRecieveService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}