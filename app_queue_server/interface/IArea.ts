export interface IArea{
    name:string,
    child:IAreaConfig|{[index:string]:string}
}

export interface IAreaConfig{
    [code:string]:IArea
}