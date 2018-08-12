import OrderService from "./Order";
import { LogHelper } from "../helper/logHelper";
import ErrorMsg from "../model/ErrorMsg";

export class OrderSocket{
    private static readonly AddCount = "add_count";
    private static readonly CommitCount = "add_count";
    private orderService = OrderService.getInstance();
    private logHelper = LogHelper.getInstance();
    private countContainer:{
        [index:number]:number
    }
    constructor(private socket:SocketIO.Socket,private userid:number){
        this.initEvent();
    }

    private initEvent(){
        this.socket.on(OrderSocket.AddCount,this.addCount.bind(this));
        this.socket.on(OrderSocket.CommitCount,this.commitCount.bind(this));
        this.socket.on('disconnect',this.mCommitCount.bind(this));
    }

    private addCount(data:{
        oid:number
    }){
        if(!data||!data.oid) {
            return;
        }
        if(!(data.oid in this.countContainer)){
            this.countContainer[data.oid] = 0;
        }
        this.countContainer[data.oid]++;
    }

    private commitCount(data:{
        oid:number
    }){
        if(!data||!data.oid) {
            return Promise.reject(new ErrorMsg(false, "订单id不能为空"));
        }
        // 更新时长
        const count = this.countContainer[data.oid];
        return this.orderService.updateServicetime(this.userid,data.oid,count).then(res=>{
            this.logHelper.append({
                body:res,
                message:"更新订单时长成功"
            });
            delete this.countContainer[data.oid];
        });
    }

    private mCommitCount(){
        const promiseList = [];
        for(let key in this.countContainer){
            promiseList.push(this.commitCount({oid:parseInt(key)}));
        }
        return Promise.all(promiseList);
    }

    static getInstance(socket:SocketIO.Socket,userid:number){
        return new OrderSocket(socket,userid);
    }
}