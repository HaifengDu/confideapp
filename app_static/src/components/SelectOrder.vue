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
        <div class="price">{{curTab==1?word.taxprice:phone.taxprice}}/分钟</div>
      </div>
      <div class="list">
        <div class="name">时长</div>
        <div class="price">
          <el-input-number v-if="curTab==1" v-model="wordbase" :step="15" size="mini" :min="word.timecircle*15" :max="720"></el-input-number>
          <el-input-number v-else v-model="phonebase" :step="15" size="mini" :min="phone.timecircle*15" :max="720"></el-input-number>
          分钟
        </div>
      </div>
      <div class="tip">该订单为{{curTab==1?'文字':'通话'}}订单，将以{{curTab==1?'文字':'通话'}}形式进行服务。</div>
    </div>
    <div class="bottom">
      <div class="total">合计:<span class="orange">￥{{curTab==1?wordbase*word.taxprice:phonebase*phone.taxprice}}</span></div>
      <div class="button" @click="preOrder">确认下单</div>
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
import { IPriceSetting } from '../interface/model/IPriceSetting';
import { IUser } from '../interface/model/IUser';
import { mapActions } from 'vuex';
import { INoop } from '../util/methods';
@Component({
  components:{
    UserIcon
  },
  methods:{
    ...mapActions({
      updatePreOrder:"order/updatePreOrder"
    })
  }
})
export default class SelectOrder extends Vue {
  @Prop({
    type:Object,
    default:""
  })
  private toUser:IUser;
  private curTab:EChatType = 2;
  private word:IPriceSetting = {};
  private phone:IPriceSetting = {};
  private max = 720;
  private wordbase = 0;
  private phonebase = 0;
  @Watch('toUser')
  ontoUserchanged(n:any,o:any){
    this.toUser&&this.toUser.pricesettings&&this.toUser.pricesettings.forEach((item:any) => {
      if(item.status===EPriceStatus.Enable){
        if(item.type===EPriceType.EWord){
          this.word = item;
        }else if(item.type===EPriceType.ECall){
          this.phone = item;
        }
      }
    });
    this.wordbase = <number>this.word.timecircle*15
    this.phonebase = <number>this.phone.timecircle*15
  }
  changeTab(tab:EChatType){
    (<any>this.curTab) = tab
  }

  private updatePreOrder:INoop;
  preOrder(){
    // let time = this.curTab===1?this.base:this.phonebase;
    // let price = this.curTab===1?this.wordtotal:this.phonebase*<number>this.list.phone.taxprice;
    this.updatePreOrder({
      type:this.curTab,
      // time,
      // price
    })
  }
  created(){

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

