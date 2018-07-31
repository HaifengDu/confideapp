<template>
    <div class="container">
        <div class="body">
            <div class="paytype">
                <div class="icon">
                    <img :src="getServiceTypeIcon()">
                </div>
                <div class="detail">
                    <div class="time">
                        <p>通话服务</p>
                        <p class="timecircle">时长{{timecircle}}分钟</p>
                    </div>
                    <div class="total">
                        <p>合计</p>
                        <p class="money">￥{{total}}</p>
                    </div>
                </div>
            </div>
            <mt-cell title="账户余额" class="cell-con">
                ￥{{balance}}<mt-switch style="margin-left:10px;" v-model="isUserBalance"></mt-switch>
            </mt-cell>
            <mt-field class="cell-con" label="倾诉备注" placeholder="输入对本次交易的说明（选填）" v-model="comment"></mt-field>
            
            <div class="lisence">
                <p>确认支付代表同意<span class="text">《千寻倾听平台倾诉者协议》</span></p>
                <p>还需支付<span class="total">￥{{getTotal()}}</span></p>
            </div>
            <div class="button-box">
                <mt-button size="normal" type="primary" @click.native="paymoney">确认支付</mt-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {EPriceType} from "@/enum/EPriceType";
import OrderService from "@/api/OrderService.ts";
import CalucateService from "@/helper/CalucateService.ts";
import { MessageBox } from 'mint-ui';
const orderService = OrderService.getInstance();
const calculate = CalucateService.Factory();
declare var WeixinJSBridge:any;
declare var wx:any;
@Component
export default class PlaceOrder extends Vue{
    private balance:number=0.15;
    private total:number = 9.9;
    private timecircle = 15;
    private isUserBalance = true;
    private comment = '';
    private serviceType = 2;   //服务类型，文字服务，还是通话服务
    private uprice = 0.66;  //TODO:单价
    private order:any = null;

    create(){
        //TODO:获取调起微信支付接口所需的签名等数据
    }

    getServiceTypeIcon(){
        return this.serviceType==EPriceType.EWord?'static/images/pay/chat.png':'static/images/pay/microphone.png'
    }

    getTotal(){
        return this.isUserBalance?calculate.numSub(this.total,this.balance):this.total;
    }

    paymoney(){
        this.toOrderDetail(1);
        /*
        *  1.先生成订单
           2.调用微信支付接口，同时弹出支付完成确认弹窗
           3.等待支付完成回调进行验证
           4.点支付完成向后台发送订单号，点稍后支付跳转到订单详情页面
        */
        const params = {
            lid:2,         //倾听者id
            payprice:this.getTotal(),  //待支付
            totalprice:this.total,   //合计
            balance:this.isUserBalance?this.balance:0,  //使用的余额
            source:1,
            servicetype:this.serviceType,      //服务类型
            payservicetime:this.timecircle,    //服务时长
            uprice:this.uprice,
            comment:this.comment
        }
        orderService.placeOrder(params).then((res:any)=>{
            const data = res.data;
            if(data.success){
                this.order = data.data.order;
                const jsParam = data.data.jsParam;
                //TODO:调用微信支付接口
                if (typeof WeixinJSBridge == "undefined"){
                    if( document.addEventListener ){
                        document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                    }else if ((<any>document).attachEvent){
                        (<any>document).attachEvent('WeixinJSBridgeReady', this.onBridgeReady); 
                        (<any>document).attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
                    }
                }else{
                    this.onBridgeReady(jsParam);
                }
            }else{
                this.$toast(res.data.message);
            }
        });
    }

    private onBridgeReady(params:any){
        wx.chooseWXPay({
            timestamp: params.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: params.nonceStr, // 支付签名随机串，不长于 32 位
            package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: params.paySign, // 支付签名
            success: function (res:any) {
            // 支付成功后的回调函数
                console.log(res);
            },
            fail:function(){
                console.log(arguments);
            },
            cancel:function(){
                console.log(arguments);
            }
        });
        // WeixinJSBridge.invoke(
        //     'getBrandWCPayRequest', params,
        //     (res:any)=>{
        //         if(res.err_msg == "get_brand_wcpay_request:ok" ){
        //             alert("get_brand_wcpay_request:ok");
        //             MessageBox.confirm('是否完成支付?','提示',{
        //                 showCancelButton:true,
        //                 closeOnClickModal:false,
        //                 confirmButtonText:'已完成支付',
        //                 cancelButtonText:'稍后支付'
        //             }).then((res:any) => {
        //                 this.toOrderDetail(this.order.id);
        //             },(cancel:any)=>{
        //                 this.toOrderDetail(this.order.id);
        //             });
        //         }else{
        //             MessageBox.alert('支付遇到问题','提示',{closeOnClickModal:false}).then((res:any) => {
        //                 this.toOrderDetail(this.order.id);
        //             });
        //         }
        // }); 
    }

    private toOrderDetail(id:number){
        this.$router.push({path:'/orderDetail',query:{orderid:String(id)}});
    }
}
</script>

<style lang="less" scoped>
    @import '../assets/style.less';
    @orange:rgb(239,146,55);
    *{
        .f-nm;
    }
    .container{
        .p-rl;
        padding-bottom:65px;
    }
    .custom-title{
        .p-rl;
        .v-middle(40px);
        background:rgb(247,247,247);
        color:@gray;
        text-align:left;
        padding-left:20px;
    }
    .body{
        .paytype{
            height:50px;
            text-align:left;
            padding:10px 20px;
            border-bottom:1px solid @gray;
            display:flex;
            .icon{
                .circle(40px);
                background:@mainColor;
                padding:5px;
                img{
                    width:40px;
                }
            }
            .detail{
                width:100%;
                position:relative;
                top:5px;
                .time,.total{
                    display:inline-block;
                    width:49%;
                    text-align:center;
                }
                .time{
                    .timecircle{
                        color:@gray;
                    }
                }
                .total{
                    .money{
                        color:@orange;
                    }
                }
            }
        }
        .lisence{
            position: fixed;
            bottom:71px;
            width:100%;
            max-width: 620px;
            text-align:center;
            .text{
                color:@mainColor;
            }
            .total{
                color:@orange;
            }
        }
    }
</style>
