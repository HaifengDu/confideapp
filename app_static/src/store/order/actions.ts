import { IOrderState } from "../../interface/IOrderState";
import IRootState from "../../interface/IRootState";
import mutation_type from "./mutation_type";
import { Action } from "vuex";

export const test:Action<IOrderState,IRootState> = ({dispatch,commit},payload)=>{
    //
}
export const updatePreOrder: Action<IOrderState, IRootState> = ({ dispatch, commit }, preOrder) => {
  commit(mutation_type.UPDATE_PRE_ORDER, preOrder);
};
