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
                    <div class="text">{{isConcern?'已关注':'关注'}}</div>
                </div>
            </div>
            <div v-if="!isSelf&&isListener" class="order" @click="order">
                <img src="static/images/userInfo/order.png">
            </div>
            <div class="back" @click="back"></div>
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
                <div class="evaluate">
                    {{goodEvaRate}}好评&nbsp;&nbsp;&nbsp;&nbsp;{{evaluateNum}}条评价<i class="arrow"></i>
                </div>
            </div>
            <!-- <div v-if="isListener" class="person-info">
                <div class="title">个人经历</div>
                <div>已婚 | 本科 | 巨蟹座 | 男 28</div>
            </div> -->
            <div v-if="isListener" class="person-info">
                <div class="title">我的标签</div>
                <div>
                    <span class="tags tag-default" v-for="(tag,index) in tags" :key="index" @click="tag.hasSub&&showScribe(tag)">
                        {{tag.name}}<span v-if="tag.hasSub" class="f-nm">></span>
                    </span>
                </div>
            </div>
            <div class="person-info" :class="{'p-top':!isListener}">
                <div class="title">个人简介</div>
                <div class="information" :class="{'close':!isExpended}">
                    松果名师，大学老师，运动健将，擅长于心理辅导，临床心理学在读博士，国际认证婚姻家庭治疗师。松果名师，大学老师，运动健将，擅长于心理辅导，临床心理学在读博士，国际认证婚姻家庭治疗师。松果名师，大学老师，运动健将，擅长于心理辅导，临床心理学在读博士，国际认证婚姻家庭治疗师。
                    松果名师，大学老师，运动健将，擅长于心理辅导，临床心理学在读博士，国际认证婚姻家庭治疗师。松果名师，大学老师，运动健将，擅长于心理辅导，临床心理学在读博士，国际认证婚姻家庭治疗师。松果名师，大学老师，运动健将，擅长于心理辅导，临床心理学在读博士，国际认证婚姻家庭治疗师。
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
            <div class="content">{{tag.scribe}}</div>
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
    private stepPrice = 9.9;
    private helpNum = 1;
    private saledHours = 0.3;
    
    private goodEvaRate = '100%';
    private evaluateNum = 1;
    private isExpended = false;

    //TODO:测试数据
    //是否是倾听者
    private isListener = true;
    //当前用户信息页面是否是自己
    private isSelf = false;
    //是否已关注该用户
    private isConcern = false;

    private popupVisible = false;
    private msgVisible = false;
    private tag:any = {};

    private concernSrc = 'static/images/userInfo/add.png';
    private tags = [
        {name:'情感挽回',hasSub:true,scribe:'拥有多年的情感挽回经验，成功率高,拥有多年的情感挽回经验，成功率高,拥有多年的情感挽回经验，成功率高,拥有多年的情感挽回经验，成功率高，拥有多年的情感挽回经验，成功率高，拥有多年的情感挽回经验，成功率高'},
        {name:'婚姻关系'},
        {name:'人际关系'},
        {name:'个人成长'},
        {name:'情绪疏导',hasSub:true,scribe:'极其擅长情绪疏导，经验丰富'},
        {name:'心理负担'},
        {name:'帮我分析问题'}
    ]
    created(){
        console.log(666);
        (<any>this).getUserInfo('oRtVK06i1JN_GkUA5NPk7pXzOJ3s');
    }

    expend(){
        this.isExpended = !this.isExpended;
        console.log((<any>this));
    }

    addConcern(){
        this.isConcern = !this.isConcern;
        this.concernSrc = this.isConcern?'static/images/userInfo/right.png':'static/images/userInfo/add.png';
    }

    showScribe(tag:any){
        this.tag = tag;
        this.popupVisible = !this.popupVisible;
    }

    order(){
        console.log('to order');
    }

    contact(){
        this.popupVisible&&(this.popupVisible = false);
        this.msgVisible = true;
        setTimeout(()=>{
            this.msgVisible = false;
        },SHOW_MSG_TIME);
        console.log('to talk');
    }

    back(){
        (<any>this).$router.go(-1);
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
            .back{
                width:20px;
                height:20px;
                .p-ab;
                top:20px;
                left:20px;
                background:url(../../../static/images/userInfo/arrow-left.png) no-repeat center center;
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
                }
                .close{
                    .t-ellipsis(3);
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
