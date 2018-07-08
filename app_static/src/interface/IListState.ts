export interface IListState{
    searchConds:{
        topic?:number,
        price?:number|{min:number,max:number},
        sex?:number,
        family?:number,
        auth?:number,
        edu?:number,
        job?:number,
        age?:number|[number,number],
        area?:number|string
    }
}
export default IListState;