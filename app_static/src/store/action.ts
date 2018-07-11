import {Action} from 'vuex';
import { IRootState } from '../interface/IRootState';
import My from '../api/UserService';
import mutation_type from './mutation_type';
import { UrlHelper } from '../helper/UrlWrapper';
import ErrorMsg from '../model/ErrorMsg';
import BaseDataService from '../api/BaseDataService';
const myService = My.getInstance();
const baseDataService = BaseDataService.getInstance()

export const getUserInfo:Action<IRootState,IRootState> = ({commit},WXid:string)=>{
    return myService.getUserInfobyWXid(WXid).then(res => {
        const data = res.data;
        if(data.success){
            commit(mutation_type.UPDATE_USER, data.data);
        }
        return res;
    });
}
export const bindUser:Action<IRootState,IRootState> = ({commit},code:string)=>{
    return myService.getUserInfo(code).then(res=>{
        commit(mutation_type.UPDATE_USER, res.data);
        return res;
    });
}
export const checkCode:Action<IRootState,IRootState> = ({dispatch,commit})=>{
    const code = UrlHelper.getQueryString(location.href,"code");
    if(!code){
        return Promise.reject(new ErrorMsg(false,"code不能为空"));
    }
    return dispatch("bindUser",code);
}
export const getAllBaseData:Action<IRootState,IRootState> = ({dispatch,commit})=>{
    baseDataService.getAll().then(res=>{
        if(res.data.success){
            commit(mutation_type.SET_BASE_DATA,res.data);
        }
    });   
}

export const setBaseInfo:Action<IRootState,IRootState> = ({dispatch,commit},payload)=>{
    return myService.updateUserInfo(payload).then(res=>{
        const data = res.data;
        if(data.success){
            commit(mutation_type.UPDATE_BASEINFO,payload);
        }
        return res;
    });
}

export const setPrices: Action<IRootState, IRootState> = (
    { dispatch, commit },
    prices
  ) => {
    commit(mutation_type.UPDATE_PRICES, prices);
};

export const setListenerData: Action<IRootState, IRootState> = (
    { dispatch, commit },
    data
  ) => {
    commit(mutation_type.SET_LISTENER_DATA, data);
};

export const updateOther:Action<IRootState,IRootState> = ({dispatch,commit},payload)=>{
    return myService.updateListenerOther(payload).then(res=>{
        const data = res.data;
        if(data.success){
            commit(mutation_type.UPDATE_OTHER,payload);
        }
        return res;
    });
}