export interface IUser{
    id?:number,
    weixinid?:string,
    [index:string]:string|number|undefined
}
export default IUser;