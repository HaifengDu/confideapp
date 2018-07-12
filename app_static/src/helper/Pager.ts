
export interface PagerData {
    page: number,
    start: number,
    limit: number
}
export default class Pager {
    constructor(private page: number = 1, private start: number = 0, private limit: number = 10) {

    }
    public getPage(): PagerData {
        return {
            page: this.page,
            start: this.start,
            limit: this.limit
        };
    }

    /**
     * 移动分页下标
     */
    public setNext(): Pager {
        this.page++;
        this.start = this.limit * (this.page - 1);
        return this;
    }

    /**
     * 设置分页的size
     * @param limit 
     */
    public setLimit(limit: number): Pager  {
        this.limit = limit;
        return this;
    }

    /**
     * 重置分页所有数据
     */
    public clear(): Pager  {
        this.resetStart();
        this.limit = 10;
        return this;
    }

    /**
     * 将分页重置到开始位置
     */
    public resetStart():Pager{
        this.page =1;
        this.start=0;
        return this;
    }

    /**
     * 根据当前位置计算开始位置 
     */
    public setStart(index:number):Pager{
        this.start = index;
        this.page = index/this.limit+1;
        return this;
    }

    /**
     * 根据index获取limit
     */
    public getLimit(index:number):number{
        let tempIndex =  index+1;
        let percent = parseInt((tempIndex/this.limit).toString());
        if(tempIndex%this.limit===0){
            return percent*this.limit;
        }
        return (percent+1)*this.limit;
    }
}