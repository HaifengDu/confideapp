import {Module} from 'vuex';
import { IOrderState } from '../../interface/IOrderState';
import OrderType from "./mutation_type";
import * as actions from "./actions";
import IRootState from '../../interface/IRootState';
export const store:Module<IOrderState,IRootState> = {
    state:{
      preOrder:{}
    },
    getters:{

    },
    actions:{
        ...actions
    },
    mutations:{
      [OrderType.UPDATE_PRE_ORDER](state,preOrder){
        state.preOrder = preOrder
      }
    },
    namespaced:true
};

export default store;
