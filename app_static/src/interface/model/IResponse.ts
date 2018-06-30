export interface IResponse<T extends any>{
    success:boolean,
    data?:T,
    message?:string;
}
export default IResponse;