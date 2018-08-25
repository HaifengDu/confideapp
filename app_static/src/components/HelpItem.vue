<template>
<div class="list-item">
  <div class="top">
    <div class="icon">
      <UserIcon :user="user"></UserIcon>
    </div>
    <div class="middle">
      <div class="name">夏花灿烂</div>
      <div class="status open">可评论|已关闭</div>
    </div>
    <div class="money">66元</div>
  </div>
  <div class="content">
    此处是求助信息截取,此处是求助信息截取,此处是求助信息截取，此处是求助信息截取，此处是求助信息截取，此处是求助信息截取，此处是求助信息截取，此处是求助信息截取，此处是求助信息截取，此处是求助信息截取，此处是求助信息截取，此处是求助信息截取
  </div>
  <div class="accept-answer" v-if="from!='detail'">
    <div class="title">已采纳解答</div>
    <div class="text">
      <span class="lis-name">有独创性的人杰：</span>
      此处是个人信息
    </div>
  </div>
  <div class="bottom">
    <div class="people">66人回应</div>
    <div class="area"><span class="time" v-if="from=='detail'">6小时前</span>情感</div>
  </div>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component, Prop, Watch, Emit} from 'vue-property-decorator';
import UserIcon from '../components/UserIcon'
@Component({
  components:{
    UserIcon
  }
})
export default class HelpItem extends Vue{
  @Prop()
  private item:any
  @Prop()
  private from:string
  private user = {
    headimgurl:'',
    sex:0
  }
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.list-item{
  background:#fff;
  padding:0 1rem;
  margin-top:1rem;
  .top{
    height:5rem;
    line-height: 5rem;
    display: flex;
    align-items: center;
    .icon{
      width:4rem;
      padding-right:1rem;
    }
    .middle{
      flex:1;
      display:flex;
      flex-direction: column;
      div{
        height:2rem;
        line-height: 2rem;
        text-align: left;
      }
      .name{
        color:#333;
      }
      .status{
        font-size:1.3rem;
        color:#777;
        &.open{
          color:@mainColor;
        }
      }
    }
    .money{
      width:6rem;
      color:#F76B1C;
    }
  }
  .content{
    height:10rem;
    line-height:2.5rem;
    text-align: left;
    font-size:1.3rem;
    color:#777;
    overflow:hidden;
    text-overflow: ellipsis;
    display:-webkit-box;
    -webkit-line-clamp:4;
    -webkit-box-orient:vertical;
  }
  .accept-answer{
    background:#f5f5f5;
    padding:.5rem;
    div{
      text-align: left;
    }
    .title{
      color:@mainColor;
      font-size:1.4rem;
    }
    .text{
      max-height:4rem;
      line-height: 2rem;
      font-size: 1.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      color:#999;
      .lis-name{
        font-size:1.2rem;
        color:#777;
      }
    }
  }
  .bottom{
    height:3.4rem;
    line-height: 3.4rem;
    font-size:1.2rem;
    display: flex;
    justify-content: space-around;
    color:#aaa;
    div{
      flex:1;
      font-size:1.3rem;
    }
    .area{
      text-align: right;
    }
    .people{
      text-align: left;
    }
  }
}
</style>




