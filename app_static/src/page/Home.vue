<template>
<div class="home-container">
  <div class="search">
    <div class="input">
      <div class="icon"></div>
      搜索倾听者/话题
    </div>
    <div class="button"></div>
  </div>
  <div class="banner">
    <mt-swipe :auto="4000">
      <mt-swipe-item>
        <img src="../../static/images/home/banner1.png" alt="">
      </mt-swipe-item>
      <mt-swipe-item>
        <img src="../../static/images/home/banner2.png" alt="">
      </mt-swipe-item>
      <mt-swipe-item>
        <img src="../../static/images/home/banner1.png" alt="">
      </mt-swipe-item>
      <mt-swipe-item>
        <img src="../../static/images/home/banner2.png" alt="">
      </mt-swipe-item>
    </mt-swipe>
  </div>
  <div class="content">
    <div class="subject">
      <div class="lists" v-for="item1 in subjects">
        <div class="list" v-for="item in item1.list">
          <div class="icon"></div>
          <div class="text">{{item.text}}</div>
        </div>
      </div>
    </div>
    <div class="comments">
      <mt-swipe :auto="6000" :show-indicators="false">
        <mt-swipe-item>阳光下：🙇‍💗😀</mt-swipe-item>
        <mt-swipe-item>美丽的佩奇：哈哈哈</mt-swipe-item>
        <mt-swipe-item>尚小牛：good morning</mt-swipe-item>
        <mt-swipe-item>南栀倾寒：hello everyone</mt-swipe-item>
      </mt-swipe>
    </div>
    <div class="spread">
      <div class="lists">
        <div class="list">
          <div class="detail">
            <div class="icon-container">
              <div class="icon">
                <user-icon size="6.4"  :user="user"></user-icon>
              </div>
              <div :class="['sex',{'female':user.sex=esex.Famale}]">男  35</div>
              <div class="exprience" :class="{'female':user.sex=esex.Famale}">经历</div>
            </div>
            <div class="info-container">
              <div class="item name">
                <div class="text">小猪佩奇</div>
                <div class="auth"></div>
              </div>
              <div class="item times">
                <div class="time">月售12345小时</div>
                <div class="comment">收到评价4321条>></div>
              </div>
              <div class="info">
                <div class="items job">培训师</div>
                <div class="items family">单身</div>
                <div class="items edu">博士</div>
                <div class="items star">射手座</div>
              </div>
              <div class="tags">
                <div class="tag" v-for="(item,index) in 3" :key="index">情感挽回</div>
              </div>
            </div>
          </div>
          <div class="summary" :class="{'max':summaryOpen}" @click="summarySwitch">
            <div class="content">个人简介：哈哈哈是小狗🐕🐱🐥🐷哈哈哈是小狗🐕🐱🐥🐷哈哈哈是小狗🐕🐱🐥🐷哈哈哈是小狗🐕🐱🐥🐷哈哈哈是小狗🐕🐱🐥🐷</div>
            <div class="switch" v-if="!summaryOpen">展开</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</template>
<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import UserIcon from '@/components/UserIcon'
import { mapGetters } from 'vuex';
import { ESex } from '../enum/ESex';

@Component({
  components:{
    UserIcon
  },
  computed:{
    ...mapGetters({
      user:'user'
    })
  }
})
export default class Home extends Vue{
  private summaryOpen = false;
  private esex = ESex;
  private subjects = [{
    list:[{
      text:'情感挽回',
      icon:'redeem'
    },{
      text:'催眠',
      icon:'hypnosis'
    },{
      text:'抑郁',
      icon:'depressed'
    },{
      text:'婚姻关系',
      icon:'marriage'
    },{
      text:'心理咨询',
      icon:'psychological'
    }]
  },{list:[{
    text:'两性关系',
    icon:'sexual'
  },{
    text:'人际关系',
    icon:'interpersonal'
  },{
    text:'同性恋情',
    icon:'homosexuality'
  },{
    text:'个人成长',
    icon:'growth'
  },{
    text:'情绪疏导',
    icon:'emotional-guidance'
  }]
  }]
  summarySwitch(){
    this.summaryOpen = !this.summaryOpen
  }
}

