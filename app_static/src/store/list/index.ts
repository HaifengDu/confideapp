import {Module} from 'vuex';
import { IListState } from '../../interface/IListState';
import Mtype from "./mutation_type";
import * as actions from "./actions";
import IRootState from '../../interface/IRootState';
export const store:Module<IListState,IRootState> = {
    namespaced:true,
    state:{
      searchConds:{}
    },
    getters:{
      searchConds:state=>state.searchConds
    },
    actions:{
      ...actions
    },
    mutations:{
      [Mtype.SET_FILTER_CONDS](state,payload){
          state.searchConds = payload
      },
      [Mtype.UPDATE_LABEL_ID](state,labelId){
      state.searchConds.labelid = labelId;
      }
    }
};

export default store;
