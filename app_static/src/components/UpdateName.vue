<template>
<div class="update-name-container">
  <div class="input">
    <input type="text" v-model="content" :maxlength="maxlength">
    <div class="close" @click="deleteAll"></div>
    <div class="confirm" @click="confirm"></div>
  </div>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component, Prop, Watch} from 'vue-property-decorator';

@Component
export default class UpdateName extends Vue{
  @Prop({type:String,default:''})
  private name:string
  @Prop({type:Number,default:15})
  private maxlength:number
  private content:string = ""
  deleteAll(){
    this.content = '';
  }
  confirm(){
    this.$emit('changeContent',this.content)
  }
  mounted(){
    this.content = this.name
  }
}
</script>
<style lang="less" scoped>
@mainColor:#00D1CF;
.update-name-container{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  background:#fff;
  .input{
    width:100%;
    margin:2rem auto;
    border-top:.1rem solid #d2d2d2;
    border-bottom:.1rem solid #d2d2d2;
    display: flex;
    input{
      flex:1;
      height:4rem;
      line-height: 4rem;
      border:none;
      appearance: none;
      text-indent:.6rem;
    }
    .close{
      width:4rem;
      height:4rem;
      line-height: 4rem;
      background:url(../../static/images/baseInfo/close.png) no-repeat center;
      background-size:2rem;
    }
    .confirm{
      width:4rem;
      height:4rem;
      line-height: 4rem;
      background:url(../../static/images/baseInfo/confirm.png) no-repeat center;
      background-size:2rem;
    }
  }
}
</style>