</script>
<style lang="less" scoped>
@import '~@/assets/common.less';
.home-container{
  padding-top:.3rem;
  .search{
    display: flex;
    padding-left:1rem;
    .input{
      flex:1;
      height:3.2rem;
      line-height: 3.2rem;
      background:#f3f3f3;
      border-radius:1.6rem;
      display:flex;
      .fs(1.3rem);
      color:#999;
      align-items:center;
      .icon{
        width:3.2rem;
        height:3.2rem;
        background:url(../../static/images/home/search.png) no-repeat center;
        background-size: 1.4rem;
      }
    }
    .button{
      width:5rem;
      height:3.2rem;
      background:url(../../static/images/home/aim.png) no-repeat center;
      background-size:2.5rem;
    }
  }
  .banner{
    height:10rem;
    margin-top:1rem;
    .mint-swipe-item{
      img{
        height:10rem !important;
        width:100%;
      }
    }
  }
  .content{
    .subject{
      .lists{
        display: flex;
        justify-content: space-around;
        padding:1rem 0;
        .list{
          flex:1;
          height:5rem;
          display:flex;
          flex-direction: column;
          align-items: center;
          .icon{
            width:4rem;
            height:4rem;
          }
          .text{
            .fs(1.3rem);
            height:2rem;
            line-height: 2rem;
            text-align:center;
          }
        }
      }
    }
    .comments{
      height:3.2rem;
      line-height: 3.2rem;
      overflow: hidden;
      background:#f5f5f5;
      width:95%;
      margin:0 auto;
      border-radius:1.6rem;
      margin-bottom:1rem;
      .mint-swipe-item{
        .fs(1.3rem);
      }
    }
    .spread{
      border-top:1px solid @borderColor;
      border-bottom:1px solid @borderColor;
      padding:1rem 1rem 0 1rem;
      .list{
        display:flex;
        flex-direction: column;
        .detail{
          border-bottom:1px solid @borderColor;
          max-height:16rem;
          min-height:13rem;
          display:flex;
          .icon-container{
            width:7rem;
            display:flex;
            flex-direction: column;
            position:relative;
            .icon{

            }
            .sex{
              width:4rem;
              height:1.8rem;
              line-height:2rem;
              border-radius:1rem;
              position:absolute;
              right:0;
              top:5rem;
              color:#fff;
              background:#67caff;
              .fs(1.2rem);
              .femal{
              	background: #ff746f;
              }
            }
            .exprience{
              width:4rem;
              height:2rem;
              line-height:2rem;
              border-top-left-radius:1rem;
              border-bottom-right-radius:1rem;
              margin-top:2rem;
              .fs(1.5rem);
              background:#67caff;;
              color:#fff;
              margin-left:1.5rem;
              .femal{
              	background: #ff746f;
              }
            }
          }
          .info-container{
            flex:1;
            margin-left:1rem;
            *{
              .fs(1.3rem);
              color:#999;
            }
            .item{
              display: flex;
              height:3rem;
              line-height: 3rem;
            }
            .name{
              .text{
                .fs(1.5rem);
                color:#111;
              }
              .auth{
                width:5rem;
                height:3rem;
                background:url(../../static/images/home/authentication.png) no-repeat center;
                background-size:5rem;
                margin-left:1rem;
              }
            }
            .times{
              .comment{
                margin-left:2rem;
              }
            }
            .info{
              display:flex;
              height:1.6rem;
              line-height: 1.6rem;
              margin:.3rem 0;
              .items{
                padding:0 1rem;
                border-right:1px solid #999;
              }
              :first-child{
                padding-left:0;
              }
              :last-child{
                border:none;
              }
            }
            .tags{
              display: flex;
              flex-wrap: wrap;
              align-items:center;
              min-height:4rem;
              margin-bottom:1rem;
              .tag{
                height:1.6rem;
                line-height: 1.6rem;
                padding:0 .3rem;
                margin:.2rem .4rem .2rem 0;
                color:@mainColor;
                border:1px solid @mainColor;
                border-radius: .8rem;
              }
            }
          }
        }
        .summary{
          height:3rem;
          display: flex;
          overflow: hidden;
          &.max{
            height:auto;
          }
          .content{
            flex:1;
            line-height:3rem;
            text-align:left;
          }
          .switch{
            width:5rem;
            height:3rem;
            line-height: 3rem;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>


