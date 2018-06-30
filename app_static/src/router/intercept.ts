import Router from "vue-router";
import store from "../store";

export function interceptRouter(router:Router):Router {
    router.beforeEach((to,form,next)=> {
        // 拦截点事情
        if (!to.matched.some(r => r.meta.noRequireAuth)) {
            if(store.getters.user&&store.getters.user.id){
                console.log(store.getters.user);
                next();
            }else{
                next({
                    path:"/login"
                });
            }
        }else{
            next();
        }
    });
    return router;
}