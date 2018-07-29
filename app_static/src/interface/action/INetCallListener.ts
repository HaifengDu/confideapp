/**
 * 通话接口
 */
export interface INetCallListener{
    calling(obj?:{fromid:number,fromname:string}):void;
    accept(obj?:{fromid:number,fromname:string}):void;
    reject(obj?:{fromid:number,fromname:string}):void;
    close?:()=>void;
    connecterror?:()=>void;
    handup():void;
}

export default INetCallListener;