<template>
    <div>
        <div v-if="isListener">
            <div class="header">
                <div class="evaluation">
                    <div class="rate-box">
                        <rate v-model="evaDatas.timerate" :disabled="true" label="及时服务"></rate>
                        <rate v-model="evaDatas.serviceattitude" :disabled="true" label="服务态度"></rate>
                        <rate v-model="evaDatas.servicepower" :disabled="true" label="服务能力"></rate>
                    </div>
                </div>
                <div class="good-eva">
                    <div class="eva-box">
                        <p class="rate">{{evaDatas.applauserate*100}}%</p>
                        <p class="text">好评率</p>
                    </div>
                </div>
            </div>
            <div class="tags" v-if="tags&&tags.length>0">
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
                            v-for="(tag,index) in eva.tags" 
                            :key="index" 
                            class="tag">{{tag.text}}</span>
                        </p>
                        <p v-if="!eva.reply" class="reply-box">
                            <el-input v-if="eva.isReply" class="reply-input" v-model="replyMsg" placeholder="请输入回复内容"></el-input>
                            <mt-button class="button" size="small" @click.native="reply(eva)">{{eva.isReply?'发送':'回复'}}</mt-button>
                        </p>
                        <p v-if="eva.reply"><span class="reply" >倾听者回复：</span>{{eva.reply}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!isListener" class="container" 
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <div class="list-container" v-for="(item,index) in evaList" :key="index" @click="toUserInfo(item)">
                <div class="list">
                    <img class="head-img" :src="item.headImg"/>
                    <div class="content">
                        <p class="name">{{item.name}}</p>
                        <p class="date">{{item.time}}</p>
                    </div>
                    <div class="button" @click.stop="followMe(item)">找TA倾诉</div>
                </div>
                <div class="comment">{{item.comment}}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator'; 
import { mapGetters } from 'vuex';
import { ERole } from '../../enum/ERole';
import Rate from "@/components/Rate.vue";
import Pager from "@/helper/Pager.ts"; 
import EvaluateService from "@/api/EvaluateService.ts";
const evaluateService = EvaluateService.getInstance();

@Component({
    components:{
        'rate':Rate
    },
    computed:{
        ...mapGetters({
            user:'user'
        })
    }
})
export default class EvaluationList extends Vue {
    private pager = new Pager().setLimit(20);
    private isListener:boolean = true;
    private curStatus:number = 1;
    private replyMsg:string = '';
    private evaDatas:any = {
        timerate:5,
        serviceattitude:5,
        servicepower:5,
        applauserate:1
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
        if((<any>this).user&&(<any>this).user.role){
            this.isListener = (<any>this).user.role === ERole.Listener;
        }
        this.loadData();
        // this.getEvaDatas();
    }

    tabChange(tab:any){
        if(tab.active)return;
        this.tabs.forEach((item:any)=>{
            item.active = item.id === tab.id;
        });
        this.curStatus = tab.id;
        this.pager.clear().setLimit(20);
        this.loadData();
    }

    loadData(){
        //TODO:获取评价列表数，注意倾听者和倾诉者列表数据的区别
        let params = {
            status:this.curStatus,
            lid:(<any>this).user.id||3
        }
        Object.assign(params,this.pager);
        let evaList =[
            {id:1,isReply:false,name:'正直的嘉熙',time:'18-06-28',type:2,comment:'非常满意，受益匪浅',tags:[{text:'很懂得安抚',num:1},{text:'受益匪浅',num:1},{text:'知己',num:1}],reply:'',headImg:'/static/images/tab/my-active.png'},
            {id:2,isReply:false,name:'正直的嘉熙',time:'18-06-28',type:2,comment:'非常满意，受益匪浅',tags:[{text:'很懂得安抚',num:1},{text:'受益匪浅',num:1},{text:'知己',num:1}],reply:'',headImg:'/static/images/tab/my-active.png'}
        ];
        this.evaList = evaList;
        // evaluateService.getEvaList(params).then((res:any)=>{
        //     if(res.data.success){
        //         this.evaList = res.data.data;
        //         if(this.pager.getPage().page === 1){
        //             this.evaList = evaList;
        //         }else{
        //             this.evaList = this.evaList.concat(evaList);0
        //         }
        //         this.pager.setNext();
        //     }else{
        //         this.$toast(res.data.message);
        //     }
        // });
    }

    loadMore(){
        if(this.pager.getPage().page===1)return;
        this.loadData();
    }

    reply(eva:any){
        if(eva.isReply){
            if(!this.replyMsg){
                this.$toast('回复内容不能为空');
                return;
            }
            //TODO:向后台发送回复数据，成功后清空replyMsg
            console.log(this.replyMsg);
            eva.reply = this.replyMsg;
        }else{
            this.evaList.forEach((item:any)=>{
                if(item.id===eva.id){
                    item.isReply = true;
                }else{
                    item.isReply = false;
                }
            });
        }
        
    }

    private getEvaDatas(){
        evaluateService.getEvaDatas((<any>this).user.id||3).then((res:any)=>{
            if(res.data.success){
                Object.assign(this.evaDatas,res.data.data);
                this.tags = res.data.data.labels;
            }else{
                this.$toast(res.data.message);
            }
        });
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
        .list-container{
            border-bottom:1px solid #eee;
            .list{
                text-align:left;
                padding:10px 20px;
                display:flex;
                .p-rl;
                .head-img{
                    width:50px;
                    height:50px;
                    vertical-align: middle;
                    border-radius: 6px;
                }
                .content{
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    padding-left:20px;
                    .date,.name{
                        padding:3px;
                    }
                    .date{
                        color:rgb(171,171,171);
                    }
                }
                .button{
                    height: 30px;
                    line-height: 30px;
                    padding: 2px 15px;
                    border-radius: 17px;
                    justify-content: center;
                    color:#fff;
                    background:#f3a843;
                    .p-ab;
                    right: 20px;
                    top: 17px;
                }
            }
            .comment{
                padding:10px 20px;
                text-align:left;
            }
        }
        
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
                border-top:1px solid #d7d7d7;
            }
        }
    }
    .reply-box{
        display:flex;
        .reply-input{
            margin-right:10px;
        }
        .button{
            padding:0 10px;
            height:24px;
            width:60px;
        }
    }
</style>


