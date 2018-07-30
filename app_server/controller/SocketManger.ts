import { Socket } from "socket.io";

export default class SocketMananger {

    private static _instance: SocketMananger;

    private socketDict:{[index:number]:Socket} = {};

    private constructor() {
    }

    static createInstance() {
        SocketMananger.getInstance();
    }

    public add(uid:number,socket:Socket){
        this.socketDict[uid] = socket;
    }

    public get(uid:number){
        return this.socketDict[uid];
    }

    public remove(socket:Socket){
        let uid:string;
        for(const key in this.socketDict){
            if(this.socketDict[key]===socket){
                uid = key;
            }
        }
        if(uid){
            delete this.socketDict[uid];
        }
    }

    public clear(){
        this.socketDict = {};
    }

    public removeByUid(uid:number){
        return delete this.socketDict[uid];
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}