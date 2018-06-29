import Vuex ,{Store} from 'vuex';
import Vue from 'vue';
import { IRootState } from '../interface/IRootState';
import My from '../api/my'
const myService = My.getInstance();
Vue.use(Vuex);


const rootStore:Store<IRootState> = new Store<IRootState>({
  state:{
    user:{}
  },
  getters:{
    user:state=>state.user
  },
  actions:{
    getUserInfo({dispatch,commit},WXid){
      myService.getUserInfobyWXid(WXid).then(res => {
        commit("updateUser", res);
      });
    }
  },
  mutations:{
    "updateUser"(state,user:any){
      state.user = user.data.data;
    }
  }
});
export default rootStore;
