import { IMyState } from "../../interface/IMyState";
import IRootState from "../../interface/IRootState";
import { Action } from "vuex";
import My from "../../api/UserService";
import mutation_type from "./mutation_type";
import ErrorMsg from "../model/ErrorMsg";
const myService = My.getInstance();

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

