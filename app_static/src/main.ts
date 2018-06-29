import Axios from "axios";
import "./util/axiosConfig";
import "./util/extend";
import "./util/filter";
import MyService from "./api/my";
import httpIntercept from "./util/httpIntercept";
import cacheWraperAxios from "./util/extendAxios";
httpIntercept(Axios);
cacheWraperAxios(Axios);
// MyService.getInstance()
//   .getUserInfobyWXid("oRtVK06i1JN_GkUA5NPk7pXzOJ3s")
//   .then(res => {
//     alert(JSON.stringify(res.data));
//   });
// function GetRequest() {
//   var url = location.search; //获取url中"?"符后的字串
//   var theRequest:any = new Object();
//   if (url.indexOf("?") != -1) {
//       var str = url.substr(1);
//       const strs = str.split("&");
//       for (var i = 0; i < strs.length; i++) {
//           theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
//       }
//   }
//   return theRequest;
// }
// var query = GetRequest();
// if (!query.code) {
//   var originUrl = encodeURIComponent("http://qxqt.applinzi.com/");
//   location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3e8733cd66f81abd&redirect_uri=" + originUrl + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
// }else{
//   MyService.getInstance().getUserInfo(query.code).then(res=>{
//     alert(JSON.stringify(res.data));
//   })
// }
