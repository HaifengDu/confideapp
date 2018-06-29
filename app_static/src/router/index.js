import Vue from 'vue'
import Router from 'vue-router'
import Index from "@/page/Index.vue";
import Home from "@/page/Home.vue";
import My from "@/page/My.vue";
import ApplyListener from "@/page/ApplyListener.vue";
import BindPhone from "@/page/BindPhone.vue";
import BaseInfo from "@/page/BaseInfo.vue";
import Exprience from "@/page/Exprience.vue";
import Tags from "@/page/Tags.vue";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/tab",
      component: Index,
      children: [
        {
          path: "home",
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
    }
  ]
});
