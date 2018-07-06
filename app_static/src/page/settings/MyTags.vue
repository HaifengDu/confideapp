<template>
    <div class="container">
        <div class="body">
            <div class="topic">擅长话题<span class="num">7/24</span><span v-if="isAuditing" class="auditing">审核中</span></div>
            <div class="my-tag" v-for="(tag,index) in myTags" :key="index">
                <span class="title">{{tag.name}}</span>
                <p class="content">{{tag.desc||'暂无个性宣言'}}</p>
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
                    <span :key="index" v-for="(item,index) in tags" :class="['tag',{'active':item.active},{'custom':item.active&&item.ctype==1}]" @click="selectTag(item.id)">{{item.name}}</span>
                    <span class="add" @click="customTag">+</span>
                </div>
               <div class="button-box">
                    <mt-button size="normal" type="primary" @click.native="showAddTags=!showAddTags">取消</mt-button>
                    <mt-button style="margin-left:20px;" size="normal" type="primary" @click.native="addTopic">添加</mt-button>
                </div>
           </div>
        </mt-popup>
        <mt-popup
            v-model="showAddTagsWin" 
            class="custom">
            <div class="title">{{isEdit?'编辑标签':'新增标签'}}</div>
            <div class="content">
                <mt-field label="名称" placeholder="请输入标签名称" v-model="newLabel.name" :readonly="isEdit" :disableClear="isEdit"></mt-field>
                <mt-field label="宣言" type="textarea" rows="4" placeholder="请输入标签宣言" v-model="newLabel.desc"></mt-field>
            </div>
            <div class="button-box">
                <mt-button size="normal" type="primary" @click.native="addCustomTag">保存</mt-button>
            </div>
        </mt-popup>
        <mt-popup
            v-model="showEditWin" 
            class="custom edit-win">
            <div class="edit">
                <div class="edit-title">{{editLable.name}}</div>
                <div class="edit-option" @click="editLabelAction">编辑宣言</div>
                <div class="edit-option" @click="deleteLabel">删除标签</div>
                <div class="edit-option" @click="closeEditWin">取消</div>
            </div>
        </mt-popup>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import {ELabelCType} from '@/enum/ELabelType.ts';
import LabelService from "../../api/LabelService.ts";
import ListenerService from "../../api/ListenerService.ts";
import {IListenLabel} from "@/interface/model/IMainLabel.ts";
const labelService = LabelService.getInstance();
const listenerService = ListenerService.getInstance();

@Component({
    
})
export default class MyTags extends Vue{
    private static readonly MAX_COUNT = 21;
    private static readonly MAX_DECLARATION_COUNT = 50;
    private static readonly MAX_LABEL_NAME_COUNT = 5;
    //控制弹出选择标签窗口
    private showAddTags = false;
    //控制新增自定义标签窗口
    private showAddTagsWin = false;
    private showEditWin = false;
    private tags:Array<any> = [];
    private myTags:Array<any> = [];
    private newLabel:any = {};
    private editLable:any = {};
    private isEdit = false;
    private isAuditing = false;
    created(){
        this.myTags.forEach((item)=>!item.desc&&(item.desc=''));
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
        if(this.isAuditing){
            this.$toast('标签审核中，暂时无法添加标签');
            return;
        }
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
        this.editLable = label;
        this.showEditWin = true;
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
        if(this.newLabel.name.length > MyTags.MAX_LABEL_NAME_COUNT){
            this.$toast('标签名称只能小于等于5个字');
            return;
        }
        if(!this.isEdit){
            //向后台发送新增标签请求，参数，stype，name
            //添加成功后，接受后台返回的标签id，然后将标签数据push到this.tags数组中
            labelService.addLabel({name:this.newLabel.name}).then((res:any)=>{
                if(res.data.success){
                    const data = res.data.data;
                    this.tags.push({
                        name:data.name,
                        id:data.id,
                        ctype:data.ctype,
                        desc:this.newLabel.desc||'',
                        active:true
                    });
                    this.showAddTagsWin = false;
                }else{
                    this.$toast(res.data.message);
                }
            });
        }else{
            if(this.newLabel.desc.length > MyTags.MAX_DECLARATION_COUNT){
                this.$toast('标签宣言只能小于等于50个字');
                return;
            }
            let editData = this.tags.find(tag=>tag.id===this.editLable.id);
            editData.desc = this.newLabel.desc;
            this.isEdit = false;
            this.showAddTagsWin = false;
        }
    }

