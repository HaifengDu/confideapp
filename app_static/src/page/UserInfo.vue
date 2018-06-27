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
                <span class="lab">果号</span>4361490
            </div>
        </div>
        <div class="body" :class="{'close-state':!isExpended}">
            <div class="listen-info">
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
                    {{goodEvaRate}}好评&nbsp;&nbsp;&nbsp;&nbsp;{{evaluateNum}}条评价
                </div>
            </div>
            <div class="person-info">
                <div class="title">个人经历</div>
                <div>已婚|本科|巨蟹座|男 28</div>
            </div>
            <div class="person-info">
                <div class="title">我的标签</div>
                <div>
                    <span class="tags" v-for="(tag,index) in tags" :key="index">
                        {{tag.name}}
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
        </div>
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
    private tags = [
        {name:'情感挽回'},
        {name:'婚姻关系'},
        {name:'人际关系'},
        {name:'个人成长'},
        {name:'情绪疏导'},
        {name:'心理负担'},
        {name:'帮我分析问题'}
    ]
    created(){
        console.log(666);
    }

    expend(){
        this.isExpended = !this.isExpended;
    }
}
</script>

<style lang="less" scoped>
    @light-blue:#11b7f3;
    .container{
        min-height: 667px;
        background-image: url(../../static/images/userInfo/user_info_bg.jpg);  
        background-repeat: no-repeat;  
        background-size: 100% 100%; 
        .header{
            width:100%;
            padding:30px 0 10px 0;
            .image{
                padding-bottom:10px;
                img{
                    width:80px;
                    border-radius:40px;
                }
            }
            .nickname{
                color:#eee;
            }
            .user-id{
                font-size:12px;
                padding:10px 0;
                color:#999;
                .lab{
                    font-size:10px;
                    color:#eee;
                    padding: 1px 3px;
                    border-radius:6px;
                    background:#777;
                }
            }
        }
        .body{
            width:100%;
            margin-top:10px;
            background:#fff;
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
                    height: 35px;
                    line-height: 35px;
                    background: rgb(247,248,252);
                    border-radius:5px;
                }
            }
            .person-info{
                text-align:left;
                padding-bottom:20px;
                position: relative;
                .title{
                    padding:10px 0;
                    font-weight: bold;
                }
                .tags{
                    display:inline-block;
                    border: 1px solid @light-blue;
                    color: @light-blue;
                    border-radius: 5px;
                    padding: 2px 3px;
                    font-size: 12px;
                    margin:5px 5px 0 0;
                }
                .information{
                    padding-right:30px;
                    position:relative;
                    text-align: justify;
                }
                .close{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: box;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                }
                .expend-btn{
                    position: absolute;
                    right:10px;
                    bottom:18px;
                    color:@light-blue;
                }
            }
        }
    }   
    .close-state{
        height:~'calc(100vh - 185px)';
    }
</style>
