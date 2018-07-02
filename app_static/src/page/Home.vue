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
      <mt-swipe-item>1</mt-swipe-item>
      <mt-swipe-item>2</mt-swipe-item>
      <mt-swipe-item>3</mt-swipe-item>
      <mt-swipe-item>4</mt-swipe-item>
    </mt-swipe>
  </div>
  <div class="content">
    <div class="subject">
      <div class="lists">
        <div class="list" v-for="item in 5">
          <div class="icon"></div>
          <div class="text">情感挽回</div>
        </div>
      </div>
    </div>
  </div>
</div>

</template>
<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

@Component
export default class Home extends Vue{

}

</script>
<style lang="less" scoped>
@import '~@/assets/common.less';
.home-container{
  padding-top:.3rem;
  font-size:1.3rem;
  color:#999;
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
  }
  .content{
    .subject{
      .lists{
        display: flex;
        justify-content: space-around;
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
            .fs(1.2rem);
            height:2rem;
            line-height: 2rem;
            text-align:center;
          }
        }
      }
    }
  }
}
</style>


