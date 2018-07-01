<template>
    <div class="container">
        <div class="body">
            <div class="title">个人设置</div>
            <div @click="toPage('basic')">
                <mt-cell title="基本资料" is-link class="cell-con"></mt-cell>
            </div>
            <div @click="toPage('myTags')" class="cell-box">
                <mt-cell title="我的标签" is-link class="cell-con">
                    <!-- <span class="cell-text">情感挽回,婚姻关系,人际关系,个人成长,情绪疏导</span> -->
                </mt-cell>
            </div>
            <div @click="toPage('info')" class="cell-box">
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
            <div @click="toPage('phone')" class="cell-box">
                <mt-cell title="通话服务" is-link class="cell-con">
                    <span class="cell-text">9.8元/15分钟</span>
                </mt-cell>
            </div>
            <div class="button-box">
                <mt-button size="normal" type="primary" @click.native="cancelListener">取消倾听者身份</mt-button>
            </div>
            <!-- <mt-button type="primary" size="large" class="cancel-btn">取消倾听者身份</mt-button> -->
        </div>
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

    cancelListener(){

    }

    toPage(route:string){
        console.log(route);
        this.$router.push('/'+route);
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
            padding-left:10px;
        }
        a.cell-con{
            padding-left:0;
        }
    }
    // .cancel-btn{
    //     border-radius:0;
    //     position:fixed;
    //     bottom:0;
    // }
</style>
