import Vue from "vue";
import { getAge, getAstro } from "./util/methods";

Vue.filter("datefilter", (value:any)=> {
    // 返回处理后的值
    let tempDate:any = new Date(value);
    return (<any>tempDate).format("yyyy-MM-dd hh:mm:ss");
});
Vue.filter("jsonfilter", (value:any)=> {
    // 返回处理后的值
    if(value&&value.split) {
        return value;
    }
    return JSON.stringify(value||{});
});
Vue.filter("agefilter", (birthday:string) => {
    if(!birthday){
        return 0;
    }
    const date = new Date(birthday);
    return getAge(date);
});
Vue.filter("astrofilter", (birthday:string) => {
    if(!birthday){
        return "";
    }
    const date = new Date(birthday);
    return getAstro(date.getMonth()+1,date.getDate());
})

