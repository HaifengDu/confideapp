import { interceptRouter } from './intercept';
import Vue from 'vue';
import Router from 'vue-router';
import Login from "@/page/Login.vue";
import Index from "@/page/Index.vue";
import Home from "@/page/Home.vue";
import My from "@/page/my/My.vue";
import List from "@/page/List.vue";
import Help from "@/page/help/SeekHelp.vue";
import HelpDetail from "@/page/help/HelpDetail.vue";
import HelpCreate from "@/page/help/HelpCreate.vue";
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
import Follow from "@/page/userInfo/Follow.vue";
import SearchPanel from "@/page/SearchPanel.vue";
import Chat from "@/page/Chat.vue";
import MyAdvert from "@/page/advert/MyAdvert.vue";
import AdvertSetting from "@/page/advert/AdvertSetting.vue";
import AdvertRecord from "@/page/advert/AdvertRecord.vue";
import PlaceOrder from "@/page/PlaceOrder.vue";
import OrderDetail from "@/page/order/OrderDetail.vue";
import OrderList from "@/page/order/OrderList.vue";
import EvaluationList from "@/page/evaluation/EvaluationList.vue";
import AddEvaluation from "@/page/evaluation/AddEvaluation.vue";
import Recharge from "@/page/Recharge.vue";
import Feedback from "@/page/Feedback.vue";
import Wallet from "@/page/wallet/Wallet.vue";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: "/login",
      component: Login,
      meta: {
        noRequireAuth: true
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
      path: "/searchFilter",
      name: "SearchFilter",
      component: SearchFilter
    },
    {
      path: "/searchResult",
      name: "SearchResult",
      component: SearchResult
    },
    {
      path: "/tag",
      name: "Tag",
      component: Tags
    },
    {
      path: "/userInfo/:uid",
      name: "UserInfo",
      component: UserInfo
    },
    {
      path: "/listenerSettings",
      name: "ListenerSettings",
      component: ListenerSettings
    },
    {
      path: "/myTags",
      name: "MyTags",
      component: MyTags
    },
    {
      path: "/otherInfo",
      name: "OtherInfo",
      component: OtherInfo
    },
    {
      path: "/textService",
      name: "TextService",
      component: TextService
    },
    {
      path: "/callService",
      name: "CallService",
      component: CallService
    },
    {
      path: "/personalInfo",
      name: "PersonalInfo",
      component: PersonalInfo
    },
    {
      path: "/list",
      name: "List",
      component: List
    },
    {
      path: "/follow",
      name: "Follow",
      component: Follow
    },
    {
      path: "/searchPanel",
      name: "SearchPanel",
      component: SearchPanel
    },
    {
      path: "/chat/:uid",
      name: "Chat",
      component: Chat
    },
    {
      path: "/myAdvert",
      name: "MyAdvert",
      component: MyAdvert
    },
    {
      path: "/advertSetting",
      name: "AdvertSetting",
      component: AdvertSetting
    },
    {
      path: "/advertRecord",
      name: "AdvertRecord",
      component: AdvertRecord
    },
    {
      path: "/placeOrder",
      name: "PlaceOrder",
      component: PlaceOrder
    },
    {
      path: "/orderDetail",
      name: "OrderDetail",
      component: OrderDetail
    },
    {
      path: "/orderList",
      name: "OrderList",
      component: OrderList
    },
    {
      path: "/evaluationList",
      name: "EvaluationList",
      component: EvaluationList
    },
    {
      path: "/addEvaluation/:id",
      name: "AddEvaluation",
      component: AddEvaluation
    },
    {
      path: "/help",
      name: "Help",
      component: Help
    },
    {
      path: "/helpDetail",
      name: "HelpDetail",
      component: HelpDetail
    },{
      path:"/helpCreate",
      name:"HelpCreate",
      component:HelpCreate
    },{
      path:"/recharge",
      name:"Recharge",
      component:Recharge
    },{
      path:"/feedback",
      name:"Feedback",
      component:Feedback
    },{
      path:"/wallet",
      name:"Wallet",
      component:Wallet
    }
  ]
});

// interceptRouter(router);
export default router;
