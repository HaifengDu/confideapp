<template>
<div class="seek-help-container">
  <div class="search"></div>
  <div class="tab">
    <div class="tab-bar">
      <div class="tab-item" :class="{'active':item.labelid==curTab}" v-for="item in tabs" :key="item.labelid" @click="changeTab(item)">{{item.text}}</div>
    </div>
  </div>
  <div class="lists" @scroll="getMore">
    <ListItem v-for="item in 6" :key="item" v-if="item<3"></ListItem>
    <div class="tip-list">
      <div class="text">遇到烦心事，说不出口的隐私事怎么办？快来这里发布求助吧，千万倾听者为您指明人生道路</div>
      <div class="btns">
        <div class="help">我要求助</div>
        <div class="rule">求助说明</div>
      </div>
    </div>
    <ListItem v-for="item in 6" :key="item"v-if="item>2"></ListItem>
  </div>
  <div class="fixed-btns" :class="{'hide':!btnShow,'show':btnShow}">
    <div class="item publish">求助</div>
    <div class="item published">我的</div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from "lodash"
import {Component} from "vue-property-decorator";
import ListItem from '../../components/HelpItem.vue'
@Component({
  components:{
    ListItem
  }
})
export default class SeekHelp extends Vue{
  private btnShow = true
  private curTab:number = 0
  private tabs = [{
      text:'全部',
      labelid:0
    },{
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
    },{
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
  changeTab(item:any){
    this.curTab = item.labelid
  }
  getMore=_.debounce(()=>{
    this.btnShow = false
    var btnTimer = setTimeout(() => {
      clearTimeout(<any>btnTimer)
      this.btnShow = true
    }, 2000);
  },1000)
}
</script>

<style lang="less" scoped>
@import "../../assets/common.less";
.seek-help-container{
  height:100vh;
  background:#f5f5f5;
  overflow: hidden;
  .tab{
    width:100%;
    overflow-y: auto;
    background:#fff;
    .tab-bar{
      height:4rem;
      display:flex;
      width:80rem;
      .tab-item{
        width:8rem;
        line-height: 4rem;
        &.active{
          color:@mainColor;
        }
      }
    }
  }
  .lists{
    height:~'calc(100% - 5rem)';
    overflow: auto;
    .tip-list{
      background:#fff;
      margin-top:1rem;
      padding:2rem 0;
      .text{
        font-size:1.3rem;
        color:#777;
      }
      .btns{
        display: flex;
        justify-content: space-around;
        margin-top:2rem;
        div{
          width:9rem;
          height:3rem;
          line-height: 3rem;
          border-radius:.8rem;
          border:1px solid #d3d3d3;
          &.help{
            border:1px solid @mainColor;
            color:@mainColor;
          }
        }
      }
    }
  }
  .fixed-btns{
    height:9rem;
    width:4rem;
    position:fixed;
    right:1rem;
    bottom:10rem;
    display: flex;
    flex-direction: column;
    &.hide{
      right:-4rem;
      animation:moveRight 2s 0s ease;
    }
    &.show{
      right:1rem;
      animation:moveLeft 2s 0s ease;
    }
    .item{
      height:4rem;
      line-height: 4rem;
      border-radius:50%;
      background:@mainColor;
      color:#fff;
    }
    .publish{
      margin-bottom:.5rem;
    }
  }
}
@keyframes moveRight {
  from{
    right:1rem;
  }
  to{
    right:-4rem;
  }
}
@keyframes moveLeft {
  from{
    right:-4rem;
  }
  to{
    right:1rem;
  }
}
</style>

