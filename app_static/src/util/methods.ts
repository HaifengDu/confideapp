export interface INoop{
    (...args:any[]):any;
}
export interface INoopPromise {
  (...args: any[]): Promise<any>;
}
export const noop:INoop = (...args:any[])=>{}
export const noopPromise: INoopPromise = (...args: any[]) => Promise.resolve<any>({});
export function createNonceStr() {
  return Math.random().toString(36).substr(2, 15);
};


export function getAge(date:Date)
{       
    let returnAge:number;
    const birthYear = date.getFullYear();
    const birthMonth = date.getMonth()+1;
    const birthDay = date.getDate();
    
    const d = new Date();
    const nowYear = d.getFullYear();
    const nowMonth = d.getMonth() + 1;
    const nowDay = d.getDate();
    
    if(nowYear == birthYear)
    {
        returnAge = 0;//同年 则为0岁
    }
    else
    {
        const ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0)
        {
            if(nowMonth == birthMonth)
            {
                const dayDiff = nowDay - birthDay;//日之差
                if(dayDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
            else
            {
                const monthDiff = nowMonth - birthMonth;//月之差
                if(monthDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
        }
        else
        {
            returnAge = 0;//返回-1 表示出生日期输入错误 晚于今天
        }
    }
    
    return returnAge;//返回周岁年龄
    
}

export function getAstro(month:number,day:number){
  const s="魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
  const arr=[20,19,21,21,21,22,23,23,23,23,22,22];
  return s.substr(month*2-(day<arr[month-1]?2:0),2);
}