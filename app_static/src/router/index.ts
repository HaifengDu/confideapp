import Vue from 'vue'
import Router from 'vue-router'
import Home from "@/page/Home.vue";
import My from "@/page/My.vue";
import ApplyListener from "@/page/ApplyListener.vue";
import BindPhone from "@/page/BindPhone.vue";
import BaseInfo from "@/page/BaseInfo.vue";
import UserInfo from "@/page/UserInfo.vue";
import ListenerSettings from "@/page/ListenerSettings.vue";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/home",
      name: "Home",
      component: Home
    },
    {
      path: "/my",
      name: "My",
      component: My
    },
    {
      path: "/apply",
      name: "Apply",
      component: ApplyListener
    },
    {
      path: "/bind",
      name: "Bind",
      component: BindPhone
    },
    {
      path: "/baseInfo",
      name: "BaseInfo",
      component: BaseInfo
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