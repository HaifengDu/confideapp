<template>
  <div class="my-container">
    <div v-show="!isget">
      <mt-field placeholder="请输入微信id" v-model="wxid"></mt-field>
      <mt-button class="button" @click="getUser">获取用户</mt-button>
    </div>
    <div v-show="isget">
      <div class="info">
        <div class="bg"></div>
        <div class="detail" @click="goBaseInfo"></div>
        <div class="main">
          <div class="icon">
            <img :src="user.headimgurl" alt="">
          </div>
          <div class="nick-name">{{user.nickname}}</div>
          <div class="follows">
            <div class="follow" @click="toFollow">关注<span class="num">10w+</span></div>
            <div class="like" @click="toVisitor">访客<span class="num">666</span></div>
          </div>
        </div>
      </div>
      <div class="entrance">
        <div class="ul" v-bind:key="index" v-for="(ele,index) in entranceArr">
          <div class="li" v-bind:key="index" v-for="(item,index) in ele.children">
            <div class="icon"><img :src="item.imgUrl" alt=""></div>
            <div class="text">{{item.text}}</div>
          </div>
        </div>
      </div>
      <div class="lists">
        <div class="list" v-if="user.role===0" @click="applyListener">
          <mt-cell title="申请倾听者">
            <i class="mint-cell-allow-right"></i>
            <img slot="icon" src="static/images/my/listener.png" width="24" height="24">
          </mt-cell>
        </div>
        <div class="list" v-if="user.role===1" @click="listenerSetting">
          <mt-cell title="倾听者设置">
            <i class="mint-cell-allow-right"></i>
            <img slot="icon" src="static/images/my/listener.png" width="24" height="24">
          </mt-cell>
        </div>
        <div class="list">
          <mt-cell title="分享赚现金">
            <i class="mint-cell-allow-right"></i>
            <img slot="icon" src="static/images/my/share.png" width="24" height="24">
          </mt-cell>
        </div>
      </div>
      <div class="lists">
        <div class="list">
          <mt-cell title="关于我们">
            <i class="mint-cell-allow-right"></i>
            <img slot="icon" src="static/images/my/about.png" width="24" height="24">
          </mt-cell>
        </div>
        <div class="list">
          <mt-cell title="常见问题">
            <i class="mint-cell-allow-right"></i>
            <img slot="icon" src="static/images/my/matter.png" width="24" height="24">
          </mt-cell>
        </div>
        <div class="list">
          <mt-cell title="客服电话">
            <i class="mint-cell-allow-right"></i>
            <img slot="icon" src="static/images/my/phone.png" width="24" height="24">
          </mt-cell>
        </div>
        <div class="list">
          <mt-cell title="意见反馈">
            <i class="mint-cell-allow-right"></i>
            <img slot="icon" src="static/images/my/advice.png" width="24" height="24">
          </mt-cell>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
