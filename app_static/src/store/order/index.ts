import {Module} from 'vuex';
import { IOrderState } from '../../interface/IOrderState';
import Mtype from "./mutation_type";
import * as actions from "./actions";
import IRootState from '../../interface/IRootState';
export const store:Module<IOrderState,IRootState> = {
    state:{
        order:{}
    },
    getters:{
        order:state=>state.order
    },
    actions:{
        ...actions
    },
    mutations:{
        [Mtype.UPDATE_ORDER](state,order){
            state.order = order
        }
    }
};

export default store;