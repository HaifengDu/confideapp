import Axios,{AxiosPromise} from "axios";
import { IResponse } from "../interface/model/IResponse";
import { IOnlyChatRecord } from "../interface/mongomodel/IChatRecord";

export default class ChatService {

    private static _instance: ChatService;

    private constructor() {
    }


    /**
     * 获取默认记录
     * @param roomid 
     */
    public getDefaultChatRecords(roomid:string):AxiosPromise<IResponse<IOnlyChatRecord[]>>{
        return Axios.get("/chat",{
            params:{
                roomid:roomid
            }
        });
    }

    static createInstance() {
        ChatService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}