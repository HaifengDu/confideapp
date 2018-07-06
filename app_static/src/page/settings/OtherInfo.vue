<template>
    <div class="container">
        <div class="body" v-if="!showMenu">
            <div class="list">
                <mt-cell title="职业信息" class="cell-con" @click.native="selectJob">
                    <span style="right:25px;position:relative;">{{jobName}}</span>
                    <i class="mint-cell-allow-right"></i>
                </mt-cell>
            </div>
            <div class="list">
                <mt-cell title="家庭状况"  class="cell-con">
                    <select v-model="informations.family">
                        <option :value="item.code" :key="index" v-for="(item,index) in familyDatas">{{item.name}}</option>
                    </select>
                    <i class="mint-cell-allow-right"></i>
                </mt-cell>
            </div>
            <div class="list">
                <mt-cell title="教育水平"  class="cell-con">
                    <select v-model="informations.edu">
                        <option :value="item.code" :key="index" v-for="(item,index) in educateDatas">{{item.name}}</option>
                    </select>
                    <i class="mint-cell-allow-right"></i>
                </mt-cell>
            </div>
            <div class="button-box">
                <mt-button size="normal" type="primary" @click.native="submitInfo">提交资料</mt-button>
            </div>
        </div>
        <mt-popup style="width:100%;height:100%;"
            v-model="showMenu"
            :modal="false"
            position="right">
            <two-level-menu v-if="showMenu" :lists="this.jobs" @changeMenu="changeMenu"></two-level-menu>
        </mt-popup>
        <!-- <mt-button type="primary" size="large" class="submit-btn" >提交资料</mt-button> -->
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import UserService from "../../api/UserService";
import { EBaseDataType } from '../../enum/EBaseDataType';
import TwoLevelMenu from "@/components/TwoLevelMenu.vue";
import {mapActions} from "vuex";
import {INoopPromise} from "../../util/methods"

@Component({
    components:{
        "two-level-menu":TwoLevelMenu
    },
    methods:{
        ...mapActions(["updateOther"])
    }
})
export default class OtherInfo extends Vue{
    private service = UserService.getInstance();
    private jobs:Array<any> = [];
    private familyDatas:Array<any> = [];
    private educateDatas:Array<any> = [];
    private informations:any = {};
    private jobName = "";
    private showMenu = false;
    private updateOther:INoopPromise;
    created(){
        this.service.getBase(EBaseDataType.Job).then(res=>{
            this.jobs = res.data.data;
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

    selectJob(){
        if(this.jobs&&this.jobs.length){
            this.showMenu = !this.showMenu;
        }
    }

    changeMenu(menu:any){
        if(menu){
            this.showMenu = false;
            this.jobName = menu.name;
            this.informations.job = menu.id;
        }
    }

    submitInfo(){
        console.log(this.informations);
        this.updateOther(this.informations).then(res=>{
            const data = res.data;
            if(data.success){
                this.$toast("修改成功");
                this.$router.back();
            }else{
                this.$toast(data.message);
            }
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
    }
    .body{
        .list{
            text-align:left;
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
    // .submit-btn{
    //     border-radius:0;
    //     position:fixed;
    //     bottom:0;
    // }
</style>
