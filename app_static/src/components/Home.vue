<template>
  <div>
    <div>{{test}}</div>
    <div>{{test2}}</div>
    <button @click="testClick">测试</button>
    <mt-actionsheet
      :actions="actions"
      v-model="sheetVisible">
    </mt-actionsheet>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Model, Watch, Emit} from 'vue-property-decorator';
import { Indicator } from 'mint-ui';
@Component
export default class Home extends Vue{
  private test="123123";
  private actions=[{
    name:"测试1",
    method:function(){
      console.log(arguments);
    }
  },{
    name:"测试2",
    method:function(){
      console.log(arguments);
    }
  }];
  private sheetVisible = false;
  @Prop({
    type:String,
    default:""
  })
  private name:string;

  @Model("change",{
    type:Boolean
  })
  private checked:boolean;

  @Watch("test")
  private testWatch(newValue:string,oldValue:string){
    console.log(newValue);
    this.$emit("testtest",111);
  }

  get test2():string{
    return this.test+"123123123123";
  }

  testClick(){
    this.test = "测试";
    // Indicator.open();
    this.sheetVisible = true;
    this.$emit("change",false);
  }

  mounted(){
    this.test="uuojlfjs";
  }

  created(){

  }
}

</script>
<style lang="less" scoped>

</style>


