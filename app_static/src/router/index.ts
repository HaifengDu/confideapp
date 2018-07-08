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
import UserInfo from "@/page/userInfo/UserInfo.vue";
import ListenerSettings from "@/page/settings/ListenerSettings.vue";
import MyTags from "@/page/settings/MyTags.vue";
import OtherInfo from "@/page/settings/OtherInfo.vue";
import TextService from "@/page/settings/TextService.vue";
import SearchFilter from "@/page/SearchFilter.vue";
import CallService from "@/page/settings/CallService.vue";
import SearchResult from "@/page/SearchResult.vue";
import PersonalInfo from "@/page/settings/PersonalInfo.vue";

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
    },{
      path:"/searchFilter",
      name:"SearchFilter",
      component:SearchFilter
    },
    {
      path:"/searchResult",
      name:"SearchResult",
      component:SearchResult
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
    },
    {
      path:"/myTags",
      name:"MyTags",
      component:MyTags
    },{
      path:"/otherInfo",
      name:"OtherInfo",
      component:OtherInfo
    },{
      path:"/textService",
      name:"TextService",
      component:TextService
    },{
      path:"/callService",
      name:"CallService",
      component:CallService
    },{
      path:"/personalInfo",
      name:"PersonalInfo",
      component:PersonalInfo
    }
  ]
});

// interceptRouter(router);
export default router;
