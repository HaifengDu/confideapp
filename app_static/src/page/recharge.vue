<template>
    <div class="container">
        <div class="body">
            <div class="main">
                <span class="tag" v-for="(tag,index) in moneyTags" :key="index" :class="{'active':tag.active}">
                    {{tag.money}}元
                </span>

            </div>
            <div class="lisence">
                <p>确认支付代表同意<span class="text">《千寻倾听钱包用户协议》</span></p>
                <p>还需支付<span class="total">￥{{money}}</span></p>
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

@Component
export default class Recharge extends Vue{
    private money = 0;
    private moneyTags:any = [
        {money:166,active:false},{money:366,active:false},{money:666,active:true},
        {money:1200,active:false},{money:3300,active:false},{money:6600,active:false},
        {money:8600,active:false},{money:16800,active:false},{money:16800,active:false}
    ]
}
</script>

<style lang="less" scoped>
    @import '../assets/style.less';
    @orange:rgb(239,146,55);
    .container{
        height:100%;
        background:rgb(247,247,247);
        .main{
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


