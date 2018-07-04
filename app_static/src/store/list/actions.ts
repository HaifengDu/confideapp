import { IListState } from "../../interface/IListState";
import IRootState from "../../interface/IRootState";
import { Action } from "vuex";
import Mtype from "./mutation_type";

export const test:Action<IListState,IRootState> = ({dispatch,commit},payload)=>{
    //
}

export const setFilterConds:Action<IListState,IRootState> = ({dispatch,commit},payload) =>{
    commit(Mtype.SET_FILTER_CONDS,payload);
}