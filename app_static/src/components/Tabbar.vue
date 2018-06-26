<template>
    <mt-tabbar v-model="selected">
      <mt-tab-item id="listen">
        <img v-if="selected=='listen'" slot="icon" src="static/images/tab/listen-active.png">
        <img v-else slot="icon" src="static/images/tab/listen.png">
        倾听
      </mt-tab-item>
      <mt-tab-item id="help">
        <img v-if="selected=='help'" slot="icon" src="static/images/tab/help-active.png">
        <img v-else slot="icon" src="static/images/tab/help.png">
        求助
      </mt-tab-item>
      <mt-tab-item id="my">
        <img v-if="selected=='my'" slot="icon" src="static/images/tab/my-active.png">
        <img v-else slot="icon" src="static/images/tab/my.png">
        我的
      </mt-tab-item>
    </mt-tabbar>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Model, Watch, Emit} from 'vue-property-decorator';
@Component
export default class Home extends Vue{
  private selected="listen";
  @Prop({
    type:String,
    default:""
  })
  private name:string;

  @Model("change",{
    type:Boolean
  })
  private checked:boolean;

  @Watch("selected")
  private watchSelected(newValue:string,oldValue:string){
    // this.$emit("testtest",111);
  }

  created(){

  }
}

</script>
<style lang="less" scoped>

</style>


