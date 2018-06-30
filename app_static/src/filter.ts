import Vue from "vue";

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