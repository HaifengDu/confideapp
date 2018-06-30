<template>
    <div class="container">
        <div class="header">
          我的标签
        </div>
        <div class="body">
            <div class="title">擅长话题<span>7/24</span></div>

        </div>
        <div class="back" @click="back"></div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

@Component({
 
})
export default class MyTags extends Vue{
   
    created(){
        console.log(666);
    }

    back(){
        (<any>this).$router.go(-1);
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
    .body{
        .title{
            .v-middle(40px);
            background:rgb(247,247,247);
            color:rgb(75,75,75);
            text-align:left;
            padding-left:20px;
            span{
                padding-left:20px;
                color:@light-blue;
            }
        }
    }
    .back{
        width:20px;
        height:20px;
        .p-ab;
        top:15px;
        left:20px;
        background:url(../../../static/images/userInfo/arrow-left-black.png) no-repeat center center;
    }
</style>
