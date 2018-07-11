<template>
    <div class="container">
        <div class="body">
            <div class="balance">
                <div class="title">账户余额（元）</div>
                <div class="num">1999</div>
                <div class="charge">
                    <mt-button size="normal" type="primary" class="charge-btn" @click.native="toCharge">充值</mt-button>
                </div>
            </div>
            <div class="divider"></div>
            <mt-cell title="推广设置" is-link class="cell-con" @click.native="toSetAdvert"></mt-cell>
            <mt-cell title="推广记录" is-link class="cell-con" @click.native="toAdvRecords"></mt-cell>
            <div class="reminder">
                <p>1、推广位置将出现在首页及您选择的擅长话题分类下。</p>
                <p>2、若接单状态为休息中或通话中，推广位将不在首页展示，此时不扣取推广费。</p>
            </div>
        </div>
        <div class="button-box">
            <mt-button size="normal" type="primary" @click.native="toAdvertise">开始推广</mt-button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

@Component({
    
})
export default class MyAdvert extends Vue{
    
    toCharge(){
        console.log('to charge...');
    }

    toSetAdvert(){
        //TODO:推广设置
        this.$router.push('/advertSetting');
    }

    toAdvRecords(){
        //TODO:去查看推广记录
    }

    toAdvertise(){
        console.log('to advertise');
    }
}
</script>

<style lang="less" scoped>
    @import '../../assets/style.less';
    *{
        .f-nm;
    }
    .container{
        .p-rl;
    }
    .divider{
        height:10px;
        background:#eee;
    }
    .body{
        .balance{
            .p-rl;
            padding:30px 20px;
            text-align:left;
            .title{
                color:rgb(144,144,144);
            }
            .num{
                .f-lg;
                font-weight: bold;
                margin-top:20px;
            }
            .charge{
                .p-ab;
                top:50%;
                right:20px;
                cursor: pointer;
                .charge-btn{
                    padding: 0 20px;
                    background:#f3c439!important;
                }
            }
        }
        .reminder{
            text-align:justify;
            color:rgb(181,181,181);
            padding:20px;
        }
    }
</style>
