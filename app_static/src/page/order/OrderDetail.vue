<template>
    <div style="height:100%;">
        <div v-if="!isToBePaid" class="container con-bg">
            <div class="body">
                <div class="type">{{serviceName}}</div>
                <div class="main">
                    <div class="icon-container">
                        <div class="icon">
                            <img :src="getServiceTypeIcon()">
                        </div>
                    </div>
                    <div class="detail">
                        <div class="status">
                            <p class="status-text">{{statuNamesDic[status]}}</p>
                            <p class="text">订单状态</p>
                        </div>
                        <div class="total">
                            <p class="money">￥{{total}}</p>
                            <p class="text">费用</p>
                        </div>
                    </div>
                    <mt-cell title="倾听者" class="cell-con cell-prev">重新的开始</mt-cell>
                    <mt-cell title="购买时长" class="cell-con cell-prev">15分钟</mt-cell>
                    <mt-cell title="服务时长" class="cell-con cell-prev">15分钟</mt-cell>
                    <mt-cell title="付款时间" class="cell-con cell-prev">2018-06-26 21:15</mt-cell>
                    <mt-cell title="网络通话时长" class="cell-con cell-prev">00:15:00</mt-cell>
                    <mt-cell title="优质专线时长" class="cell-con cell-prev">00:00:00</mt-cell>
                    <mt-cell title="订单号" class="cell-con cell-prev">1509006</mt-cell>
                    <mt-cell style="border-bottom:none;" title="有效期至" class="cell-con cell-prev">2018年06月29日 21:19</mt-cell>
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
                <mt-button size="normal" type="default" @click.native="cancelOrder">取消订单</mt-button>
                <mt-button style="margin-left:20px;background:rgb(239,146,55);color:#fff;" size="normal" type="primary" @click.native="payOrder">支付订单</mt-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {EPriceType} from "@/enum/EPriceType";
@Component
export default class OrderDetail extends Vue{
    private serviceName = '通话服务';
    private status = 1;
    private total = 9.9;
    private serviceType = 1;
    private statuNamesDic = ['待支付','已结束 '];
    private isToBePaid = true;

    mounted() {
        //TODO:根据订单单号获取订单支付状态，更具已支付还是未支付，展示对应的订单详情页面
        const orderid = this.$route.query.orderid;
        console.log(orderid);
        this.isToBePaid = true;        
    }

    getServiceTypeIcon(){
        return this.serviceType==EPriceType.EWord?'static/images/pay/chat.png':'static/images/pay/microphone.png'
    }

    cancelOrder(){
        //TODO:取消订单,然后跳回到上一页面
    }

    payOrder(){
        //TODO:支付订单
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
    }
</style>
