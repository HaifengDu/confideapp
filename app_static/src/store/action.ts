import {Action} from 'vuex';
import { IRootState } from '../interface/IRootState';
import My from '../api/UserService';
import mutation_type from './mutation_type';
import { UrlHelper } from '../helper/UrlWrapper';
import ErrorMsg from '../model/ErrorMsg';
const myService = My.getInstance();

export const getUserInfo:Action<IRootState,IRootState> = ({commit},WXid:string)=>{
    return myService.getUserInfobyWXid(WXid).then(res => {
        commit(mutation_type.UPDATE_USER, res.data);
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