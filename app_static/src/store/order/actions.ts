import { IOrderState } from "../../interface/IOrderState";
import IRootState from "../../interface/IRootState";
import { Action } from "vuex";
import mutation_type from "./mutation_type";

export const test:Action<IOrderState,IRootState> = ({dispatch,commit},payload)=>{
    //
}

export const setOrder: Action<IOrderState, IRootState> = (
    { dispatch, commit },
    order
  ) => {
    commit(mutation_type.UPDATE_ORDER, order);
  };