    /**
     * 保存选择的标签
     */
    addTopic(){
        /**
         * 将选中的标签数组传给后台   例：  [{id:3,desc:'我的测试宣言'}]
         * 保存成功后，将数据存入store
         * 更新myTags数组
         */
        let data = this.tags.filter(tag=>tag.active);

        //向后台发送数据 labels
        const labels = data.map(item=>{
            return {
                name:item.name,
                id:item.id,
                desc:item.desc
            }
        });
        listenerService.updateLabels(labels).then((res:any)=>{
            if(res.data.success){
                //数据保存成功后，如果该标签不在我的标签中，就将该标签添加到我的标签中
                data.forEach((item)=>{
                    const selectedTag = this.myTags.find(tag=>tag.id===item.id);
                    if(!selectedTag){
                        this.myTags.push(Object.assign({},item));
                    }else{
                        selectedTag.desc = this.editLable.desc;
                    }
                }); 
                this.showAddTags = !this.showAddTags;
            }else{
                this.$toast(res.data.message);
            }
        });
        
    }

    editLabelAction(){
        this.isEdit = true;
        this.newLabel.name = this.editLable.name;
        this.newLabel.desc = this.editLable.desc||'';
        this.showAddTagsWin = true;
        this.showEditWin = false;
    }

    deleteLabel(){
        let label = this.tags.find(item=>item.id===this.editLable.id);
        if(this.editLable.ctype === ELabelCType.Custom){
            //发送请求，删除自定义标签
            labelService.deleteLabel(label.id).then((res:any)=>{
                if(res.data.success){
                    //请求成功后，删除标签
                    const index = this.tags.findIndex(item=>item.id===this.editLable.id);
                    this.tags.splice(index,1);
                    let myTagIdx = this.myTags.findIndex(tag=>tag.id===this.editLable.id);
                    if(myTagIdx>-1){
                        this.myTags.splice(myTagIdx,1);
                    }
                }else{
                    this.$toast(res.data.message);
                }
            });
        }else{
            label.active = !label.active;
            //从我的标签数组中删除该标签
            const addedIndex = this.myTags.findIndex(item=>item.id===label.id);
            if(addedIndex>-1){
                this.myTags.splice(addedIndex,1);
            }
        }
        this.showEditWin = false;
    }

    closeEditWin(){
        this.showEditWin = false;
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
        .auditing,.num{
            padding-left:20px;
        }
        .num{
            color:@light-blue;
        }
        .auditing{
            color:#e43937;
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
            .t-ellipsis(3);
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
        max-width: 620px;
        margin: 0 auto;
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
        &.active.custom{
            background:#11b7f3;
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
    div.mint-popup.custom{
        border-radius:10px;
        width:280px;
        height:280px;
        background:#fff;
        .title{
            padding: 15px 10px;
            border-bottom: 1px solid #ccc;
        }
        .content{
            padding:10px;
            .t-ellipsis(4);
        }
        .edit{
            padding:10px 30px;
            text-align:left;
            .edit-title,.edit-option{
                font-size:16px;
                padding:10px 0;
            }
            .edit-title{
                .f-lg;
                color:#333;
            }
            .edit-option{
                color:rgb(151,151,151);
            }
        }
    }
    div.mint-popup.custom.edit-win{
        height:auto;
    }
</style>
