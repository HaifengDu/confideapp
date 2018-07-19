<template>
    <div class="container">
        <div class="body">
            <div class="paytype">
                <div class="icon">
                    <img src="static/images/pay/microphone.png">
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
            <mt-field class="cell-con" label="倾诉备注" placeholder="输入对本次交易的说明（选填）" v-model="message"></mt-field>
            
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

@Component({
    
})
export default class PlaceOrder extends Vue{
    private balance:number=0.15;
    private total:number = 9.9;
    private timecircle = 15;
    private isUserBalance = true;
    private message = '';

    create(){
        //TODO:获取调起微信支付接口所需的签名等数据
    }

    getTotal(){
        return this.isUserBalance?this.total-this.balance:this.total;
    }

    paymoney(){
        //TODO:调用微信支付接口
        /*
        *  1.先生成订单
           2.调用微信支付接口，同时弹出支付完成确认弹窗
           3.等待支付完成回调进行验证
           4.点支付完成向后台发送订单号，点稍后支付跳转到订单详情页面
        */
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
