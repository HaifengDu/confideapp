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
          component: Home,
          meta: {
            title: "千寻倾听"
          }
        },
        {
          path: "my",
          name: "My",
          component: My,
          meta: {
            title: "我的"
          }
        },
        {
          path: "/help",
          name: "Help",
          component: Help,
          meta: {
            title: "求助"
          }
        }
      ]
    },
    {
      path: "/apply",
      name: "Apply",
      component: ApplyListener,
      meta: {
        title: "千寻倾听者"
      }
    },
    {
      path: "/bindPhone",
      name: "BindPhone",
      component: BindPhone,
      meta: {
        title: "绑定手机"
      }
    },
    {
      path: "/baseInfo",
      name: "BaseInfo",
      component: BaseInfo,
      meta: {
        title: "基本信息"
      }
    },
    {
      path: "/exprience",
      name: "Exprience",
      component: Exprience,
      meta: {
        title: "个人经历"
      }
    },
    {
      path: "/searchFilter",
      name: "SearchFilter",
      component: SearchFilter,
      meta: {
        title: "千寻倾听"
      }
    },
    {
      path: "/searchResult",
      name: "SearchResult",
      component: SearchResult,
      meta: {
        title: "千寻倾听"
      }
    },
    {
      path: "/tag",
      name: "Tag",
      component: Tags,
      meta: {
        title: "我的标签"
      }
    },
    {
      path: "/userInfo/:uid",
      name: "UserInfo",
      component: UserInfo,
      meta: {
        title: "千寻倾听者"
      }
    },
    {
      path: "/listenerSettings",
      name: "ListenerSettings",
      component: ListenerSettings,
      meta: {
        title: "倾听者设置"
      }
    },
    {
      path: "/myTags",
      name: "MyTags",
      component: MyTags,
      meta: {
        title: "我的标签"
      }
    },
    {
      path: "/otherInfo",
      name: "OtherInfo",
      component: OtherInfo,
      meta: {
        title: "基本信息"
      }
    },
    {
      path: "/textService",
      name: "TextService",
      component: TextService,
      meta: {
        title: "文字服务"
      }
    },
    {
      path: "/callService",
      name: "CallService",
      component: CallService,
      meta: {
        title: "通话服务"
      }
    },
    {
      path: "/personalInfo",
      name: "PersonalInfo",
      component: PersonalInfo,
      meta: {
        title: "个人信息"
      }
    },
    {
      path: "/list",
      name: "List",
      component: List,
      meta: {
        title: "千寻倾听"
      }
    },
    {
      path: "/follow",
      name: "Follow",
      component: Follow,
      meta: {
        title: "关注"
      }
    },
    {
      path: "/searchPanel",
      name: "SearchPanel",
      component: SearchPanel,
      meta: {
        title: "千寻倾听"
      }
    },
    {
      path: "/chat/:uid",
      name: "Chat",
      component: Chat,
      meta: {
        title: "千寻倾听"
      }
    },
    {
      path: "/myAdvert",
      name: "MyAdvert",
      component: MyAdvert,
      meta: {
        title: "推广"
      }
    },
    {
      path: "/advertSetting",
      name: "AdvertSetting",
      component: AdvertSetting,
      meta: {
        title: "推广设置"
      }
    },
    {
      path: "/advertRecord",
      name: "AdvertRecord",
      component: AdvertRecord,
      meta: {
        title: "推广"
      }
    },
    {
      path: "/placeOrder",
      name: "PlaceOrder",
      component: PlaceOrder,
      meta: {
        title: "订单"
      }
    },
    {
      path: "/orderDetail",
      name: "OrderDetail",
      component: OrderDetail,
      meta: {
        title: "订单详情"
      }
    },
    {
      path: "/orderList",
      name: "OrderList",
      component: OrderList,
      meta: {
        title: "订单"
      }
    },
    {
      path: "/evaluationList",
      name: "EvaluationList",
      component: EvaluationList,
      meta: {
        title: "评论"
      }
    },
    {
      path: "/addEvaluation/:id",
      name: "AddEvaluation",
      component: AddEvaluation,
      meta: {
        title: "评论"
      }
    },
    {
      path: "/helpDetail",
      name: "HelpDetail",
      component: HelpDetail,
      meta: {
        title: "求助详情"
      }
    }
  ]
});

interceptRouter(router);
export default router;
