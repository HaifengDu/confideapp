<template>
    <div class="container">
        <div class="header">
            <div class="image">
                <img :src="user.headimgurl"/>
            </div>
            <div class="nickname">{{user.nickname}}</div>
            <div class="user-lab">北京市</div>
            <div class="user-lab" v-if="isListener">已婚 | 本科 | 巨蟹座 | 男 28</div>
            <div v-if="!isSelf" class="option">
                <div class="action">
                    <div class="icon">
                        <img src="static/images/userInfo/share.png">
                    </div>
                    <div class="text">分享</div>
                </div>
                <div class="action">
                    <div @click="addConcern" class="icon">
                        <img :src="concernSrc">
                    </div>
                    <div class="text">{{isFollowed?'已关注':'关注'}}</div>
                </div>
            </div>
            <div v-if="!isSelf&&isListener" class="order" @click="order">
                <img src="static/images/userInfo/order.png">
            </div>
            <div class="register">
                2018.05.28注册
            </div>
        </div>
        <div class="body">
            <div v-if="isListener" class="listen-info">
                <div class="info">
                    <div>
                        <p class="count">{{stepPrice}}</p>
                        <p class="content">起步价(元)</p>
                    </div>
                    <div>
                        <p class="count">{{helpNum}}</p>
                        <p class="content">帮助人数</p>
                    </div>
                    <div>
                        <p class="count">{{saledHours}}</p>
                        <p class="content">已售时长(时)</p>
                    </div>
                </div>
                <div class="evaluate" @click="toEvaluate">
                    {{goodEvaRate}}好评&nbsp;&nbsp;&nbsp;&nbsp;{{evaluateNum}}条评价<i class="arrow"></i>
                </div>
            </div>
            <div v-if="isListener" class="person-info">
                <div class="title">我的标签</div>
                <div>
                    <span class="tags tag-default" v-for="(tag,index) in tags" :key="index" @click="tag.desc&&showScribe(tag)">
                        {{tag.name}}<span v-if="tag.desc" class="f-nm">></span>
                    </span>
                </div>
            </div>
            <div class="person-info" :class="{'p-top':!isListener}">
                <div class="title">个人简介</div>
                <div class="information" :class="{'close':!isExpended}">
                    {{resume}}
                </div>
                <div class="title">经历</div>
                <div class="experience" v-for="(exp,index) in exps" :key="index">
                    <span class="exp-name">{{exp.name}}</span>
                    <span class="exp-content">{{exp.desc}}</span>
                </div>
                <span @click="expend" class="expend-btn">[{{isExpended?'收起':'展开'}}]</span>
            </div>
            <div class="attentions">
                <div class="attents">
                    <p class="title">753</p>
                    <p class="lab">关注</p>
                </div>
                <div class="fans">
                    <p class="title">631</p>
                    <p class="lab">粉丝</p>
                </div>
            </div>
        </div>
        <mt-popup
            v-model="popupVisible" class="custom">
            <div class="title">{{tag.name}}</div>
            <div class="content">{{tag.desc}}</div>
            <div class="btn" @click="contact">和TA聊聊</div>
        </mt-popup>
        <message :visible="msgVisible" position="top"></message>
        <mt-button @click="contact" type="primary" size="large" class="contact-btn">进入聊天</mt-button>
        <!-- <div class="button-box">
            <mt-button size="normal" type="primary" @click.native="contact">进入聊天</mt-button>
        </div> -->
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import Message from './Message';
import { mapActions, mapGetters } from 'vuex';
import { ERole } from '../../enum/ERole';
import MyService from "../../api/UserService.ts";
const userService = MyService.getInstance();

const SHOW_MSG_TIME = 2000;
@Component({
    methods:{
        ...mapActions({
            getUserInfo:'getUserInfo'
        })
    },
    computed:{
        ...mapGetters({
            user:'user'
        })
    },
    components:{
        "message":Message
    }
})
export default class UserInfo extends Vue{
    private weixinid = '';
    private stepPrice = 9.9;
    private helpNum = 1;
    private saledHours = 0.3;
    
    private goodEvaRate = '100%';
    private evaluateNum = 1;
    private isExpended = false;
    //个人简介
    private resume = ''; 
    //是否是倾听者
    private isListener = false;
    //是否已关注该用户
    private isFollowed = true;
    private exps:any = [];

    //TODO:测试数据
    
    //当前用户信息页面是否是自己
    private isSelf = false;

    private popupVisible = false;
    private msgVisible = false;
    private tag:any = {};

    private concernSrc = 'static/images/userInfo/add.png';
    private tags:any = [];
    created(){
        this.weixinid = (<any>this).$route.query.weixinid||'oRtVK06i1JN_GkUA5NPk7pXzOJ3s';
        (<any>this).getUserInfo(this.weixinid).then((res:any)=>{
            if(res.data.success){
                this.initData(res.data.data);
            }else{
                this.$toast('获取用户信息失败');
            }
        });

    }

    initData(data:any){
        this.isListener = data.role === ERole.Listener;
        if(this.isListener){
            let listener = data.listener;
            listener.labels.forEach((label:any)=>{
                label.desc = '';
            })
            let descs = JSON.parse(listener.labeldesc);
            descs.forEach((desc:any)=>{
                if(desc.desc){
                    let label = listener.labels.find((item:any)=>item.id==desc.id);
                    label&&(label.desc = desc.desc);
                }
            });
            this.tags = listener.labels;
            //TODO:将经历名称与desc描述数据组合到一起循环展示
            // this.exps = JSON.parse(listener.labeldesc);
        }
        this.resume = data.resume;
        this.checkFollow(data.id);
    }

