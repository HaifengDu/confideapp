import _ = require("lodash");

export function rankRandom(ranks:number[]){
    if(ranks.filter(item=>item>=100).length){
        return _.noop;
    }
    return function(count:number){
        const randomArr =Array(count).fill(null).map(item=>parseInt((Math.random()*100).toString()));
        const rankObj:{[index:number]:number} = {};
        const sorkRanks = ranks.sort();
        for(let i=0;i<=sorkRanks.length;i++){
            let current = sorkRanks[i];
            if(i===sorkRanks.length){
                rankObj[100] = randomArr.filter(item=>item>=current&&item<100).length;
                continue;
            }
            if(i===0){
                rankObj[current] = randomArr.filter(item=>item>=0&&item<current).length;
                continue;
            }
            rankObj[sorkRanks[i]] = randomArr.filter(item=>item>=sorkRanks[i-1]&&item<current).length;
        }
        return rankObj;
    }
}