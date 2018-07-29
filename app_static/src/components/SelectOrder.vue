<template>
<div class="order-container">
  <div class="bg-cover"></div>
  <div class="content">
    <div class="header">
      <div class="name">{{toUser.nickname}}</div>
      <user-icon size="4" :user="toUser"></user-icon>
    </div>
    <div class="body">
      <div class="tab">
        <div class="item" :class="{'active':curTab==2}" @click="changeTab(2)">通话</div>
        <div class="item" :class="{'active':curTab==1}" @click="changeTab(1)">文字</div>
      </div>
      <div class="list">
        <div class="name">单价</div>
        <div class="price">{{phonePrice.taxprice}}/分钟</div>
      </div>
      <div class="list">
        <div class="name">时长</div>
        <div class="price">
         <el-input-number v-model="base" :step="15*curStep" size="mini" :min="15" :max="720" @change="watchChange"></el-input-number>
          分钟</div>
      </div>
      <div class="tip">该订单为{{curTab==1?'文字':'通话'}}订单，将以{{curTab==1?'文字':'通话'}}形式进行服务。</div>
    </div>
    <div class="bottom">
      <div class="total">合计:<span class="orange">￥9.90</span></div>
      <div class="button">确认下单</div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Model, Watch} from "vue-property-decorator";
import UserIcon from '@/components/UserIcon';
import EChatType from '../enum/EChatType';
import { EPriceStatus } from '../enum/EPriceStatus';
import { EPriceType } from '../enum/EPriceType';
@Component({
  components:{
    UserIcon
  }
})
export default class SelectOrder extends Vue {
  @Prop({
    type:Object,
    default:""
  })
  private toUser:any;
  private wordTime:any[] = [];
  private phonePrice:any = {};
  private curTab:EChatType = 2;
  private base = 15;
  private curStep:any = null;
  private wordPriceStepIndex = 0;/*计算步长  当前index*/
  changeTab(tab:EChatType){
    (<any>this.curTab) = tab
  }
  watchChange(e:any){
    console.error(e)
  }
  compStep(){
    if(this.wordPriceStepIndex==this.wordTime.length-1){
      this.curStep = 0;
    }else{
      this.curStep = this.wordTime[this.wordPriceStepIndex+1].timecircle-this.wordTime[this.wordPriceStepIndex].timecircle;
    }
  }
  created(){
    this.toUser&&this.toUser.pricesettings&&this.toUser.pricesettings.forEach((item:any) => {
      if(item.status===EPriceStatus.Enable){
        if(item.type===EPriceType.EWord){
          this.wordTime.push(item);
          this.wordTime.sort((a,b)=>b-a)
          this.base = this.wordTime[0];

        }else if(item.type===EPriceType.ECall){
          this.phonePrice = item;
        }
      }
    });
  }

}
</script>

<style lang="less" scoped>
@import "../assets/common.less";
.order-container{
  width:100%;
  height:100%;
  position:fixed;
  top:0;
  right:0;
  bottom:0;
  left:0;
  z-index:1;
  font-size:1.4rem;
  color:#666;
  .bg-cover{
    background:#000;
    opacity: .5;
    position:fixed;
    top:0;
    right:0;
    bottom:0;
    left:0;
    z-index:1;
  }
  .content{
    width:100%;
    position:absolute;
    bottom:0;
    left:0;
    background:#fff;
    z-index:2;
    .header{
      height:5rem;
      background:#f5f5f5;
      display:flex;
      align-items:center;
      /deep/ .fbui-user-icon{
        width:4rem;
        margin:-4rem 1rem 0 2rem;
      }
      .name{
        flex:1;
        text-align: right;
      }
    }
    .body{
      .tab{
        height:4rem;
        line-height: 4rem;
        display:flex;
        border:1px solid #f3f3f3;
        .item{
          flex:1;
          margin:0 1rem;
        }
        .active{
          color:@mainColor;
          border-bottom:2px solid @mainColor;
        }
      }
      .list{
        display:flex;
        height:4rem;
        line-height: 4rem;
        margin:0 1rem;
        border-bottom:1px solid #f3f3f3;
        .name{
          width:5rem;
          text-align:left;
        }
        .price{
          flex:1;
          text-align: right;
        }
      }
      .tip{
        color:#999;
        margin-left:1rem;
        text-align:left;
      }
    }
    .bottom{
      height:4rem;
      line-height: 4rem;
      border-top:1px solid #f3f3f3;
      display:flex;
      margin-left:1rem;
      .total{
        flex:1;
        text-align: left;
        .orange{
          color:#FF7A00;
        }
      }
      .button{
        width:8rem;
        background:#FF7A00;
        color:#fff;
      }
    }
  }
}


</style>

