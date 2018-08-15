<template>
    <div style="height:100%;">
        <div v-if="!isToBePaid" class="container con-bg">
            <div class="body">
                <div class="type">{{serviceType==1?'文字服务':'通话服务'}}</div>
                <div class="main">
                    <div class="icon-container">
                        <div class="icon">
                            <img :src="getServiceTypeIcon()">
                        </div>
                    </div>
                    <div class="detail">
                        <div class="status">
                            <p class="status-text">{{statuNamesDic[order.status-1]}}</p>
                            <p class="text">订单状态</p>
                        </div>
                        <div class="total">
                            <p class="money">￥{{total}}</p>
                            <p class="text">费用</p>
                        </div>
                    </div>
                    <mt-cell title="倾诉者" class="cell-con cell-prev">重新的开始</mt-cell>
                    <mt-cell v-if="serviceType==2" title="购买时长" class="cell-con cell-prev">15分钟</mt-cell>
                    <mt-cell v-if="serviceType==2" title="服务时长" class="cell-con cell-prev">15分钟</mt-cell>
                    <mt-cell v-if="serviceType==1" title="购买数量" class="cell-con cell-prev">15条</mt-cell>
                    <mt-cell v-if="serviceType==1" title="服务数量" class="cell-con cell-prev">15条</mt-cell>
                    <mt-cell title="服务时间" class="cell-con cell-prev">2018-06-26 21:19</mt-cell>
                    <mt-cell title="单价" class="cell-con cell-prev">￥0.00/分钟</mt-cell>
                    <mt-cell title="余额支付" class="cell-con cell-prev">-￥0.00</mt-cell>
                    <mt-cell title="订单号" class="cell-con cell-prev">1509006</mt-cell>
                    <mt-cell style="border-bottom:none;" title="有效期至" class="cell-con cell-prev">2018年06月29日 21:19</mt-cell>
                </div>
                <div v-if="order.status==6" class="main">
                    <div class="evaluate">
                        评价：非常满意，受益匪浅
                    </div>
                    <div class="reply">
                        <p v-if="!curOrder.reply" class="reply-box">
                            <el-input v-if="isReply" class="reply-input" v-model="replyMsg" placeholder="请输入回复内容"></el-input>
                            <mt-button class="button" size="small" @click.native="reply()">{{isReply?'发送':'回复'}}</mt-button>
                        </p>
                        <p v-if="curOrder.reply" class="cur-reply"><span class="reply" >倾听者回复：</span>{{curOrder.reply}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isToBePaid" class="container">
            <div class="body">
                <div class="header">
                    <p class="text status"><u class="clock"></u>等待付款</p>
                    <p class="text">本次{{serviceType==2?'通话':'文字'}}服务需支付9.62元</p>
                    <div class="icon">
                        <img :src="getServiceTypeIcon()">
                    </div>
                </div>
                <mt-cell title="订单类型" class="cell-con cell-prev">{{serviceType==2?'通话':'文字'}}服务</mt-cell>
                <mt-cell title="倾听者" class="cell-con cell-prev">重新的开始</mt-cell>
                <mt-cell title="订单号" class="cell-con cell-prev">1624151</mt-cell>
                <mt-cell title="购买时长" class="cell-con cell-prev">15分钟</mt-cell>
                <div class="total-account">
                    <p class="order-total">
                        <span class="title">订单总额</span>
                        <span class="money">￥9.9</span>
                    </p>
                    <p class="balance-total">
                        <span class="title">抵扣余额</span>
                        <span class="money">-￥0.28</span>
                    </p>
                </div>
                <div class="payment">
                    <span class="need-pay">需付款：</span><span style="color:rgb(239,146,55);">￥&nbsp;9.62</span>
                </div>
            </div>
            <div class="button-box">
                <mt-button size="normal" type="default" @click.native="cancelOrder()">取消订单</mt-button>
                <mt-button style="margin-left:20px;background:rgb(239,146,55);color:#fff;" size="normal" type="primary" @click.native="payOrder()">支付订单</mt-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {EPriceType} from "@/enum/EPriceType";
import {EOrderStatus} from "@/enum/EOrderStatus";
import {mapGetters} from "vuex";
import OrderService from "../../api/OrderService.ts";
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
import EvaluateService from "@/api/EvaluateService.ts";

const orderService = OrderService.getInstance();
const evaluateService = EvaluateService.getInstance();
declare var WeixinJSBridge:any;
declare var wx:any;
@Component({
    computed:{
        ...mapGetters({
            order:'order/order'
        })
    }
})
export default class OrderDetail extends Vue{
    private status = 1;
    private total = 9.9;
    private serviceType = 1;
    private statuNamesDic = ['待支付','已付款','服务中','待评论','已取消','已完成','已退款'];
    private isToBePaid = true;
    private isReply = false;
    private replyMsg = '';
    private curOrder:any = {reply:''};

    mounted() {
        if((<any>this).order){
            this.isToBePaid = (<any>this).order.status === EOrderStatus.Awaiting_Payment;        
            this.serviceType = (<any>this).order.serviceType;
            Object.assign(this.curOrder,(<any>this).order||{});
        }
    }

    getServiceTypeIcon(){
        return this.serviceType==EPriceType.EWord?'/static/images/pay/chat.png':'/static/images/pay/microphone.png'
    }

    cancelOrder(){
        //TODO:取消订单,然后跳回到上一页面
        console.log((<any>this).order.id);
        this.$router.back();
    }

    refound(){
        orderService.refound((<any>this).order.id).then((res:any)=>{
            if(res.data.success){
                this.$toast(res.data.message);
                this.$router.back();
            }else{
                MessageBox.alert(res.data.message,'提示',{closeOnClickModal:false});
            }
        },(err:any)=>{
            MessageBox.alert('网络错误，请稍后重试','提示',{closeOnClickModal:false});
        });
    }

    payOrder(){
        // if (typeof WeixinJSBridge == "undefined"){
        //     if( document.addEventListener ){
        //         document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        //     }else if ((<any>document).attachEvent){
        //         (<any>document).attachEvent('WeixinJSBridgeReady', this.onBridgeReady); 
        //         (<any>document).attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        //     }
        // }else{
        //     this.onBridgeReady(jsParam);
        // }
        orderService.pay((<any>this).order.id).then((res:any)=>{
            //TODO:支付成功，跳转到聊天页面？
            console.log(res);
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
                MessageBox.confirm('是否完成支付?','提示',{
                    showCancelButton:true,
                    closeOnClickModal:false,
                    confirmButtonText:'已完成支付',
                    cancelButtonText:'稍后支付'
                }).then((res:any) => {
                    this.toOrderDetail(this.order.id);
                },(cancel:any)=>{
                    this.toOrderDetail(this.order.id);
                });
            },
            fail:function(){
                console.log(arguments);
                MessageBox.alert('支付遇到问题','提示',{closeOnClickModal:false}).then((res:any) => {
                    this.toOrderDetail(this.order.id);
                });
            },
            cancel:function(){
                //TODO:取消支付需要做什么
                console.log(arguments);
            }
        });
    }

    reply(){
        if(this.isReply){
            if(!this.replyMsg){
                this.$toast('回复内容不能为空');
                return;
            }
            // evaluateService.replyEva({eid:this.curOrder.id,message:this.replyMsg}).then((res:any)=>{
            //     if(res.data.success){
            //         this.curOrder.reply = this.replyMsg;
            //     }
            // });
            this.curOrder.reply = this.replyMsg;
            console.log(this.curOrder);
        }else{
            this.isReply = true;
        }
    }

}
</script>

