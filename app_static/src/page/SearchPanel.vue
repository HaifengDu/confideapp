<template>
    <div style="position:relative;">
        <div>
            <div class="search-bar-wrapper">
                <select name="type" v-model="filterModel.type" @change="typeChange">
                    <option value="1">倾听者</option>
                    <option value="2">话题</option>
                </select>
                <i class="fa fa-chevron-down"></i>
                <input autofocus v-model="filterModel.text" @keyup.enter="search()" type="text" :placeholder="textPlace" name="text"/>
            </div>
            <span class="cancel-text" @click="cancel">取消</span>
        </div>
        <div class="search-history-wrapper">
            <h4>搜索历史</h4>
            <div class="del-btn">
                <i class="fa fa-trash-o"></i>
            </div>
            <div>
                <span @click="search(item)" class="history-item" v-for="(item, index) in cacheSearchList" :key="index">
                    {{item}}
                </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator";
@Component
export default class SearchPanel extends Vue{
    private filterModel={
        type:"1",
        text:""
    }
    private textPlace="搜索倾听者";
    private cacheSearchList = ["测试1","测试2","测试3"];
    typeChange(){
        this.textPlace = this.filterModel.type=="1"?"搜索倾听者":"搜索话题";
    }
    search(item?:string){
      if(item){
          this.filterModel.text = item;
      }
      if(!this.filterModel.text){
          this.$toast("请输入文字");
          return;
      }
      this.$router.push({
        path:'/searchResult',
        query:{
          name:this.filterModel.text
        }
      })
    }
    cancel(){
        this.$router.back();
    }
}
</script>
<style lang="less" scoped>
.search-bar-wrapper{
    padding: 5px 12px;
    background: #eee;
    width: 80%;
    margin: 5px;
    text-align: left;
    border-radius: 20px;
    select{
        border: 0;
        width: 22%;
        background: #eee;
        //隐藏select的下拉图标
        margin-right: -22px;
        direction: rtl;
        padding-right: 22px;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-color:transparent; border-color:transparent;
    }
    input{
        margin-left: 10px;
        height: 26px;
        width: 70%;
        border:0;
        user-select: none;
        background-color: #eee;
    }
}
.cancel-text{
    position: absolute;
    right: 0;
    top: 0;
    line-height: 30px;
    margin-right: 5px;
    padding: 8px;
}
.search-history-wrapper{
    margin-top:20px;
    margin-left:10px;
    position: relative;
    text-align: left;
    .del-btn{
        position: absolute;
        top:0;
        right:15px;
    }
    .history-item{
        padding:10px;
        background: #eee;
        margin:10px;
        display: inline-block;
        border-radius: 5px;
    }
}
</style>

