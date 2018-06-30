<template>
<div class="expirence-container">
  <div class="list">
    <mt-cell title="职业">
      <select v-model="area">
          <option :key="index" :value="item.code" v-for="(item,index) in areas">{{item.name}}</option>
      </select>
      <i class="mint-cell-allow-right"></i>
    </mt-cell>
  </div>
  <div class="list">
    <mt-cell title="家庭状况">
      <select v-model="area">
          <option :value="item.code" :key="index" v-for="(item,index) in areas">{{item.name}}</option>
      </select>
      <i class="mint-cell-allow-right"></i>
    </mt-cell>
  </div>
  <div class="list">
    <mt-cell title="最高学历">
      <select v-model="area">
          <option :value="item.code" :key="index" v-for="(item,index) in areas">{{item.name}}</option>
      </select>
      <i class="mint-cell-allow-right"></i>
    </mt-cell>
  </div>
  <div class="next" @click="goSelectTag">下一步</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from 'vue-property-decorator';
@Component
export default class Exprience extends Vue{
  private area = '110000';
  private areas:Array<{code:string,name:string}> = []
  goSelectTag(){
    this.$router.push({path:'/tag'})
  }
  created(){
    document.title = "经历"
  }
}
</script>

<style lang="less" scoped>
@bg:#f5f5f5;
@mainColor:#00D1CF;
.expirence-container{
  background:@bg;
  font-size:1.4rem;
  // height:100vh;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  .list{
    text-align:left;
    padding-left:1rem;
    background:#fff;
    select{
      border:none;
      height:48px;
      appearance:none;
      -moz-appearance:none;
      -webkit-appearance:none;
      background-image: none;
      background: no-repeat scroll right center transparent;
      margin-right:25px;
      color:#888;
      font-size:1.4rem;
      direction: rtl;
    }
  }
  .next{
    width:12rem;
    height:4rem;
    line-height: 4rem;
    text-align: center;
    color:#fff;
    background:@mainColor;
    border-radius:.3rem;
    position:fixed;
    bottom:2rem;
    left:50%;
    margin-left:-6rem;
  }
}
</style>


