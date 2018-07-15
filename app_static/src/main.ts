import {launchSocket} from './socketLaunch';
import Axios from "axios";
import './util/axiosConfig';
import './util/extend';
import './filter';
import './directive';
import httpIntercept from "./util/httpIntercept";
import cacheWraperAxios from "./util/extendAxios";
httpIntercept(Axios);
cacheWraperAxios(Axios);
launchSocket(1111)({
    connect:function(){
        console.log("connect");
    },
    connection:function(){
        console.log("conncetion");
    },
    error:function(){
        console.log("error");
    },
    connect_error:function(){
        console.log("connect_error");
    },
    connect_timeout:function(){
        console.log("connect_timeout");
    }
});
declare var wx:any;
wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wx3e8733cd66f81abd', // 必填，公众号的唯一标识
    timestamp:1531490039577 , // 必填，生成签名的时间戳
    nonceStr: 'KgzteC8WIlg5bZnK', // 必填，生成签名的随机串
    signature: '968082dfd3c540a03cf9f9eda9e5030be189b338',// 必填，签名
    jsApiList: ['onMenuShareAppMessage','startRecord', 'stopRecord','translateVoice','downloadVoice','uploadVoice','playVoice'] // 必填，需要使用的JS接口列表
});
wx.error(function(res:any){
    console.log(res);
    alert(JSON.stringify(res));
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
});
wx.ready(function(){
    console.log("ready");
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    // wx.onMenuShareQQ({
    //     title: '测试一下', // 分享标题
    //     desc: '测试一下', // 分享描述
    //     link: 'http://www.confide.com:8080/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //     imgUrl: '', // 分享图标
    //     //type: '', // 分享类型,music、video或link，不填默认为link
    //     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    //     success: function () {
    //     // 用户点击了分享后执行的回调函数
    //     },
    //     error:function(){
    //         debugger;
    //     }
    // });
    // wx.startRecord();
    // setTimeout(function(){
    //     wx.stopRecord({
    //         success: function (res:any) {
    //             var localId = res.localId;
    //             console.log(localId);
    //             (<any>window).testautoid = localId;
    //             wx.playVoice({
    //                 localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
    //             });
    //         }
    //     });
    // },5000);
});

