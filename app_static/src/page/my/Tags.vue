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
    
    <div class="title">上传证书</div>
    <div class="cert-container">
      <div>
        <div class="cert-upload" :key="index" v-for="(item,index) in imageList">
          <img :src="item"/>
        </div>
        <div class="cert-upload" @click="uploadClick">
          <div>+</div>
          <div>添加凭证</div>
        </div>
        <div style="clear:both;"></div>
      </div>
      <div class="cert-explain">
        上传身份证正反面（必须）及证书照片（最多八张）
      </div>
      <input style="display:none;" multiple accept="image/png,image/jpeg,image/gif" maxlength="8" type="file" name="certs" @change="fileChange" ref="certsfile"/>
    </div>
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
import FileReaderHelper from "../../helper/FileReaderHelper.ts";
import {INoopPromise} from "../../util/methods";
import { mapActions } from 'vuex';
import { Indicator } from 'mint-ui';
const labelService = LabelService.getInstance();
@Component({
  components:{
    AddTag
  },
  methods:{
    ...mapActions({
      "actionSumbit":"my/submit"
    })
  }
})
export default class Tags extends Vue{
  private static readonly MAX_COUNT = 21;
  private static readonly MAX_FILE_COUNT = 6;
  private tags:Array<IMainLabel> = [];
  private selectedTags:Array<{id:number,name:string}> = []
  private showAddTag = false;
  private imageList:any[] = [];
  private files:Blob[];
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

  fileChange(){
    if((<any>this.$refs.certsfile).files.length>Tags.MAX_FILE_COUNT){
      this.$toast("最多上传8张图片");
      (<any>this.$refs.certsfile).value = "";
      return;
    }
    const files = this.files = Array.prototype.slice.call((<any>this.$refs.certsfile).files);
    FileReaderHelper.readFiles(files).then(res=>{
        this.imageList = res;
    });
  }
  uploadClick(){
    (<any>this.$refs.certsfile).click();
  }
  submit(){
    if(!this.selectedTags.length){
      this.$toast("请选择标签");
      return;
    }
    Indicator.open('提交中...');
    this.actionSumbit({labelids:this.selectedTags.map(item=>item.id),files:this.files||[]}).then(res=>{
      Indicator.close();
      const data = res.data;
      if(data.success){
        this.$toast("申请成功，等待审核");
      }else{
        this.$toast(data.message);
      }
    },err=>{
      Indicator.close();
    }).catch(()=>{
      Indicator.close();
    });
  }
  private actionSumbit:INoopPromise
}
</script>

<style lang="less">
@mainColor:#00D1CF;
  .cert-container{
    text-align: left;
    padding: 5px;
    .cert-explain{
      font-size: 1rem;
      color: #f00;
    }
    .cert-upload{
      color:#fff;
      background-color: @mainColor;
      text-align: center;
      width:7rem;
      height: 8.5rem;
      margin-bottom:5px;
      float: left;
      margin:2px 4px;
      &:first-child{
        margin-left: 0;
      }
      div:first-child{
        font-size: 6rem;
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .tags-container{
    font-size:1.4rem;
    .next{
      position:fixed;
      bottom:2rem;
      left:0;
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


