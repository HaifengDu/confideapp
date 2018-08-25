<template>
    <div class="container">
        <div class="feedback">
            <el-input
                type="textarea"
                :rows="12"
                placeholder="您的反馈将帮助我们更快的成长"
                @input="textChange"
                v-model="feedback">
            </el-input>
            <div class="count">{{feedback.length}}/400</div>
        </div>
        <div class="title">问题截图(选填)</div>
        <div class="cert-container">
            <div>
                <div class="cert-upload" :key="index" v-for="(item,index) in imageList">
                    <img :src="item"/>
                </div>
                <div class="cert-upload" @click="uploadClick">
                    <div>+</div>
                    <div>添加截图</div>
                </div>
                <div style="clear:both;"></div>
            </div>
            <div class="cert-explain">
                上传问题截图（最多六张）
            </div>
            <input style="display:none;" multiple accept="image/png,image/jpeg,image/gif" maxlength="6" type="file" name="certs" @change="fileChange" ref="certsfile"/>
        </div>
        <div class="button-box">
            <mt-button size="normal" type="primary" @click.native="submit">提交反馈</mt-button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator'; 
import FileReaderHelper from "../helper/FileReaderHelper.ts";
import { Indicator } from 'mint-ui';

@Component
export default class Feedback extends Vue{
    private feedback = '';
    private imageList:any[] = [];
    private files:Blob[];
    textChange(){
        if(this.feedback.length > 400){
            this.$nextTick(()=>{
                this.feedback = this.feedback.slice(0,400);
            });
        }
    }

    fileChange(){
        if((<any>this.$refs.certsfile).files.length>6){
            this.$toast('最多上传6张图片');
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

    submit(){
        console.log(this.files);
        //TODO:提交建议资料
        // Indicator.open('提交中...');
        // listenerService.uploadcert(this.files).then((res:any)=>{
        //     Indicator.close();
        //     const data = res.data;
        //     if(data.success){
        //         this.$toast("上传成功，等待审核");
        //         (<any>this).setListenerData({authstatus:EAuthStatus.认证中});
        //     }else{
        //         this.$toast(data.message);
        //     }
        // },(err:any)=>{
        //     Indicator.close();
        // }).catch(()=>{
        //     Indicator.close();
        // });
    }
}
</script>

<style lang="less" scoped>
    @import '../assets/style.less';
    @orange:rgb(239,146,55);
    .title{
        .v-middle(40px);
        background:#fff;
        color:rgb(173,173,173);
        text-align:left;
        padding-left:20px;
        margin:20px 0;
    }
    .container{
        height:100%;
        background:rgb(247,247,247);
        .feedback{
            padding: 30px 20px 10px 20px;
            .p-rl;
            .count{
                .p-ab;
                right:25px;
                bottom:15px;
                color:#adadad;
            }
        }
        .cert-container{
            text-align: left;
            padding: 5px 20px;
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
    }
</style>

