<template>
    <div class="container">
        <div class="header">
            <h3 class="money-text">余额（元）</h3>
            <div class="money">0</div>
        </div>
        <div class="body">
            <div class="module-info">
                <div class="info">
                    <div @click="recharge">
                        <p class="count"><img class="icon" src="/static/images/userInfo/share.png"></p>
                        <p class="content">去充值</p>
                    </div>
                    <div class="income">
                        <p class="count"><img class="icon" src="/static/images/userInfo/share.png"></p>
                        <p class="content">收支明细</p>
                    </div>
                    <div>
                        <p class="count"><img class="icon" src="/static/images/userInfo/share.png"></p>
                        <p class="content">申请结算</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator'; 

@Component
export default class Wallet extends Vue {
    
    recharge(){
        this.$router.push('/recharge');
    }
}
</script>

<style lang="less" scoped>
    @import '../../assets/style.less';
    .container{
        height:100%;
        background:rgb(247,247,247);
        .header{
            height:200px;
            background:@mainColor;
            color:#fff;
            .money-text{
                font-size:20px;
                padding:50px 0 20px 0;
            }
            .money{
                font-size:18px;
            }
        }
        .module-info{
            background:#fff;
            .info{
                width:100%;
                display:flex;
                flex-direction: row;
                div{
                    flex-grow: 1;
                    padding:20px 0;
                    .count,.content{
                        padding:10px 0;
                    }
                    .count{
                        font-size:16px;
                        color:rgb(231,165,50);
                    }
                    .icon{
                        width:32px;
                    }   
                }
                .income{
                    border-left:1px solid #eee;
                    border-right:1px solid #eee;
                }
            }
        }
    }
</style>

