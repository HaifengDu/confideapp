<template>
    <div class="container">
        <div class="header">
          倾听者设置
        </div>
        <div class="body">
            <div class="title">
                个人设置
            </div>
            <div @click="toPage('basic')">
                <mt-cell title="基本资料" is-link class="cell-con"></mt-cell>
            </div>
            <div @click="toPage('mytags')" class="cell-box">
                <mt-cell title="我的标签" is-link class="cell-con">
                    <!-- <span class="cell-text">情感挽回,婚姻关系,人际关系,个人成长,情绪疏导</span> -->
                </mt-cell>
            </div>
            <div @click="toPage('info')" class="cell-box">
                <mt-cell title="个人信息" is-link class="cell-con"></mt-cell>
            </div>
            <div @click="toPage('other')" class="cell-box">
                <mt-cell title="其他资料" is-link class="cell-con">
                    <!-- <span class="cell-text">已婚,本科</span> -->
                </mt-cell>
            </div>
            <div class="title">
                费用设置
            </div>
            <div @click="toPage('text')" class="cell-box">
                <mt-cell title="文字服务" is-link class="cell-con">
                    <span class="cell-text">0.1元/条</span>
                </mt-cell>
            </div>
            <div @click="toPage('phone')" class="cell-box">
                <mt-cell title="通话服务" is-link class="cell-con">
                    <span class="cell-text">9.8元/15分钟</span>
                </mt-cell>
            </div>
            <div class="title"></div>
            <mt-button type="primary" size="large" style="border-radius:0;">取消倾听者身份</mt-button>
        </div>
        <div class="back" @click="back"></div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

@Component({
 
})
export default class ListenerSettings extends Vue{
   
    created(){
        console.log(666);
    }

    back(){
        (<any>this).$router.go(-1);
    }

    toPage(route:string){
        console.log(route);
    }
}
</script>

<style lang="less" scoped>
    @light-blue:#11b7f3;
    .f-sm{
        font-size:12px;
    }
    .f-lg{
        font-size:18px;
    }
    .p-rl{
        position:relative;
    }
    .p-ab{
        position:absolute;
    }
    .t-ellipsis(@lines){
        overflow:hidden;
        text-overflow: ellipsis;
        display: box;
        display: -webkit-box;
        -webkit-line-clamp: @lines;
        -webkit-box-orient: vertical;
    }
    .cell-text{
        max-width:250px;
        .t-ellipsis(1);
    }
    .v-middle(@height){
        height:@height;
        line-height:@height;
    }
    .container{
        .p-rl;
    }
    .header{
        .v-middle(50px);
        .f-lg;
    }
    .back{
        width:20px;
        height:20px;
        .p-ab;
        top:15px;
        left:20px;
        background:url(../../static/images/userInfo/arrow-left-black.png) no-repeat center center;
    }
    .body{
        .title{
            .v-middle(40px);
            background:rgb(247,247,247);
            color:rgb(173,173,173);
            text-align:left;
            padding-left:10px;
        }
        .cell-con{
            text-align: left;
            color:rgb(173,173,173);
        }
        // .cell-box{
        //     margin-top:-1px;
        // }
        a.cell-con{
            padding-left:0;
        }
        div.mint-cell-wrapper{
            padding-left:20px;
        }
    }
</style>
