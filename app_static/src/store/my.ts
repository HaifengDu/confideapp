import Vuex, { Store } from "vuex";
import Vue from "vue";
import { IRootState } from "../interface/IRootState";
import My from '../api/my'
const myService = My.getInstance();
Vue.use(Vuex);

const rootStore: Store<IRootState> = new Store<IRootState>({
  state: {
    user: {}
  },
  getters:{

  },
  actions:{

  },
  mutations: {

  }
});
export default rootStore;
