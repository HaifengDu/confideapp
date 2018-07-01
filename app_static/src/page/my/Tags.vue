<template>
  <div class="tags-container">
    <div class="title">
      选择标签
    </div>
    <div class="tags">
      <span :key="index" v-for="(item,index) in tags" :class="['tag',{'active':filterTag(item)},{'first-active':firstActive(item)}]" @click="selectTag(item)">{{item.name}}</span>
      <span class="add" @click="showAddTag=true">+</span>
    </div>
    <add-tag  v-if="showAddTag" @changeContent="updatedTags" @cancel="cancel" :maxlength="4"></add-tag>
    <div class="next" style="text-algin:center;width:100%;">
      <mt-button @click="submit" size="normal" type="primary">提交审核</mt-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AddTag from '@/components/UpdateName';
import IMainLabel from "@/interface/model/IMainLabel";
import LabelService from "../../api/LabelService.ts"
import {Component} from 'vue-property-decorator';
const labelService = LabelService.getInstance();
@Component({
  components:{
    AddTag
  }
})
export default class Tags extends Vue{
  private static readonly MAX_COUNT = 21;
  private tags:Array<IMainLabel> = [];
  private selectedTags:Array<{id:number,name:string}> = []
  private showAddTag = false
  created(){
    document.title="选择标签";
    labelService.getSystemLabel().then(res=>{
      const data =res.data;
      if(data.success){
        this.tags = data.data;
      }
    });
  }
  selectTag(item:any){
    let index = this.selectedTags.findIndex(ele=>ele.id==item.id)
    index>-1?this.selectedTags.splice(index,1):this.addTags(item)
  }
  addTags(item:any){
    if(this.selectedTags.length<21){
      this.selectedTags.push(item)
    }
  }
  firstActive(item:any){
    let index = this.selectedTags.findIndex(ele=>ele.id==item.id)
    return index>-1&&index<5
  }
  filterTag(item:any){
    return this.selectedTags.findIndex(ele=>ele.id==item.id)>-1
  }
  cancel(){
    this.showAddTag = false;
  }
  updatedTags(tag:any){
    this.showAddTag = false
    //TODO:创建标签 调接口  放在最后
    if(this.selectedTags.length<Tags.MAX_COUNT){
      labelService.addLabel({
        name:tag
      }).then(res=>{
        const data = res.data;
        if(data.success&&data.data){
          this.tags.push(<any>{name:tag,id:data.data.id});
          this.selectedTags.push(<any>{name:tag,id:data.data.id});
        }
      });
    }
  }
  submit(){
    if(!this.selectedTags.length){
      this.$toast("请选择标签");
      return;
    }
    console.log("提交");
  }
}
</script>

<style lang="less">
@mainColor:#00D1CF;
  .tags-container{
    font-size:1.4rem;
    .next{
      position:fixed;
      bottom:2rem;
      // left:50%;
      // margin-left:-6rem;
    }
    .title{
      text-align:left;
      padding-left:1.8rem;
      height:4rem;
      line-height: 4rem;
      background:#f8f8f8;
    }
    .tags{
      text-align:left;
      margin:1rem;
      .tag{
        height:2rem;
        line-height: 2rem;
        padding:.5rem .8rem;
        margin:.5rem;
        display:inline-block;
        border:1px solid #f5f5f5;
        background:#f5f5f5;
        border-radius:1.5rem;
        color:#666;
        &.active{
          border:@mainColor 1px solid;
          color:@mainColor;
        }
        &.first-active{
          border:1px solid @mainColor;
          background:@mainColor;
          color:#fff;
        }
      }
      .add{
        display: inline-block;
        height:3rem;
        margin: 0 .5rem;
        line-height: 3rem;
        text-align: center;
        width:3rem;
        background:#f5f5f5;
        color:@mainColor;
        border-radius:50%;
      }
    }
  }
</style>


