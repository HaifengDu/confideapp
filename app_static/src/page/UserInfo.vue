<template>
    <div class="container">
        <div class="header">
            <div class="image">
                <img src="http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIkkg9icSGleYN53EtQiaOuxCkTnicpibicOgRicZS2iaGzCYOh2TLA4Wh86mFDCbmamZ9c7WibGXiaveK47Og/132"/>
            </div>
            <div class="nickname">
                星空下的嗳
            </div>
            <div class="user-id">
                <span>北京市</span>
                <span class="lab">果号</span>4361490
            </div>
            <div v-if="!isSelf" class="option">
                <div class="concern">
                    <div @click="addConcern" class="icon">
                        <img :src="concernSrc">
                    </div>
                    <div class="text">
                        <span>{{isConcern?'已关注':'关注'}}</span>
                    </div>
                </div>
                <div class="share">
                    <div class="icon">
                        <img src="static/images/userInfo/share.png">
                    </div>
                    <div class="text">
                        <span>分享</span>
                    </div>
                </div>
            </div>
            <div v-if="!isSelf&&isListener" class="phone" @click="contact">
                <img src="static/images/userInfo/phone-handle.png">
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
            <div v-if="isListener" class="person-info">
                <div class="title">个人经历</div>
                <div>已婚 | 本科 | 巨蟹座 | 男 28</div>
            </div>
            <div v-if="isListener" class="person-info">
                <div class="title">我的标签</div>
                <div>
                    <span class="tags tag-default" v-for="(tag,index) in tags" :key="index" @click="tag.hasSub&&showScribe(tag)">
                        {{tag.name}}<span v-if="tag.hasSub">></span>
                    </span>
                </div>
            </div>
            <div class="person-info">
                <div class="title">个人信息</div>
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
            <div class="register">
                <span>2018.05.28注册</span>
            </div>
        </div>
        <mt-popup
            v-model="popupVisible">
            <div class="title">{{tag.name}}</div>
            <div class="content">{{tag.scribe}}</div>
            <div class="btn" @click="contact">和TA聊聊</div>
        </mt-popup>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

@Component({
 
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
    }

    expend(){
        this.isExpended = !this.isExpended;
    }

    addConcern(){
        this.isConcern = !this.isConcern;
        this.concernSrc = this.isConcern?'static/images/userInfo/right.png':'static/images/userInfo/add.png';
    }

    showScribe(tag:any){
        this.tag = tag;
        this.popupVisible = !this.popupVisible;
    }

    contact(){
        this.popupVisible&&(this.popupVisible = false);
        console.log('talk with me');
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
    .v-middle(@height){
        height:@height;
        line-height:@height;
    }
    div.mint-popup{
        border-radius:10px;
        width:250px;
        height:250px;
        background:rgb(48,186,180);
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
            background:rgb(21,211,197);
            border-radius:0 0 10px 10px;
        }
    }
    .container{
        .header{
            width:100%;
            padding:30px 0 20px 0;
            background-image: url(../../static/images/userInfo/user_info_bg.jpg);  
            background-repeat: no-repeat;  
            background-size: 100% 100%; 
            .p-rl;
            .image{
                padding-bottom:10px;
                img{
                    width:80px;
                    border-radius:50%;
                }
            }
            .nickname{
                color:#eee;
            }
            .user-id{
                font-size:12px;
                padding:10px 0;
                color:#aaa;
                .lab{
                    font-size:10px;
                    color:#eee;
                    padding: 1px 3px;
                    border-radius:6px;
                    background:#aaa;
                }
            }
            .option{
                display:flex;
                .p-ab;
                top:20px;
                right:20px;
                .concern,.share{
                    width:40px;
                    text-align:center;
                    .icon{
                        width:24px;
                        height:24px;
                        border-radius:12px;
                        background:#8a8a8a;
                        margin: 0 auto 5px auto;
                        img{
                            width: 16px;
                            .p-rl;
                            top: 4px;
                        }
                    }
                }
                .text{
                    color:#fff;
                    span{
                        .f-sm;
                    }
                }
            }
            .phone{
                width:50px;
                height:50px;
                .p-ab;
                right:20px;
                bottom:-10px;
                z-index:10;
                background:rgb(253,51,104);
                border-radius:50%;
                img{
                    .p-rl;
                    top: 9px;
                }
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
                        width:16px;
                        height:16px;
                        position:relative;
                        top:4px;
                        background-size: 100% 100%; 
                        background: url(../../static/images/userInfo/arrow-right.png) no-repeat center center;  
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
            .attentions{
                padding:20px 0;
                .attents,.fans{
                    display:inline-block;
                    width:40px;
                    height:40px;
                    background:rgb(130,146,202);
                    color:#fff;
                    border-radius:50%;
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
            .register{
                background:rgb(254,208,3);
                color:#fff;
                .p-ab;
                top:0;
                left:10px;
                padding:5px 3px;
                border-bottom-left-radius:5px;
                border-bottom-right-radius:5px;
                span{
                    .f-sm;
                }
            }
        }
    }   
</style>
