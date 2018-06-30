<template>
<div class="bind-container">
  <div class="phone"></div>
  <div class="already" v-if="bind">
    <div class="text">您已绑定手机：15366666666</div>
    <div class="update" @click="updateNum">更换手机号</div>
  </div>
  <div class="unbind" v-else>
    <div class="input">
      <div class="icon num"></div>
      <input type="text" placeholder="输入手机号码">
      <div class="code-button" @click="getCode">获取验证码</div>
    </div>
    <div class="input">
      <div class="icon code"></div>
      <input type="text" placeholder="输入验证码">
    </div>
  </div>
  <div class="tip">您的手机号将受到隐私保护</div>
  <div class="button" @click="goBaseInfo">下一步</div>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import Service from '../../api/BaseInfoService'
@Component({
  methods:{
    ...mapActions({
      getCheckCode:'getCheckCode'
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
  private BaseInfoService = Service.getInstance()
  goBaseInfo(){
    if((<any>this).user&&(<any>this).user.phone){
      this.bind = true
    }
    this.$router.push({path:'/baseInfo'})
  }
  created(){
    document.title = "手机号绑定"
    if((<any>this).user&&(<any>this).user.phone){
      this.bind = true
    }
  }
  getCode(){
    // BaseInfoService.
  }
  updateNum(){
    this.bind = true
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
      width:10rem;
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
    height:4rem;
    line-height: 4rem;
    border-radius:.5rem;
    background:@mainColor;
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