    checkFollow(id:number){
        userService.getCheckRecord([id]).then((res:any)=>{
            if(res.data.success){   
                const data = res.data.data;
                this.isFollowed = data[0].record;
            }
        });
    }

    expend(){
        this.isExpended = !this.isExpended;
    }

    addConcern(){
        this.isFollowed = !this.isFollowed;
        this.concernSrc = this.isFollowed?'static/images/userInfo/right.png':'static/images/userInfo/add.png';
    }

    showScribe(tag:any){
        this.tag = tag;
        this.popupVisible = !this.popupVisible;
    }

    order(){
        console.log('to order');
    }

    toEvaluate(){
        console.log('to evaluate');
    }

    contact(){
        this.popupVisible&&(this.popupVisible = false);
        this.msgVisible = true;
        setTimeout(()=>{
            this.msgVisible = false;
        },SHOW_MSG_TIME);
        console.log('to talk');
    }
}
</script>

<style lang="less" scoped>
    @import '../../assets/style.less';
    *{
        .f-nm;
    }
    div.mint-popup.custom{
        border-radius:10px;
        width:250px;
        height:250px;
        background:@light-blue;
        color:#fff;
        .title{
            .v-middle(30px);
            margin:40px 0 20px 0;
            .f-lg;
        }
        .content{
            padding:0 10px;
            .t-ellipsis(4);
        }
        .btn{
            width: 100%;
            .v-middle(40px);
            .p-ab;
            bottom:0;
            left:0;
            color:#fff;
            background:#40E0D0;
            border-radius:0 0 10px 10px;
        }
    }
    .container{
        padding-bottom: 60px;
        .header{
            width:100%;
            height:170px;
            padding:30px 0 20px 0;
            background-image: url(../../../static/images/userInfo/user_info_bg.jpg);  
            background-repeat: no-repeat;  
            background-size: 100% 100%; 
            .p-rl;
            .image{
                padding-bottom:10px;
                img{
                    .circle(80px);
                }
            }
            .nickname{
                .f-lg;
                color:#eee;
            }
            .user-lab{
                padding-top:10px;
                color:#aaa;
            }
            .option{
                display:flex;
                flex-direction:column;
                .p-ab;
                top: 40px;
                right:20px;
                .action{
                    width:40px;
                    text-align:center;
                    margin-bottom:10px;
                    .icon{
                        .p-rl;
                        .circle(30px);
                        background:@light-blue;
                        margin: 0 auto 5px auto;
                        img{
                            width: 18px;
                            .p-ab;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                    }
                }
                .text{
                    color:#fff;
                    .f-sm;
                }
            }
            .order{
                .circle(50px);
                .p-ab;
                right:20px;
                bottom:-20px;
                z-index:10;
                background:rgb(253,51,104);
                img{
                    width:32px;
                    .p-rl;
                    top: 9px;
                }
            }
             .register{
                height:16px;
                background:@light-blue;
                color:#fff;
                .p-ab;
                top: 90px;
                left:20px;
                padding:5px 3px;
                border-radius:5px;
                .f-sm;
            }
        }
        .body{
            width:100%;
            background:#fff;
            .p-rl;
            .listen-info,.person-info{
                padding:0 20px;
            }
            .listen-info{
                .info{
                    width:100%;
                    padding-top:30px;
                    display:flex;
                    flex-direction: row;
                    div{
                        flex-grow: 1;
                        .count,.content{
                            padding:10px 0;
                        }
                        .count{
                            font-size:16px;
                            color:rgb(231,165,50);
                        }
                    }
                }
                .evaluate{
                    .v-middle(35px);
                    background: rgb(247,248,252);
                    border-radius:5px;
                    .arrow{
                        display:inline-block;
                        width:20px;
                        height:16px;
                        position:relative;
                        top:4px;
                        background-size: 100% 100%; 
                        background: url(../../../static/images/userInfo/arrow-right.png) no-repeat center center;  
                    }
                }
            }
            .person-info{
                text-align:left;
                padding-bottom:20px;
                .p-rl;
                .title{
                    padding:10px 0;
                    font-weight: bold;
                }
                .tags{
                    display:inline-block;
                    border-radius: 5px;
                    padding:0px 3px 2px 3px;
                    .f-sm;
                    margin:5px 5px 0 0;
                }
                .tag-default{
                    border: 1px solid @light-blue;
                    color: @light-blue;
                }
                .information{
                    padding-right:30px;
                    .p-rl;
                    text-align: justify;
                    color:#b5b5b5;
                }
                .close{
                    .t-ellipsis(3);
                }
                .experience{
                    color:#b5b5b5;
                    .exp-name{
                        font-weight: bold;
                    }
                }
                .expend-btn{
                    .p-ab;
                    right:10px;
                    bottom:18px;
                    color:@light-blue;
                }
            }
            .person-info.p-top{
                padding-top:30px;
            }
            .attentions{
                padding:20px 0;
                .attents,.fans{
                    display:inline-block;
                    .circle(40px);
                    background:@light-blue;
                    color:#fff;
                    .title,.lab{
                        height:20px;
                        font-size:10px;
                    }
                    .title{
                        line-height:25px;
                    }
                    .lab{
                        line-height:15px;
                    }
                }
                .attents{
                    margin-right:20px;
                }
            }
        }
    }   
    .contact-btn{
        border-radius:0;
        position:fixed;
        bottom:0;
    }
</style>
