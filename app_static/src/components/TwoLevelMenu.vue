<template>
  <div class="menu-container">
    <div class="parent">
      <div class="lists">
        <div class="list"></div>
      </div>
    </div>
    <div class="child"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component, Prop, Watch, Emit} from 'vue-property-decorator';

@Component
export default class UpdateName extends Vue{}
</script>

<style lang="less">
@mainColor:#00D1CF;
.menu-container{
  display: flex;
  .parent{
    flex:2;
    border-right:1px solid #d7d7d7;
  }
  .child{
    flex:3;
  }
}
</style>