<style lang="less" scoped>
    @import '../../assets/style.less';
    @orange:rgb(239,146,55);
    @bgColor:rgb(238,238,238);
    .con-bg{
        background:@bgColor;
    }
    *{
        .f-nm;
    }
    .container{
        height:100%;
        .p-rl;
    }
    .body{
        .type{
            padding:20px 20px 40px 20px;
            color:rgb(115,115,115);
        }
        .main{
            margin:0 10px;
            padding:20px;
            border-radius:5px;
            background:#fff;
            .p-rl;
            .icon-container{
                .circle(50px);
                padding:5px;
                background:@bgColor;
                .p-ab;
                left:50%;
                top:-25px;
                transform:translateX(-50%);
                z-index:10;
                .icon{
                    .circle(40px);
                    background:@mainColor;
                    padding:5px;
                    img{
                        width:40px;
                    }
                }
            }
            
            .detail{
                width:100%;
                position:relative;
                top:5px;
                padding-bottom:30px;
                .status,.total{
                    display:inline-block;
                    width:49%;
                    box-sizing: border-box;
                    .text{
                        color:@gray;
                    }
                }
                .status{
                    padding-left:40px;
                    text-align:left;
                    .status-text{
                        color:@orange;
                    }
                }
                .total{
                    padding-right:40px;
                    text-align:right;
                    .money{
                        color:@orange;
                    }
                }
            }
        }
        .header{
            padding:20px 20px 20px 30px;
            background:@mainColor;
            .p-rl;
            .text{
                text-align:left;
                color:#fff;
            }
            .status{
                .f-lg;
                padding-bottom:5px;
            }
            .icon{
                width:60px;
                height:60px;
                .p-ab;
                right:40px;
                top:14px;
                img{
                    width:100%;
                    height:100%;
                }
            }
            .clock{
                display:inline-block;
                width:20px;
                height:20px;
                .p-rl;
                top:3px;
                margin-right:5px;
                background-image: url(../../../static/images/pay/clock.png);  
                background-repeat: no-repeat;  
                background-size: 100% 100%;
            }
        }
        .total-account{
            padding:10px 20px;
            border-bottom:1px solid rgb(215,215,215);
            .order-total,.balance-total{
                .title,.money{
                    display:inline-block;
                    width:49%;
                    box-sizing:border-box;
                    color:#888;
                }
                .title{
                    text-align:left;
                }
                .money{
                    text-align:right;
                }
            }
        }
        .payment{
            padding:10px 20px;
            .f-lg;
            text-align:right;
            .need-pay{
                color:#888;
            }
        }
        .evaluate{
            text-align:left;
            margin-bottom:10px;
            .t-ellipsis(3);
        }
        .reply{
            .reply-box{
                display:flex;
                justify-content: flex-end;
                .reply-input{
                    margin-right:10px;
                }
                
                .button{
                    padding:0 10px;
                    height:24px;
                    width:60px;
                }
            }
            .cur-reply{
                text-align: left;
                .t-ellipsis(3);
                .reply{
                    color:@mainColor;
                }
            }
        }
        
    }
</style>
