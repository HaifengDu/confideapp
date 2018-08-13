<template>
<div class="home-container">
  <div class="search">
    <div class="input" @click="toSearchPanel">
      <div class="icon"></div>
      搜索倾听者/话题
    </div>
    <div @click="toSearchFilter" class="button"></div>
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
      <div class="lists" v-for="(item1,i) in subjects" :key="i">
        <div class="list" v-for="(item,j) in item1.list" :key="j" @click="toList(item)">
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
      <list-item :listener="item" v-for="(item,idx) in list" :key="idx"></list-item>
    </div>
  </div>
</div>

</template>
<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import ListItem from '@/components/ListItem'
import HomeService from "../api/HomeService";
import { mapGetters, mapActions } from 'vuex';
import { ESex } from '../enum/ESex';
import { IListener } from '../interface/model/IListener';
import RecommendService from '../api/RecommendService'
import { IRecommend } from '../interface/IRecommend';
import { INoop } from '../util/methods';

@Component({
  components:{
    ListItem
  },
  computed:{
    ...mapGetters({
      user:'user'
    })
  },
  methods:{
    ...mapActions({
      updateLableId:'list/updateLableId'
    })
  }
})
export default class Home extends Vue{
  private homeService = HomeService.getInstance();
  private RecommendService = RecommendService.getInstance()
  private updateLableId:INoop
  toSearchFilter(){
    this.$router.push({
      path:"/searchFilter"
    })
  }
  toSearchPanel(){
    this.$router.push({
      path:"/searchPanel"
    })
  }
  private list:IListener[] = [];
  private summaryOpen = false;
  private esex = ESex;
  private subjects = [{
    list:[{
      text:'情感挽回',
      icon:'redeem',
      labelid:1
    },{
      text:'催眠',
      icon:'hypnosis',
      labelid:3
    },{
      text:'抑郁',
      icon:'depressed',
      labelid:5
    },{
      text:'婚姻关系',
      icon:'marriage',
      labelid:7
    },{
      text:'心理咨询',
      icon:'psychological',
      labelid:76
    }]
  },{list:[{
    text:'两性关系',
    icon:'sexual',
    labelid:2
  },{
    text:'人际关系',
    icon:'interpersonal',
    labelid:4
  },{
    text:'同性恋情',
    icon:'homosexuality',
    labelid:6
  },{
    text:'个人成长',
    icon:'growth',
    labelid:8
  },{
    text:'情绪疏导',
    icon:'emotional-guidance',
    labelid:75
  }]
  }]
  summarySwitch(){
    this.summaryOpen = !this.summaryOpen
  }
  getSummeryDatas(lids:number[]){
    this.RecommendService.getSummeryDatas(lids).then(res => {
      if(res.data.success){
        this.assignData(this.list,res.data.data)
      }
    })
  }
  assignData(listeners:IListener[],summarys:IRecommend[]){
    listeners.forEach(item => {
      let idx = summarys.findIndex(sum => sum.lid == item.uid)
      if(idx>-1){
        item.ucount = summarys[idx].ucount
        item.stime = summarys[idx].stime
      }
    });
  }
  toList(item:any){
    (<any>this).updateLableId(item.labelid)
    this.$router.push({
      path:'/list'
    })
  }
  created() {
    this.homeService.getRecommendList().then(res=>{
      const data = res.data;
      if(data.success){
        data.data.forEach(item => {
          item.ucount = 0
          item.stime = 0
        })
        this.list = data.data;
        const lids = data.data.map(item=>item.uid as number)
        this.getSummeryDatas(lids)
      }
    })
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
      background:#f5f5f5;
    }
  }
}
</style>


