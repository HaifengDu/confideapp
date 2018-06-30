import Vuex ,{Store} from 'vuex';
import Vue from 'vue';
import { IRootState } from '../interface/IRootState';
import MType from "./mutation_type";
import * as actions from "./action";
Vue.use(Vuex);


const rootStore:Store<IRootState> = new Store<IRootState>({
  state:{
    user:{}
  },
  getters:{
    user:state=>state.user
  },
  actions:{
    ...actions
  },
  mutations:{
    [MType.UPDATE_USER](state,user:any){
      state.user = user.data.data;
    }
  }
});
export default rootStore;
