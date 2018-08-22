<template>
  <div class="help-detail">
    <ListItem from="detail"></ListItem>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from "lodash"
import {Component} from "vue-property-decorator";
import ListItem from '../../components/HelpItem.vue'
@Component({
  components:{
    ListItem
  }
})
export default class HelpDetail extends Vue{

}
</script>

<style lang="less" scoped>
.help-detail{

}
</style>
