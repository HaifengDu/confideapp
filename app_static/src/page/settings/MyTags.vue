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
                    <span :key="index" v-for="(item,index) in tags" :class="['tag',{'active':item.active}]" @click="selectTag(item.id)">{{item.name}}</span>
                    <span class="add" @click="customTag">+</span>
                </div>
               <div class="button-box">
                    <mt-button size="normal" type="primary" @click.native="addTopic">添加话题</mt-button>
                </div>
           </div>
        </mt-popup>
        <mt-popup
            v-model="showAddTagsWin" 
            class="custom">
            <div class="title">新增标签</div>
            <div class="content">
                <mt-field label="名称" placeholder="请输入标签名称" v-model="newLabel.name"></mt-field>
                <mt-field label="宣言" placeholder="请输入标签宣言" v-model="newLabel.text"></mt-field>
            </div>
            <div class="button-box">
                <mt-button size="normal" type="primary" @click.native="addCustomTag">保存</mt-button>
            </div>
        </mt-popup>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import LabelService from "../../api/LabelService.ts";
const labelService = LabelService.getInstance();

@Component({
    
})
export default class MyTags extends Vue{
    private static readonly MAX_COUNT = 21;
    //控制弹出选择标签窗口
    private showAddTags = false;
    //控制新增自定义标签窗口
    private showAddTagsWin = false;
    private tags:Array<any> = [];
    private myTags:Array<any> = [];
    private newLabel:any = {};
    created(){
        labelService.getSystemLabel().then((res:any)=>{
            const data =res.data;
            if(data.success){
                data.data.forEach((item:any)=>item.active = false);
                this.tags = data.data;
            }
        });
        //TODO:从store中获取listener下的label数据
    }

    showAddTagPage(){
        this.showAddTags = true;
    }

    selectTag(id:number){
        //选择标签
        let label = this.tags.find(item=>item.id===id);
        //点击未选择的标签，直接切换标签状态
        if(label&&!label.active){
            label.active = true;
            return;
        }
        /**
         * 点击已选择的标签，弹出编辑选项弹窗，包括编辑、删除、取消按钮
         * 编辑（与新增一个弹窗，name不可编辑即可）
         * 删除（删除系统标签仅取消选中状态，删除自定义标签需向后台发请求删除标签,参数id、stype）
         */
    }

    /**
     * 添加自定义标签
     */
    customTag(){
        //TODO:添加自定义标签参数，name,stype(用ELabelSType.Label)
        /**
         * 添加自定义标签成功后，将该标签的active设为true
         * 将该标签添加到myTags数组中
         */
        this.newLabel = {};
        this.showAddTagsWin = true;
    }

    addCustomTag(){
        if(!this.newLabel.name){
            this.$toast('请输入标签名称');
            return;
        }
        //向后台发送新增标签请求，参数，stype，name
        //添加成功后，接受后台返回的标签id，然后将标签数据push到this.tags数组中
        this.showAddTagsWin = false;
    }

    /**
     * 保存选择的标签
     */
    addTopic(){
        //TODO:保存选择的标签
        /**
         * 将选中的标签数组传给后台   例：  [{id:3,name:'情感挽回',desc:'我的测试宣言'}]
         * 保存成功后，将数据存入store
         * 更新myTags数组
         */
        let data = this.tags.filter(tag=>tag.active);
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
            border:1px solid @mainColor;
            background:@mainColor;
            color:#fff;
        }
      }
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
    div.mint-popup.custom{
        border-radius:10px;
        width:250px;
        height:250px;
        background:#fff;
        .title{
            padding: 15px 10px;
            border-bottom: 1px solid #ccc;
        }
        .content{
            padding:10px;
            .t-ellipsis(4);
        }
    }
</style>
