<template>
    <div class="container">
        <div class="body">
            <div class="title">个人设置</div>
            <div @click="toPage('baseInfo')">
                <mt-cell title="基本资料" is-link class="cell-con"></mt-cell>
            </div>
            <div @click="toPage('myTags')" class="cell-box">
                <mt-cell title="我的标签" is-link class="cell-con">
                    <!-- <span class="cell-text">情感挽回,婚姻关系,人际关系,个人成长,情绪疏导</span> -->
                </mt-cell>
            </div>
            <div @click="toPage('personalInfo')" class="cell-box">
                <mt-cell title="个人信息" is-link class="cell-con"></mt-cell>
            </div>
            <div @click="toPage('otherInfo')" class="cell-box">
                <mt-cell title="其他资料" is-link class="cell-con">
                    <!-- <span class="cell-text">已婚,本科</span> -->
                </mt-cell>
            </div>
            <div class="title">
                费用设置
            </div>
            <div @click="toPage('textService')" class="cell-box">
                <mt-cell title="文字服务" is-link class="cell-con">
                    <span class="cell-text">0.1元/条</span>
                </mt-cell>
            </div>
            <div @click="toPage('callService')" class="cell-box">
                <mt-cell title="通话服务" is-link class="cell-con">
                    <span class="cell-text">9.8元/15分钟</span>
                </mt-cell>
            </div>
            <mt-cell title="暂不接单" class="cell-con" @click.native.prevent="changeBusinessStatus">
                <mt-switch v-model="isNotSuspension"></mt-switch>
            </mt-cell>
            <div class="button-box">
                <mt-button size="normal" type="primary" @click.native="cancelListener">取消倾听者身份</mt-button>
            </div>
            <mt-popup
                v-model="showAlertWin" 
                class="custom">
                <div class="custom-title">提示</div>
                <div class="content">
                    开启后，接单状态将变为休息中，且倾诉者无法向您下单
                </div>
                <div class="button-box">
                    <mt-button size="normal" type="primary" @click.native="doNotBusiness">确定</mt-button>
                </div>
            </mt-popup>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

@Component({
 
})
export default class ListenerSettings extends Vue{
    private isNotSuspension = false;
    private showAlertWin = false;
   
    created(){
        console.log(666);

    }

    changeBusinessStatus(){
        if(!this.isNotSuspension){
            //TODO:向后台发请求，设置接单状态
            this.showAlertWin = true;
            return;
        }
        this.isNotSuspension = false;
    }

    doNotBusiness(){
        this.isNotSuspension = true;
        this.showAlertWin = false;
    }

    cancelListener(){
        //TODO:向后台发请求，取消倾听者身份
    }

    toPage(route:string){
        let query:any = {};
        if(route==="baseInfo"){
            query.from = "my";
        }
        this.$router.push({
            path:'/'+route,
            query
        });
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
    .body{
        .title{
            .v-middle(40px);
            background:rgb(247,247,247);
            color:rgb(173,173,173);
            text-align:left;
            padding-left:20px;
        }
        a.cell-con{
            padding-left:0;
        }
    }
    div.mint-popup.custom{
        border-radius:10px;
        width:280px;
        background:#fff;
        padding-bottom:65px;
        .custom-title{
            padding: 15px 10px;
            border-bottom: 1px solid #ccc;
        }
        .content{
            text-align:left;
            padding:10px;
        }
    }
</style>
