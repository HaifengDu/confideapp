<template>
  <div class="slide-container" v-show="pshow">
    <div class="bg-cover" @click="close"></div>
    <div class="slide">
    <transition name="slide-fade">
      <div v-show="slotShow">
        <slot></slot>
      </div>
    </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component, Prop, Watch, Emit} from 'vue-property-decorator';
@Component
export default class SlideMenu extends Vue{
  private pshow = false;
  private slotShow = false;
  close(){
    this.slotShow = false;
    setTimeout(() => {
      this.pshow = false;
    }, 200);
  }
  show(){
    this.pshow = true;
    this.$nextTick(()=>{
      this.slotShow = true;
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/common.less';
.slide-container{
  .bg-cover{
    position:fixed;
    top:0;
    bottom:0;
    width:100%;
    background:#ccc;
    opacity: .6;
  }
  .slide{
    width:80%;
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    z-index:2;
    background:#fff;
    overflow:auto;
    // /deep/ .filter-title{display:none;}
    /deep/ .footer-btn{
      width:80%;
      left:20%;
      bottom:0;
      background:#fff;
    }
  }
}
</style>
