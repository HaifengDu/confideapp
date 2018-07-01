<template>
<div class="bind-container">
  <div class="phone"></div>
  <div class="already" v-if="bind">
    <div class="text">您已绑定手机：{{phone}}</div>
    <div class="update" @click="updateNum">更换手机号</div>
  </div>
  <div class="unbind" v-else>
    <div class="input">
      <div class="icon num"></div>
      <input type="text" placeholder="输入手机号码" v-model="phone">
      <div class="code-button" @click="getCodeMethod">{{checkText}}</div>
    </div>
    <div class="input">
      <div class="icon code"></div>
      <input type="text" placeholder="输入验证码" v-model="code">
    </div>
  </div>
  <div class="tip">您的手机号将受到隐私保护</div>
  <mt-button class="button" type="primary" size="large" @click="goBaseInfo">下一步</mt-button>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from 'vue-property-decorator';
import {INoopPromise} from '@/util/methods';
import { mapActions, mapGetters } from 'vuex';
// import Service from '../../api/BaseInfoService'
@Component({
  methods:{
    ...mapActions({
      getCode:'my/getCode',
      bindPhone:'my/bindPhone',
      updatePhone:'my/updatePhone'
    })
  },
  computed:{
    ...mapGetters({
      user:'user'
    })
  }
})
export default class BindPhone extends Vue{
  private bind = false
  private phone = ''
  private code = ''
  private checkText = "输入验证码";
  private ispendding = false;
  // private BaseInfoService = Service.getInstance()
  goBaseInfo(){
    if(this.bind){
      this.$router.push({path:'/baseInfo'});
    }
    if(this.phone&&this.code){
      (<any>this).bindPhone({code:this.code,phone:this.phone}).then((res:any) => {
        if(res.data.success){
          (<any>this).updatePhone(this.phone);
          this.$router.push({path:'/baseInfo'});
        }
      });
    }
  }
  created(){
    document.title = "手机号绑定"
    if((<any>this).user&&(<any>this).user.phone){
      this.bind = true;
      this.phone = (<any>this).user.phone;
    }
  }
  private getCode:INoopPromise;
  private changeText(num:number){
    if(num>=60){
      this.checkText = "输入验证码";
      return;
    }
    this.checkText = `剩余${60-num}秒`;
  }
  getCodeMethod(){
    if(this.ispendding){
      return;
    }
    this.ispendding = true;
    this.getCode(this.phone).then(res=>{
      const data = res.data;
      debugger;
      if(data.success){
        let num = 0;
        const timer = setInterval(()=>{
          if(num>60){
            clearInterval(timer);
            this.ispendding = false;
            return;
          }
          num++;
          this.changeText(num);
        },1000);
      }else{
        this.ispendding = false;
      }
    },err=>{
      this.ispendding = false;
    }).catch(()=>{
      this.ispendding = false;
    })
  }
  updateNum(){
    this.bind = false
  }
}
</script>
<style lang="less" scoped>
@mainColor:#00D1CF;
@color:#333;
.fs(@size){
  font-size: @size;
}
.bind-container{
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .fs(1.4rem);
  color:@color;
  .phone{
    height:10rem;
    width:10rem;
    margin-top:5rem;
    border:2px solid #666;
    border-radius:50%;
    background:url(/static/images/bindPhone/phone.png) no-repeat center;
    background-size:6rem;
  }
  .already{
    width:80%;
    display:flex;
    justify-content: flex-start;
    height:4rem;
    line-height: 4rem;
    margin-top:2rem;
    .text{
      flex:1;
      text-align: left;
    }
    .update{
      width:7rem;
      color:@mainColor;
    }
  }
  .unbind{
    height:8rem;
    width:80%;
    .input{
      display: flex;
      width:100%;
      border-bottom:1px solid #d2d2d2;
      height:4rem;
      line-height: 4rem;
      .icon{
        width:2.2rem;
        height:4rem;
        &.num{
          background:url(/static/images/bindPhone/num.png) no-repeat center;
          background-size:1.8rem;
        }
        &.code{
          background:url(/static/images/bindPhone/code.png) no-repeat center;
          background-size:2.5rem;
        }
      }
      .code-button{
        width:10rem;
        height:4rem;
        line-height: 4rem;
      }
      input{
        width:70%;
        height:4rem;
        line-height: 4rem;
        border:none;
        flex:1;
        margin-left:.5rem;
      }
    }
  }
  .button{
    width:80%;
    color:#fff;
  }
  .tip{
    width:73%;
    text-align: left;
    padding-left:7%;
    height:5rem;
    line-height:5rem;
    .fs(1.2rem);
    background:url(/static/images/bindPhone/tip.png) no-repeat left;
    background-size: 1.5rem;
    color:#aaa;
    background-position: .3rem;
  }
}
</style>

