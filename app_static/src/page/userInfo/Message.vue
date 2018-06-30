<template>
    <mt-popup
        @click.native="contact"
        v-model="visible"
        class="message"
        :modal="false"
        :position="position">
        <div class="msg-box">
            <div class="title"><img src="static/images/userInfo/message.png"/>新消息提醒</div>
            <div class="content">星空下的嗳:你好</div>
            <span class="time">刚刚</span>
            <i class="arrow"></i>
        </div>
    </mt-popup>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component,Prop} from 'vue-property-decorator';

@Component({
    
})
export default class Message extends Vue{

    @Prop({
        type:Boolean,
        default:false
    })
    visible:boolean;

    @Prop({
        type:String,
        default:''
    })
    position:string;

    created(){
        console.log(666);
    }

    contact(){
        console.log('to talk');
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
    .mint-popup.message{
        width:95%;
        height:60px;
        border-radius:5px;
        margin-top:10px;
        .msg-box{
            // width:100%;
            padding:10px;
            text-align: left;
            .p-rl;
            .title{
                color:rgb(183,183,183);
                img{
                    width:24px;
                    vertical-align: middle;
                    margin-right:10px;
                }
            }
            .content{
                color:rgb(50,50,50);
            }
            .time{
                .p-ab;
                top:10px;
                right:20px;
            }
            .arrow{
                display:inline-block;
                width:20px;
                height:16px;
                .p-ab;
                bottom:10px;
                right:20px;
                background-size: 100% 100%; 
                background: url(../../../static/images/userInfo/arrow-right.png) no-repeat center center;  
            }
        }
    }
   
</style>
