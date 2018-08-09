<template>
    <div>
        <div class="header">
            <div class="evaluation">
                <div class="rate-box">
                    <rate :value="rate.timely" :disabled="true" label="及时服务"></rate>
                    <rate :value="rate.attitude" :disabled="true" label="服务态度"></rate>
                    <rate :value="rate.ability" :disabled="true" label="服务能力"></rate>
                </div>
            </div>
            <div class="good-eva">
                <div class="eva-box">
                    <p class="rate">100%</p>
                    <p class="text">好评率</p>
                </div>
            </div>
        </div>
        <div class="tags">
            <span 
            v-for="(tag,index) in tags" 
            :key="index" 
            class="tag">{{tag.text}}({{tag.num}})</span>
        </div>
        <div class="divider"></div>
        <div class="tabs">
            <div class="tab" 
                v-for="(tab,index) in tabs" 
                :key="index">
                <div class="con" @click="tabChange(tab)" :class="{'active':tab.active}">
                    <p class="text">{{tab.text}}</p>
                    <p class="text">{{tab.num}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator'; 
import Rate from "@/components/Rate.vue";

@Component({
    components:{
        'rate':Rate
    }
})
export default class EvaluationList extends Vue {
    private rate:any = {
        timely:5,
        attitude:5,
        ability:5
    }

    private tags:any = [
        {text:'很懂得安抚',num:1},
        {text:'受益匪浅',num:1},
        {text:'知己',num:1},
    ];

    private tabs:any = [
        {id:1,text:'满意',num:2,active:true},
        {id:2,text:'一般',num:0,active:false},
        {id:3,text:'不满意',num:0,active:false},
    ];

    created(){
        console.log(666);
    }

    tabChange(tab:any){
        if(tab.active)return;
        this.tabs.forEach((item:any)=>{
            item.active = item.id === tab.id;
        });
        //TODO:根据tab的状态获取对应的评论列表
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
    }
    .custom-title{
        .p-rl;
        .v-middle(40px);
        background:rgb(247,247,247);
        color:@gray;
        text-align:left;
        padding-left:20px;
    }
    .header{
        padding:25px 20px;
        border-bottom: 1px solid @gray;
        overflow: hidden;
        .evaluation,.good-eva{
            height:100px;
            .f-nm;
            box-sizing: border-box;
            float: left;
        }
        .evaluation{
            width:70%;
            border-right:1px solid @gray;
            .rate-box{
                margin-top:5px;
            }
        }
        .good-eva{
            width:30%;
            .rate{
                font-size:24px;
                color:@mainColor;
                margin-bottom:10px;
            }
            .text{
                font-size:14px;
                color:@textColor;
            }
            .eva-box{
                margin-top:50%;
                transform:translate(0,-50%);
            }
        }
    }
    .tags{
        padding:15px 20px;
        text-align:left;
        .tag{
            padding:5px 8px;
            border-radius:5px;
            background:rgb(230,248,249);
            display:inline-block;
            margin-right:15px;
        }
    }
    .divider{
        height:10px;
        background:#eee;
    }
    .tabs{
        overflow: hidden;
        .tab{
            width:33.3%;
            float:left;
            .con{
                width:70px;
                margin:0 auto;
                padding:5px 0;
                border-bottom:1px solid transparent;
                .text{
                    color:@mainColor;
                }
            }
            .con.active{
                border-bottom-color:@mainColor;
            }
        }
    }
</style>


