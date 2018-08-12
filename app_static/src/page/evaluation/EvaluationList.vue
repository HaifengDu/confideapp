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
        <div class="eva-title">
            最新评论
        </div>
        <div class="body"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
            >
            <div class="eva-list" v-for="(eva,index) in evaList" :key="index">
                <div class="head-img">
                    <img width="40px" :src="eva.headImg" alt="">
                </div>
                <div class="content">
                    <p class="name">{{eva.name}}</p>
                    <p class="info">
                        <span class="time">{{eva.time}}</span>
                        <span class="type">购买了{{eva.type=='2'?'通话':'文字'}}服务</span>
                    </p>
                    <p class="comment" v-if="eva.comment">{{eva.comment}}</p>
                    <p class="comment" v-if="!eva.comment"><span class="default">默认</span>太棒了，服务很赞，倾诉体验超好。</p>
                    <p class="tags" v-if="eva.tags&&eva.tags.length>0">
                        <span 
                        v-for="(tag,index) in tags" 
                        :key="index" 
                        class="tag">{{tag.text}}</span>
                    </p>
                    <p class="reply" v-if="eva.reply">倾听者回复：</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator'; 
import Rate from "@/components/Rate.vue";
import Pager from "@/helper/Pager.ts"; 

@Component({
    components:{
        'rate':Rate
    }
})
export default class EvaluationList extends Vue {
    private pager = new Pager().setLimit(20);
    private curStatus:number = 1;
    private rate:any = {
        timely:5,
        attitude:5,
        ability:5
    }

    private tags:any = [
        {text:'很懂得安抚',num:1},
        {text:'受益匪浅',num:1},
        {text:'知己',num:1},
        {text:'很懂得安抚',num:1},
        {text:'受益匪浅',num:1},
        {text:'知己',num:1},
    ];

    private tabs:any = [
        {id:1,text:'满意',num:2,active:true},
        {id:2,text:'一般',num:0,active:false},
        {id:3,text:'不满意',num:0,active:false},
    ];

    private evaList:any = [];

    created(){
        this.loadData();
    }

    tabChange(tab:any){
        if(tab.active)return;
        this.tabs.forEach((item:any)=>{
            item.active = item.id === tab.id;
        });
        //TODO:根据tab的状态获取对应的评论列表
        console.log(tab.id);
        this.curStatus = tab.id;
        this.pager.clear().setLimit(20);
        this.loadData();
    }

    loadData(){
        //TODO:从store中获取订单数据
        let params = {
            status:this.curStatus
        }
        Object.assign(params,this.pager);
        let evaList =[
            {id:1,name:'正直的嘉熙',time:'18-06-28',type:2,comment:'非常满意，受益匪浅',tags:[{text:'很懂得安抚',num:1},{text:'受益匪浅',num:1},{text:'知己',num:1}],reply:'',headImg:'/static/images/tab/my-active.png'},
            {id:2,name:'正直的嘉熙',time:'18-06-28',type:2,comment:'非常满意，受益匪浅',tags:[{text:'很懂得安抚',num:1},{text:'受益匪浅',num:1},{text:'知己',num:1}],reply:'',headImg:'/static/images/tab/my-active.png'}
        ];
        if(this.pager.getPage().page === 1){
            this.evaList = evaList;
        }else{
            this.evaList = this.evaList.concat(evaList);
        }
        this.pager.setNext();
    }

    loadMore(){
        if(this.pager.getPage().page===1)return;
        this.loadData();
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
            margin-bottom: 5px;
        }
    }
    .content .tags{
        padding:20px 0 5px 0;
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
                    color:#666;
                }
            }
            .con.active{
                border-bottom-color:@mainColor;
                .text{
                    color:@mainColor;
                }
            }
        }
    }
    .eva-title{
        text-align:left;
        padding:10px 20px;
    }
    .eva-list{
        padding:10px 20px;
        overflow: hidden;
        border-bottom:1px solid @gray;
        .head-img,.content{
            float:left;
        }
        .head-img{
            width:40px;
        }
        .content{
            width:~'calc(100vw - 100px)';
            text-align:left;
            padding-left:10px;
            .name,.info{
                color:#adadad;
            }
            .info{
                margin-bottom: 10px;
                .time{
                    padding-right:10px;
                }
            }
            .comment{
                padding-bottom:2px;
                .t-ellipsis(3);
                .default{
                    .f-sm;
                    padding: 2px;
                    border: 1px solid #adadad;
                    color: #adadad;
                    border-radius: 3px;
                    margin-right: 5px;
                }
            }
            .reply{
                color:@mainColor;
                padding-top:5px;
                margin-right: -30px;
                border-top:1px solid #d7d7d7;
            }
        }
    }
</style>


