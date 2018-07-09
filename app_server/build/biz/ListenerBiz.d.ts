import { IListener } from "../interface/model/IListener";
import { IErrorMsg } from "../interface/IErrorMsg";
export default class ListenerBiz {
    private static _instance;
    private constructor();
    private checkSimpleData;
    checkBindListenerModel(listener: IListener): IErrorMsg;
    static createInstance(): void;
    static getInstance(): ListenerBiz;
}
//# sourceMappingURL=ListenerBiz.d.ts.map