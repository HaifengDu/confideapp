<template>
<div class="home-container">
  <div class="search">
    <div class="input">
     <input type="text">
    </div>
    <div class="button">快速匹配</div>
  </div>
  <div class="banner"></div>
  <div class="content"></div>
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

</style>


