<template>
    <div class="container">
        <div class="body">
            <div class="topic">擅长话题<span>7/24</span></div>
            <div class="my-tag" v-for="(tag,index) in myTags" :key="index">
                <span class="title">{{tag.title}}</span>
                <p class="content">{{tag.text}}</p>
            </div>
            <div class="add-box">
                <span class="add" @click="showAddTagPage">+</span>
            </div>
        </div>
        <mt-popup style="width:100%;height:100%;"
            v-model="showAddTags"
            :modal="false"
            position="right">
           <div class="add-tags-container">
               <div class="topic">话题标签<span>8/24</span></div>
               <div class="tags">
                    <span :key="index" v-for="(item,index) in tags" :class="['tag',{'active':filterTag(item)},{'first-active':firstActive(item)}]" @click="selectTag(item)">{{item.name}}</span>
                    <span class="add" @click="showAddTag=true">+</span>
                </div>
               <div class="button-box">
                    <mt-button size="normal" type="primary" @click.native="saveTags">添加话题</mt-button>
                </div>
           </div>
        </mt-popup>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import LabelService from "../../api/LabelService.ts";
const labelService = LabelService.getInstance();

@Component({
 
})
export default class MyTags extends Vue{
    private showAddTags = false;
    private tags = [];
    private selectedTags:Array<{id:number,name:string}> = [];
    private myTags = [
        {
            title:'情感挽回',
            text:'暂无个性宣言'
        },
        {
            title:'婚姻关系',
            text:'暂无个性宣言'
        },
        {
            title:'情绪疏导',
            text:'特别擅长情绪疏导'
        },{
            title:'心理负担',
            text:'暂无个性宣言'
        },{
            title:'职业规划',
            text:'擅长于帮人建立职业规划'
        }
    ];
    created(){
        labelService.getSystemLabel().then((res:any)=>{
            const data =res.data;
            if(data.success){
                this.tags = data.data;
            }
        });
    }

    showAddTagPage(){
        this.showAddTags = true;
    }

    addTags(item:any){
        if(this.selectedTags.length<21){
            this.selectedTags.push(item)
        }
    }

    selectTag(item:any){
        let index = this.selectedTags.findIndex(ele=>ele.id==item.id)
        index>-1?this.selectedTags.splice(index,1):this.addTags(item)
    }

    firstActive(item:any){
        let index = this.selectedTags.findIndex(ele=>ele.id==item.id)
        return index>-1&&index<5
    }

    filterTag(item:any){
        return this.selectedTags.findIndex(ele=>ele.id==item.id)>-1
    }

    saveTags(){
        this.showAddTags = !this.showAddTags;
    }

}
</script>

<style lang="less" scoped>
    @import '../../assets/style.less';
    *{
        .f-nm;
    }
    .container{
        .p-rl;
    }
    .topic{
        .v-middle(40px);
        background:rgb(247,247,247);
        color:rgb(75,75,75);
        text-align:left;
        padding-left:20px;
        span{
            padding-left:20px;
            color:@light-blue;
        }
    }
    .my-tag{
        padding:20px 20px 0 20px;
        text-align:left;
        .title{
            .f-lg;
            color:#fff;
            display:inline-block;
            background:@light-blue;
            border-radius:5px;
            padding:5px 10px;
        }
        .content{
            .t-ellipsis(1);
            color:rgb(173,173,173);
            margin-top:10px;
        }
    }
    .add-box{
        text-align:left;
        padding:20px;
        .add{
            display: inline-block;
            .v-middle(1.2em);
            font-size:34px;
            text-align: center;
            width:2em;
            border-radius:5px;
            padding:0 10px;
            background:#f5f5f5;
            color:@light-blue;
        }
    }
    .add-tags-container{
        width:100%;
        height:100%;
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
</style>
