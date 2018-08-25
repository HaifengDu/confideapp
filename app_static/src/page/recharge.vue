<template>
    <div class="container">
        <div class="body">
            <div class="main">
                <span class="tag" @click="selMoney(tag)" v-for="(tag,index) in moneyTags" :key="index" :class="{'active':tag.active}">
                    {{tag.money}}元
                </span>
                <input 
                    type="number" 
                    @focus="focus" 
                    @blur="blur"
                    @input="cusMoneyChange"
                    v-model="cusMoney" 
                    class="tag custom" 
                    :class="{'active':isCusMoney}" 
                    placeholder="其他金额"/>
            </div>
            <div class="lisence">
                <p>确认支付代表同意<span class="text">《千寻倾听钱包用户协议》</span></p>
                <p>还需支付<span class="total">￥{{money}}</span></p>
            </div>
            <div class="button-box">
                <mt-button size="normal" type="primary" @click.native="rechargeMoney">确认充值</mt-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator'; 
import _ from "lodash";

@Component
export default class Recharge extends Vue{
    private money = 666;
    private cusMoney = '';
    private isCusMoney = false;
    private moneyTags:any = [
        {money:166,active:false},{money:366,active:false},{money:666,active:true},
        {money:1200,active:false},{money:3300,active:false},{money:6600,active:false},
        {money:8600,active:false},{money:16800,active:false}
    ];

    selMoney(item:any){
        _.forEach(this.moneyTags,(money:any)=>{
            money.active = item.money==money.money;
        });
        this.money = item.money;
        this.cusMoney = '';
    }

    cusMoneyChange(){
        this.money = (<any>this.cusMoney);
    }

    focus(){
        this.isCusMoney = true;
        _.forEach(this.moneyTags,(money:any)=>{
            money.active = false;
        });
        this.money = 0;
    }

    blur(){
        this.isCusMoney = false;
    }

    rechargeMoney(){
        if(!this.money){
            this.$toast('充值金额不能为空');
            return;
        }
        if(this.money < 1){
            this.$toast('充值金额需大于 1');
            return;
        }
        //TODO:调用充值接口及微信支付接口充值
    }
}
</script>

<style lang="less" scoped>
    @import '../assets/style.less';
    @orange:rgb(239,146,55);
    .container{
        height:100%;
        background:rgb(247,247,247);
        .main{
            font-size:0px;
            padding:30px 20px 20px 20px;
            text-align:center;
            .tag{
                display:inline-block;
                width:100px;
                height:54px;
                text-align: center;
                line-height: 54px;
                border:1px solid rgb(231,231,231);
                border-radius:3px;
                background:#fff;
                margin-right:10px;
                margin-top:10px;
            }
            .tag.custom{
                width:70px;
                text-align:left;
                padding:0 15px;
            }
            .tag.active{
                color:@mainColor;
                border-color:@mainColor;
            }
        }
        .body{
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
    }
</style>


