<template>
    <div class="container">
        <div class="body">
            <div class="title">简介<span v-if="isAuditing" class="auditing">审核中</span></div>
            <div class="listen">
                <input type="text" placeholder="请输入简介" v-model="myIntro"/>
            </div>
            <div class="title">经历</div>
            <div class="my-experience" v-for="(experience,index) in experiences" :key="index">
                <span class="title" @click="showDelMyExpWin(experience)">{{experience.name}}</span>
                <p class="content">{{experience.desc||'暂无经历简介'}}</p>
            </div>
            <div class="add-box">
                <span class="add" @click="showAddExperience">+</span>
            </div>
            <div class="title">上传资质</div>
            <div class="cert-container">
                <div>
                    <div class="cert-upload" :key="index" v-for="(item,index) in imageList">
                        <img :src="item"/>
                    </div>
                    <div class="cert-upload" @click="uploadClick">
                        <div>+</div>
                        <div>添加资质</div>
                    </div>
                    <div style="clear:both;"></div>
                </div>
                <div class="cert-explain">
                    上传资质证书照片（最多六张）
                </div>
                <input style="display:none;" multiple accept="image/png,image/jpeg,image/gif" maxlength="6" type="file" name="certs" @change="fileChange" ref="certsfile"/>
            </div>
            <div class="button-box">
                <mt-button size="normal" type="primary" @click.native="submitCer">提交资质</mt-button>
            </div>
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
            v-model="isShowDelMyExpWin" 
            class="custom edit-win">
            <div class="edit">
                <div class="edit-title">{{selectedData.name}}</div>
                <div class="edit-option" @click="deleteMyExp">删除标签</div>
                <div class="edit-option" @click="isShowDelMyExpWin=false">取消</div>
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
import FileReaderHelper from "../../helper/FileReaderHelper.ts";
import LabelService from "../../api/LabelService.ts";
import ListenerService from "../../api/ListenerService.ts";
import { mapGetters,mapActions} from 'vuex';
import { Indicator } from 'mint-ui';
import {EAuthStatus} from "../../enum/EAuthStatus.ts";
const labelService = LabelService.getInstance();
const listenerService = ListenerService.getInstance();

@Component({
    methods:{
        ...mapActions({
            setListenerData:'setListenerData'
        })
    },
    computed:{
        ...mapGetters({
            user:'user'
        })
    }
})
export default class PersonalInfo extends Vue{
    private static readonly MAX_EXPERIENCE_COUNT = 60;
    private static readonly MAX_EXP_LENGTH = 5;
    private static readonly MAX_FILE_COUNT = 6;
    private static readonly MAX_EXP_COUNT = 2;
    private isShowExpWin = false;
    private isShowAddExp = false;
    private isShowDelWin = false;
    private isShowDelMyExpWin = false;
    private isAuditing = false;
    //我的经历标签
    private experiences:any=[];
    //添加经历时获取的经历标签数据
    private experiencesData:any = [];
    private selectedData:any={name:''};
    private expIntro = '';
    private myIntro = '心灵倾听者';
    private newExp:any = {name:''};
    private imageList:any[] = [];
    private files:Blob[];
   
    created(){
        labelService.getExperiences().then((res:any)=>{
            if(res.data.success){
                let tempData = res.data.data;
                tempData.forEach((item:any)=>{
                    item.active = false;  
                });
                this.experiencesData = tempData;
            }
        });
        if((<any>this).user&&(<any>this).user.listener){
            this.experiences = (<any>this).user.listener.exps;
        }
    }

    showAddExperience(){
        if(this.isAuditing){
            this.$toast('标签审核中，暂时无法添加标签');
            return;
        }
        if(this.experiences.length >= PersonalInfo.MAX_EXP_COUNT){
            this.$toast('最多能添加2个经历标签，请先删除一个再添加新的经历');
            return;
        }
        this.isShowExpWin = true;
    }

    selectTag(id:number){
        //选择标签
        this.selectedData = this.experiencesData.find((item:any)=>item.id===id);
        if(this.checkSelData){

        }
        if(this.selectedData.active&&this.selectedData.isCustom){
            this.isShowDelWin = true;
        }
        this.experiencesData.forEach((item:any)=>{
            if(item.id===id){
                if(!item.isCustom||item.isCustom&&!item.active){
                    item.active = !item.active;
                }
            }else{
                item.active = false;
            }
        });
    }

    checkSelData(data:any){
        return !!this.experiences.find((item:any)=>item.id===data.id);
    }

    //添加自定义经历
    customExp(){
        this.newExp.name = '';
        this.isShowAddExp = true;
    }

