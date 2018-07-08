<template>
    <div class="container">
        <div class="body">
            <div class="divider"></div>
            <div class="title">简介</div>
            <div class="listen">
                <input type="text" placeholder="请输入简介" v-model="myIntro"/>
            </div>
            <div class="divider"></div>
            <div class="title">经历</div>
            <div class="my-experience" v-for="(experience,index) in experiences" :key="index">
                <span class="title">{{experience.name}}</span>
                <p class="content">{{experience.desc||'暂无经历简介'}}</p>
            </div>
            <div class="add-box">
                <span class="add" @click="showAddExperience">+</span>
            </div>
            <div class="divider"></div>
        </div>
        <mt-popup style="width:100%;height:100%;"
            v-model="isShowExpWin"
            :modal="false"
            position="right">
           <div class="add-experience-container">
                <div class="title">经历标签</div>
                <div class="experiences">
                    <span :key="index" v-for="(item,index) in experiencesData" :class="['experience',{'active':item.active},{'custom':item.active&&item.ctype==1}]" @click="selectTag(item.id)">{{item.name}}</span>
                    <span class="add" @click="customExp">+</span>
                </div>
                <div class="divider"></div>
                <div class="title">经历介绍</div>
                <mt-field style="padding:0 10px;" placeholder="经历介绍" type="textarea" rows="4" v-model="expIntro"></mt-field>
                <div class="button-box">
                    <mt-button size="normal" type="primary" @click.native="isShowExpWin=false">取消</mt-button>
                    <mt-button style="margin-left:20px;" size="normal" type="primary" @click.native="addExperience">添加</mt-button>
                </div>
           </div>
        </mt-popup>
        <mt-popup
            v-model="isShowAddExp" 
            class="custom">
            <div class="custom-title">新增经历</div>
            <div class="content">
                <mt-field label="名称" placeholder="请输入经历名称" v-model="newExp.name" ></mt-field>
            </div>
            <div class="button-box">
                <mt-button size="normal" type="primary" @click.native="addCustomExp">保存</mt-button>
            </div>
        </mt-popup>
        <mt-popup
            v-model="isShowDelWin" 
            class="custom edit-win">
            <div class="edit">
                <div class="edit-title">{{selectedData.name}}</div>
                <div class="edit-option" @click="deleteCustomExp">删除标签</div>
                <div class="edit-option" @click="isShowDelWin=false">取消</div>
            </div>
        </mt-popup>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

const MAX_EXPERIENCE_COUNT = 60;
const MAX_EXP_LENGTH = 5;
@Component({
 
})
export default class PersonalInfo extends Vue{
    private isShowExpWin = false;
    private isShowAddExp = false;
    private isShowDelWin = false;
    //我的经历标签
    private experiences:any=[
        {
            id:1,
            name:'婚姻经历',
            desc:'相爱十年，修成正果'
        }
    ];
    //添加经历时获取的经历标签数据
    private experiencesData:any = [];
    private selectedData:any={name:''};
    private expIntro = '';
    private myIntro = '心灵倾听者';
    private newExp:any = {name:''};
   
    created(){
        let tempData = [
            {id:0,name:'情感经历'},
            {id:1,name:'婚姻经历'},
            {id:2,name:'家庭经历'},
            {id:3,name:'职场经历'},
            {id:4,name:'校园经历'},
            {id:5,name:'同性经历'},
            {id:6,name:'亲子经历'},
            {id:7,name:'成长经历'},
            {id:8,name:'出国经历'}
        ];
        tempData.forEach((item:any)=>{
            item.active = false;
        });
        this.experiencesData = tempData;
        //TODO:获取经历标签
    }

    showAddExperience(){
        this.isShowExpWin = true;
    }

    selectTag(id:number){
        //选择标签
        this.selectedData = this.experiencesData.find((item:any)=>item.id===id);
        if(this.selectedData.active&&this.selectedData.isCustom){
            this.isShowDelWin = true;
        }
        if(this.selectedData.active)return;
        this.experiencesData.forEach((item:any)=>{
            if(item.id===id){
                item.active = true;
            }else{
                item.active = false;
            }
        });
        console.log(id);
    }

    //添加自定义经历
    customExp(){
        this.isShowAddExp = true;
    }

    addCustomExp(){
        if(this.newExp.name.length > MAX_EXP_LENGTH){
            this.$toast('经历名称不能多于5个字符');
            return;
        }
        if(!this.newExp.name){
            this.$toast('请输入经历名称');
            return;
        }
        //TODO:提交自定义经历
        console.log(this.newExp);
        this.isShowAddExp = false;
        //提交成功后，返回新增经历id，将新增经历加到experiencesData中
        this.experiencesData.push({
            id:this.experiencesData.length,
            name:this.newExp.name,
            active:false,
            isCustom:true
        });
    }

    deleteCustomExp(){
        //TODO:删除自定义标签
        const index = this.experiencesData.findIndex((item:any)=>item.id===this.selectedData.id);
        this.experiencesData.splice(index,1);
        this.isShowExpWin = false;
    }

    //提交选择的经历
    addExperience(){
        if(!this.selectedData){
            this.$toast('请选择经历');
            return;
        }
        if(this.expIntro.length > MAX_EXPERIENCE_COUNT){
            this.$toast('介绍不能多于60字符');
            return;
        }
        //TODO:向后台提交选择的经历及介绍
        const data = Object.assign({},this.selectedData);
        data.desc = this.selectedData.desc = this.expIntro;
        this.experiences.push(data);
        this.expIntro = '';
        this.isShowExpWin = false;
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
    .title{
        .v-middle(40px);
        background:rgb(247,247,247);
        color:rgb(173,173,173);
        text-align:left;
        padding-left:20px;
    }
    .divider{
        height:10px;
        background:#eee;
    }
    .body{
        .listen{
            height:30px;
            padding:5px 20px;
            input{
                border:none;
                outline:none;
                width:100%;
                height:100%;
            }
        }
    }

    .add-experience-container{
        width:100%;
        height:100%;
        max-width: 620px;
        margin: 0 auto;
    }
    .experiences{
      text-align:left;
      margin:1rem;
      .experience{
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

    .my-experience{
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
    div.mint-popup.custom{
        border-radius:10px;
        width:280px;
        background:#fff;
        padding-bottom:65px;
        .custom-title{
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
        padding:0;
    }
    
</style>
