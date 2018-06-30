import { interceptRouter } from './intercept';
import Vue from 'vue';
import Router from 'vue-router';
import Login from "@/page/Login.vue";
import Index from "@/page/Index.vue";
import Home from "@/page/Home.vue";
import My from "@/page/my/My.vue";
import ApplyListener from "@/page/ApplyListener.vue";
import BindPhone from "@/page/my/BindPhone.vue";
import BaseInfo from "@/page/my/BaseInfo.vue";
import Exprience from "@/page/my/Exprience.vue";
import Tags from "@/page/my/Tags.vue";
import UserInfo from "@/page/UserInfo.vue";
import ListenerSettings from "@/page/ListenerSettings.vue";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:"/login",
      component:Login,
      meta:{
        noRequireAuth:true
      }
    },
    {
      path: "/",
      component: Index,
      children: [
        {
          path: "/",
          name: "Home",
          component: Home
        },
        {
          path: "my",
          name: "My",
          component: My
        }
      ]
    },
    {
      path: "/apply",
      name: "Apply",
      component: ApplyListener
    },
    {
      path: "/bindPhone",
      name: "BindPhone",
      component: BindPhone
    },
    {
      path: "/baseInfo",
      name: "BaseInfo",
      component: BaseInfo
    },
    {
      path: "/exprience",
      name: "Exprience",
      component: Exprience
    },
    {
      path: "/tag",
      name: "Tag",
      component: Tags
    },
    {
      path: "/userInfo",
      name: "UserInfo",
      component: UserInfo
    },
    {
      path: "/listenerSettings",
      name: "ListenerSettings",
      component: ListenerSettings
    }
  ]
});

interceptRouter(router);
export default router;