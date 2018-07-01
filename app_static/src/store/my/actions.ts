import { IMyState } from "../../interface/IMyState";
import IRootState from "../../interface/IRootState";
import { Action } from "vuex";
import My from "../../api/UserService";
import mutation_type from "./mutation_type";
import ErrorMsg from "../../model/ErrorMsg";
import { IListener } from "../../interface/model/IListener";
import { IUser } from "../../interface/model/IUser";
import ListenerService from "../../api/ListenerService";

const myService = My.getInstance();
const listenerService = ListenerService.getInstance();
export const getCode: Action<IMyState, IRootState> = (
  { dispatch, commit },
  phone
) => {
  return myService.getCode(phone);
};
export const bindPhone: Action<IMyState, IRootState> = (
  { dispatch, commit },
  {code,phone}
) => {
  return myService.bindPhone(code,phone).then(res => {
    return res;
  });
};
export const updatePhone: Action<IMyState, IRootState> = (
  { dispatch, commit },
  phone
) => {
  commit(mutation_type.UPDATE_PHONE, phone);
};
export const setBaseInfo: Action<IMyState, IRootState> = (
  {dispatch,commit},
  baseInfo
) => {
  commit(mutation_type.UPDATE_BASE_INFO, baseInfo);
};
export const setExprience: Action<IMyState, IRootState> = (
  { dispatch, commit },
  exprience
) => {
  commit(mutation_type.UPDATE_EXPRIENCE, exprience);
};

export const submit:Action<IMyState,IRootState> = ({dispatch,commit,state,rootState},payload)=>{
  const files = payload.files;
  const labelids = payload.labelids;
  const user = rootState.user;
  const baseInfo:any = state.baseInfo;
  const exprience:any = state.exprience;
  if(!labelids){
    return Promise.reject(new ErrorMsg(false,"标签不能为空"));
  }
  if(!baseInfo){
    return Promise.reject(new ErrorMsg(false,"基本信息不能为空"));
  }
  if(!exprience){
    return Promise.reject(new ErrorMsg(false,"经历不能为空"));
  }
  const listener:IListener = {
    uid:user.id,
    job:exprience.job,
    family:exprience.family,
    edu:exprience.edu,
    labelids:JSON.stringify(labelids),
  };

  const tempUser:IUser = {
    sex:baseInfo.sex,
    birthday:baseInfo.birthday,
    address:baseInfo.address,
    nickname:baseInfo.nickname,
    resume:baseInfo.resume,
  }

  listener.user = tempUser;
  return listenerService.applyListener(listener,files);
}