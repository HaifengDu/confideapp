import Vuex ,{Store} from 'vuex';
import Vue from 'vue';
import { IRootState } from '../interface/IRootState';
import MType from "./mutation_type";
import * as actions from "./action";
Vue.use(Vuex);

import help from "./help";
import home from "./home";
import list from "./list";
import my from "./my";
import order from "./order";
import payment from "./payment";

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
      state.user = user.data;
    }
  },
  modules:{
    help,
    home,
    list,
    my,
    order,
    payment
  }
});
export default rootStore;
