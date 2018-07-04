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
import _ from 'lodash';

const rootStore:Store<IRootState> = new Store<IRootState>({
  state:{
    user:{},
    baseData:{
      family:[],
      edu:[],
      job:[]
    }
  },
  getters:{
    user:state=>state.user,
    baseData:state=>state.baseData,
    allBaseData:state=>{
      const temp:any = {};
      for(let key in state.baseData){
        const current = state.baseData[key];
        if(_.isArray(current)){
          const tempArr = _.slice(current);
          tempArr.unshift({
            id:-1,
            name:"不限"
          });
          temp[key] = tempArr;
        }else{
          const tempArr:any[] =  [];
          for(let areaKey in current){
            tempArr.push({
              id:areaKey,
              name:current[areaKey].name
            });
          }
          tempArr.unshift({
            id:-1,
            name:"不限"
          })
          temp[key] = tempArr;
        }
      }
      return temp;
    }
  },
  actions:{
    ...actions
  },
  mutations:{
    [MType.UPDATE_USER](state,user:any){
      state.user = user.data;
    },
    [MType.SET_BASE_DATA](state,data:any){
      const tempData = Object.assign({},data);
      delete tempData.success;
      Object.assign(state.baseData,tempData);
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
