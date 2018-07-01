import {Module} from 'vuex';
import { IMyState } from '../../interface/IMyState';
import Mtype from "./mutation_type";
import * as actions from "./actions";
import IRootState from '../../interface/IRootState';
export const store:Module<IMyState,IRootState> = {
    namespaced:true,
    state:{
      phone:'',
      baseInfo:{},
      exprience:{}
    },
    getters:{

    },
    actions:{
        ...actions
    },
    mutations:{
      [Mtype.UPDATE_PHONE](state,phone){
        state.phone = phone
      },
      [Mtype.UPDATE_BASE_INFO](state,data){
        state.baseInfo = data
      },
      [Mtype.UPDATE_EXPRIENCE](state,data){
        state.exprience = data
      }
    }
};

export default store;
