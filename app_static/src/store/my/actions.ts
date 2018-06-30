import { IMyState } from "../../interface/IMyState";
import IRootState from "../../interface/IRootState";
import { Action } from "vuex";

export const test:Action<IMyState,IRootState> = ({dispatch,commit},payload)=>{
    //
}