// import MyService from "../../api/UserService";
import { mapActions, mapGetters } from 'vuex';
import { INoopPromise } from '../../util/methods';
import {EFollowType} from "../../enum/EFollowType.ts";
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
  }
})
export default class My extends Vue{
  //TODO:正式删掉
  private isget = false;
  private wxid="oRtVK09SoIKSYUYqP3RHV2aOyHr8";
  private entranceArr:any[] = [
    {
        children:[
          {
            imgUrl:'static/images/my/publish.png',
            text:'我的发布',
            id:'publish'
          },
          {
            imgUrl:'static/images/my/message.png',
            text:'互动消息',
            id:'message'
          },
          {
            imgUrl:'static/images/my/encourage.png',
            text:'评价',
            id:'encourage'
          }
          // {
          //   imgUrl:'static/images/my/activity.png',
          //   text:'活动',
          //   id:'activity'
          // }
        ]
    },
    {
        children:[
        {
          imgUrl:'static/images/my/purse.png',
          text:'钱包',
          id:'purse'
        },
        {
          imgUrl:'static/images/my/charge.png',
          text:'充值',
          id:'charge'
        },
        {
          imgUrl:'static/images/my/order.png',
          text:'订单',
          id:'order'
        }
        // {
        //   imgUrl:'static/images/my/card.png',
        //   text:'优惠券',
        //   id:'card'
        // }
        ]
    }
  ];
  // private service = MyService.getInstance();
  applyListener(){
    //TODO:要改为中间页
    this.$router.push({path:'/bindPhone'})
  }
  listenerSetting(){
    this.$router.push({path:"/listenerSettings"});
  }
  goBaseInfo(){
    this.$router.push({path:'/baseInfo',query:{from:"my"}})
  }
  toFollow(){
    this.$router.push({path:'/follow',query:{type:String(EFollowType.Follow)}});
  }
  toVisitor(){
    this.$router.push({path:'/follow',query:{type:String(EFollowType.Visitor)}});
  }
  getUser(){
    this.getUserInfo(this.wxid).then(res=>{
      const data = res.data;
      if(!data.success){
        this.$toast(data.message);
      }else{
        this.isget = true;
      }
    });
  }
  created(){
    document.title = "我的";
    // this.getUserInfo('oRtVK06i1JN_GkUA5NPk7pXzOJ3s').then(res=>{
    //   const data = res.data;
    //   if(!data.success){
    //     this.$toast(data.message);
    //   }
    // });
  }

  private getUserInfo:INoopPromise;
}

</script>
<style lang="less" scoped>
@import '~@/assets/common.less';
.my-container{
  height:100%;
  width:100%;
  display: flex;
  flex-direction: column;
  background: @bg;
  color:@color;
  .info{
    height:18rem;
    width:100%;
    background:#fff;
    position:relative;
    .bg{
      height:11rem;
      width:100%;
      border-bottom-right-radius:2.5rem;
      border-bottom-left-radius:2.5rem;
      background:@mainColor;
    }
    .detail{
      height:3rem;
      width:3rem;
      position: absolute;
      top:1rem;
      right:15%;
      background:url(/static/images/my/detail.png) no-repeat center;
      background-size: 3rem;
      z-index:2;
    }
    .main{
      height:18rem;
      width:80%;
      position:absolute;
      background-color:#fff;
      top:0;
      left:10%;
      box-shadow:2px 2px 3px 3px rgba(0,0,0,0.1);
      border-radius:.6rem;
      display: flex;
      flex-direction: column;
      align-items:center;
      justify-content: center;
      .icon{
        height:6rem;
        width:6rem;
        border-radius: 50%;
        overflow: hidden;
        img{
          height:6rem;
          width:6rem;
        }
      }
      .nick-name{
        width:16rem;
        height:3rem;
        line-height: 3rem;
        .fs(1.6rem);
        overflow:hidden;
      }
      .follows{
        width:100%;
        height:4rem;
        line-height: 4rem;
        display: flex;
        justify-content: space-around;
        .fs(1.3rem);
        .num{
          color:@mainColor;
          margin-left:.5rem;
        }
        .follow{
          flex:1;
        }
        .like{
          flex:1;
        }
      }
    }
  }
  .entrance{
    width:100%;
    height:18rem;
    display: flex;
    flex-direction: column;
    background:#fff;
    .ul{
      height:9rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .li{
        flex:1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height:9rem;
        .icon{
          width: 100%;
          height: 6rem;
          overflow: hidden;
          img{
            margin-top:2.5rem;
            height:3rem;
            width:3rem;
          }
        }
        .text{
          height:3rem;
          line-height: 3rem;
          .fs(1.3rem);
        }
      }
    }
  }
  .lists{
    margin-top:1rem;
    background:#fff;
    .list{
      text-align: left;
      // border-bottom: 1px solid #ccc;
      margin-left:1rem;
      .fs(1.3rem);
      &:last-child{
        .mint-cell{
          border:none;
        }
      }
    }
  }
}
</style>


