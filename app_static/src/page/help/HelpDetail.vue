<template>
  <div class="help-detail">
    <ListItem from="detail"></ListItem>
    <div class="accept-answer">
      <UserIcon :user="user"></UserIcon>
      <div class="top">

      </div>
      <div class="summary"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from "lodash"
import {Component} from "vue-property-decorator";
import ListItem from '../../components/HelpItem.vue'
import UserIcon from '../../components/UserIcon.vue'
@Component({
  components:{
    ListItem,
    UserIcon
  }
})
export default class HelpDetail extends Vue{
private user = {
  headimgurl:'',
  sex:0
}
}
</script>

<style lang="less" scoped>
.help-detail{
  .accept-answer{
    border-top:1px solid #d3d3d3;
    border-bottom:1px solid #d3d3d3;
    padding:0 1rem 1rem;
  }
}
</style>
