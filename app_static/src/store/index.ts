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
import { IListener } from '../interface/model/IListener';

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
      state.user = user;
    },
    [MType.SET_BASE_DATA](state,data:any){
      const tempData = Object.assign({},data);
      delete tempData.success;
      Object.assign(state.baseData,tempData);
    },
    [MType.UPDATE_PRICES](state,prices:any){
      prices.forEach((price:any)=>{
        if(state.user.pricesettings){
          let oriPrice = state.user.pricesettings.find(item=>item.id==price.id);
          Object.assign(oriPrice,price);
        }
      });
    },
    [MType.UPDATE_BASEINFO](state,baseinfo){
      const user = state.user;
      user.nickname =baseinfo.nickname;
      user.address = baseinfo.address;
      user.birthday = baseinfo.birthday;
      user.sex = baseinfo.sex;
      user.resume = baseinfo.resume;
    },
    [MType.UPDATE_OTHER](state,data){
      const user = state.user;
      const listener:IListener = (<any>user).listener;
      if(listener){
        if(data.job){
          listener.job = parseInt(data.job);
        }
        if(data.family){
          listener.family = parseInt(data.family);
        }
        if(data.edu){
          listener.edu = parseInt(data.edu);
        }
      }
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
