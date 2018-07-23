<template>
    <div>
        <div class="container con-bg">
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
        <div class="container">
            <div class="body">
                <div class="header">
                    <p>等待付款</p>
                </div>
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
    private serviceType = 2;
    private statuNamesDic = ['待支付','已结束 '];
    private isToBePaid = false;

    create(){
        //TODO:根据订单单号获取订单支付状态，更具已支付还是未支付，展示对应的订单详情页面
        const orderid = this.$route.query.orderid;
        console.log(orderid);
        this.isToBePaid = true;
    }

    getServiceTypeIcon(){
        return this.serviceType==EPriceType.EWord?'static/images/pay/chat.png':'static/images/pay/microphone.png'
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
    }
</style>
