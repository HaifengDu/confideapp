<template>
    <div class="container">
        <div class="body">
            <div class="list">
                <mt-cell title="职业信息">
                <select v-model="informations.job">
                    <option :value="item.code" :key="index" v-for="(item,index) in jobs">{{item.name}}</option>
                </select>
                <i class="mint-cell-allow-right"></i>
                </mt-cell>
            </div>
            <div class="list">
                <mt-cell title="家庭状况">
                <select v-model="informations.family">
                    <option :value="item.code" :key="index" v-for="(item,index) in familyDatas">{{item.name}}</option>
                </select>
                <i class="mint-cell-allow-right"></i>
                </mt-cell>
            </div>
            <div class="list">
                <mt-cell title="教育水平">
                <select v-model="informations.educate">
                    <option :value="item.code" :key="index" v-for="(item,index) in educateDatas">{{item.name}}</option>
                </select>
                <i class="mint-cell-allow-right"></i>
                </mt-cell>
            </div>
        </div>
        <div class="back" @click="back"></div>
        <mt-button type="primary" size="large" class="submit-btn" @click.native="submitInfo">提交资料</mt-button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import UserService from "../../api/UserService";
import { EBaseDataType } from '../../enum/EBaseDataType';

@Component({

})
export default class OtherInfo extends Vue{
    private service = UserService.getInstance();
    private jobs:Array<any> = [];
    private familyDatas:Array<any> = [];
    private educateDatas:Array<any> = [];
    private informations:any = {};
    created(){
        this.service.getBase(EBaseDataType.Job).then(res=>{
            let data = res.data.data;
            for(var key in data){
                this.jobs.push({
                    code:key,
                    name:data[key].name
                });
            }
        });
        this.service.getBase(EBaseDataType.Family).then(res=>{
            let data = res.data.data;
            for(var key in data){
                this.familyDatas.push({
                    code:key,
                    name:data[key].name
                });
            }
        });
        this.service.getBase(EBaseDataType.Edu).then(res=>{
            let data = res.data.data;
            for(var key in data){
                this.educateDatas.push({
                    code:key,
                    name:data[key].name
                });
            }
        });
    }

    back(){
        (<any>this).$router.go(-1);
    }
    submitInfo(){
        console.log(this.informations);
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
    .body{
        .list{
            text-align:left;
            padding-left:1rem;
            select{
                border:none;
                height:48px;
                appearance:none;
                -moz-appearance:none;
                -webkit-appearance:none;
                background-image: none;
                background: no-repeat scroll right center transparent;
                margin-right:25px;
                color:#888;
                font-size:1.4rem;
                direction: rtl;
            }
            .mint-cell-value.is-link {
                img{
                height:4.2rem;
                width:4.2rem;
                border-radius:1.6rem;
                }
            }
        }
    }
    .submit-btn{
        border-radius:0;
        position:fixed;
        bottom:0;
    }
</style>
