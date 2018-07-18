<template>
    <div class="container">
        <div class="body">
            <mt-cell title="服务方式" class="cell-con">
                <span>通话服务</span>
            </mt-cell>
            <mt-cell title="服务时长" class="cell-con">
                <span>15分钟</span>
            </mt-cell>
            <mt-cell title="费用合计" class="cell-con">
                <span>{{total}}元</span>
            </mt-cell>
            <mt-cell title="账户余额" class="cell-con">
                ￥{{balance}}<mt-switch style="margin-left:10px;" v-model="isUserBalance"></mt-switch>
            </mt-cell>
            <mt-cell title="支付方式" class="cell-con">
                <span>微信支付</span>
            </mt-cell>
            <mt-field class="cell-con" label="留言：" placeholder="输入对本次交易的说明（选填）" v-model="message"></mt-field>
            
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
    private isUserBalance = true;
    private message = '';

    getTotal(){
        return this.isUserBalance?this.total-this.balance:this.total;
    }

    paymoney(){
        //TODO:调用微信支付接口
        /*
        *  1.先生成订单
           2.获取签名
           3.调用微信支付接口，同时弹出支付完成确认弹窗
           4.等待支付完成回调进行验证
           5.点支付完成向后台发送订单号，点稍后支付跳转到订单详情页面
        */
    }
}
</script>

<style lang="less" scoped>
    @import '../assets/style.less';
    *{
        .f-nm;
    }
    .container{
        .p-rl;
        padding-bottom:65px;
    }
    .title{
        .p-rl;
        .v-middle(40px);
        background:rgb(247,247,247);
        color:rgb(173,173,173);
        text-align:left;
        padding-left:20px;
    }
    .body{
        .lisence{
            position: fixed;
            bottom:71px;
            width:100%;
            text-align:center;
            .text{
                color:@mainColor;
            }
            .total{
                color:rgb(239,146,55);
            }
        }
    }
</style>
