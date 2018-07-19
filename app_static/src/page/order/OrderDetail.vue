<template>
    <div class="container">
        <div class="body">
            订单详情
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
@Component
export default class OrderDetail extends Vue{

    create(){
        //TODO:根据订单单号获取订单支付状态，更具已支付还是未支付，展示对应的订单详情页面
    }


}
</script>

<style lang="less" scoped>
    @import '../../assets/style.less';
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
        
    }
</style>