    addCustomExp(){
        if(this.newExp.name.length > PersonalInfo.MAX_EXP_LENGTH){
            this.$toast('经历名称不能多于5个字符');
            return;
        }
        if(!this.newExp.name){
            this.$toast('请输入经历名称');
            return;
        }
        labelService.addExperice({name:this.newExp.name}).then((res:any)=>{
            if(res.data.success){
                const data = res.data.data;
                this.isShowAddExp = false;
                //提交成功后，返回新增经历id，将新增经历加到experiencesData中
                this.experiencesData.push({
                    id:data.id,
                    ctype:data.ctype,
                    name:data.name,
                    active:false,
                    isCustom:data.ctype==1
                });
            }else{
                this.$toast(res.data.message);
            }
        });
        
    }

    showDelMyExpWin(item:any){
        this.selectedData = Object.assign({},item);
        this.isShowDelMyExpWin = true;
    }

    //删除我的经历标签
    deleteMyExp(){
        labelService.deleteExperice(this.selectedData.id).then((res:any)=>{
            if(res.data.success){
                const index = this.experiences.findIndex((item:any)=>item.id===this.selectedData.id);
                this.experiences.splice(index,1);
                this.isShowDelMyExpWin = false;
                const expDataIndex = this.experiencesData.findIndex((exp:any)=>exp.id===this.selectedData.id);
                if(expDataIndex>-1&&this.selectedData.ctype==1){
                    this.experiencesData.splice(expDataIndex,1);
                }
                let tempData:any = [];
                this.experiences.forEach((item:any)=>{
                    tempData.push(item);
                });
                (<any>this).setListenerData({exps:tempData});
            }else{
                this.$toast(res.data.message);
            }
        });
        
    }

    //删除自定义标签
    deleteCustomExp(){
        labelService.deleteExperice(this.selectedData.id).then((res:any)=>{
            if(res.data.success){
                const index = this.experiencesData.findIndex((item:any)=>item.id===this.selectedData.id);
                this.experiencesData.splice(index,1);
                this.isShowDelWin = false;
                const mySelIndex = this.experiences.findIndex((exp:any)=>exp.id===this.selectedData.id);
                if(mySelIndex>-1){
                    this.experiences.splice(mySelIndex,1);
                }
                let tempData:any = [];
                this.experiences.forEach((item:any)=>{
                    tempData.push(item);
                });
                (<any>this).setListenerData({exps:tempData});
            }else{
                this.$toast(res.data.message);
            }
        });
    }

    //提交选择的经历
    addExperience(){
        if(!this.selectedData){
            this.$toast('请选择经历');
            return;
        }
        if(this.expIntro.length > PersonalInfo.MAX_EXPERIENCE_COUNT){
            this.$toast('介绍不能多于60字符');
            return;
        }
        if(this.experiences.find((item:any)=>item.id===this.selectedData.id)){
            this.$toast('请勿添加重复的经历');
            return;
        }
        const data = Object.assign({},this.selectedData);
        data.desc = this.selectedData.desc = this.expIntro;
        listenerService.updateExp(data.id,data.desc).then((res:any)=>{
            if(res.data.success){
                this.experiences.push(data);
                this.expIntro = '';
                this.isShowExpWin = false;
                let tempData:any = [];
                this.experiences.forEach((item:any)=>{
                    tempData.push(item);
                });
                (<any>this).setListenerData({exps:tempData});
                //TODO:设置标签审核中状态
                // this.isAuditing = true;
            }else{
                this.$toast(res.data.message);
            }
        });
    }

    fileChange(){
        if((<any>this.$refs.certsfile).files.length>=PersonalInfo.MAX_FILE_COUNT){
            this.$toast(`最多上传${PersonalInfo.MAX_FILE_COUNT}张图片`);
            (<any>this.$refs.certsfile).value = "";
            return;
        }
        const files = this.files = Array.prototype.slice.call((<any>this.$refs.certsfile).files);
        FileReaderHelper.readFiles(files).then((res:any)=>{
            this.imageList = res;
        });
    }
    uploadClick(){
        (<any>this.$refs.certsfile).click();
    }

    submitCer(){
        Indicator.open('提交中...');
        listenerService.uploadcert(this.files).then((res:any)=>{
            Indicator.close();
            const data = res.data;
            if(data.success){
                this.$toast("上传成功，等待审核");
                (<any>this).setListenerData({authstatus:EAuthStatus.认证中});
            }else{
                this.$toast(data.message);
            }
        },(err:any)=>{
            Indicator.close();
        }).catch(()=>{
            Indicator.close();
        });
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
        padding-bottom:65px;
    }
    .title{
        .v-middle(40px);
        background:rgb(247,247,247);
        color:rgb(173,173,173);
        text-align:left;
        padding-left:20px;
    }
    .auditing{
        padding: 20px;
        color:#e43937;
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
    
</style>
