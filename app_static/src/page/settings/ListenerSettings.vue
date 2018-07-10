<template>
    <div class="container">
        <div class="body">
            <div class="title">个人设置</div>
            <div @click="toPage('baseInfo')">
                <mt-cell title="基本资料" is-link class="cell-con"></mt-cell>
            </div>
            <div @click="toPage('myTags')" class="cell-box">
                <mt-cell title="我的标签" is-link class="cell-con cell-prev">
                    <span class="cell-text">{{myTagsPreview.join(',')}}</span>
                </mt-cell>
            </div>
            <div @click="toPage('personalInfo')" class="cell-box">
                <mt-cell title="个人信息" is-link class="cell-con cell-prev">
                    <span class="cell-text">{{myExpPreview.join(',')}}</span>
                </mt-cell>
            </div>
            <div @click="toPage('otherInfo')" class="cell-box">
                <mt-cell title="其他资料" is-link class="cell-con cell-prev">
                    <span class="cell-text">{{myOtherPreview.join(',')}}</span>
                </mt-cell>
            </div>
            <div class="title">
                费用设置
            </div>
            <div @click="toPage('textService')" class="cell-box">
                <mt-cell title="文字服务" is-link class="cell-con cell-prev">
                    <span v-if="this.textPrice.price" class="cell-text">{{this.textPrice.price}}元/{{this.textPrice.timecircle*15}}分钟</span>
                </mt-cell>
            </div>
            <div @click="toPage('callService')" class="cell-box">
                <mt-cell title="通话服务" is-link class="cell-con cell-prev">
                    <span v-if="this.callPrice.price" class="cell-text">{{this.callPrice.price}}元/{{this.callPrice.timecircle}}分钟</span>
                </mt-cell>
            </div>
            <mt-cell title="暂不接单" class="cell-con" @click.native.prevent="changeBusinessStatus">
                <mt-switch v-model="isNotReceive"></mt-switch>
            </mt-cell>
            <div class="button-box">
                <mt-button size="normal" type="primary" @click.native="cancelListener">取消倾听者身份</mt-button>
            </div>
            <mt-popup
                v-model="showAlertWin" 
                class="custom">
                <div class="custom-title">提示</div>
                <div class="content">
                    开启后，接单状态将变为休息中，且倾诉者无法向您下单
                </div>
                <div class="button-box">
                    <mt-button size="normal" type="primary" @click.native="doNotBusiness">确定</mt-button>
                </div>
            </mt-popup>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import { mapGetters,mapActions } from 'vuex';
import {ERecieveStatus} from '../../enum/ERecieveStatus';
import {EPriceType} from "../../enum/EPriceType.ts";
import {EPriceStatus} from "../../enum/EPriceStatus.ts"
import ListenerService from "../../api/ListenerService.ts";
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
export default class ListenerSettings extends Vue{
    private isNotReceive = false;
    private showAlertWin = false;
    private myTagsPreview:any = [];
    private myExpPreview:any = [];
    private myOtherPreview:any=[];
    private callPrice:any={};
    private textPrice:any={};
   
    created(){
        const user = (<any>this).user;
        if(user&&user.listener){
            const otherInfos = ['familyname','eduname','jobname'];
            this.isNotReceive = user.listener.recievestatus === ERecieveStatus.休息中;
            user.listener.labels.forEach((label:any)=>{
                this.myTagsPreview.push(label.name);
            });
            user.listener.exps.forEach((exp:any)=>{
                this.myExpPreview.push(exp.name);
            });
            otherInfos.forEach((key:string)=>{
                this.myOtherPreview.push(user.listener[key]||'');
            });
        }
        if(user&&user.pricesettings){
            this.setPricePrev(user.pricesettings);
        }
    }

    setPricePrev(prices:Array<any>){
        this.callPrice = prices.find((price:any)=>price.type===EPriceType.ECall&&price.status===EPriceStatus.Enable)||{price:''};
        this.textPrice = prices.filter(item=>item.type===EPriceType.EWord&&item.status===EPriceStatus.Enable)[0]||{price:''};
    }

    changeBusinessStatus(){
        if(!this.isNotReceive){
            //TODO:向后台发请求，设置接单状态
            this.showAlertWin = true;
            return;
        }
        listenerService.setReceiveStatus({status:ERecieveStatus.可接单}).then((res:any)=>{
            if(res.data.success){
                this.$toast('设置成功');
                //TODO:设置成功后，将该字段更新到store里，单写一个更新store字段的方法
                (<any>this).setListenerData({recievestatus:ERecieveStatus.可接单});
                this.isNotReceive = false;
            }else{
                this.$toast(res.data.message);
            }
        });
    }

    doNotBusiness(){
        listenerService.setReceiveStatus({status:ERecieveStatus.休息中}).then((res:any)=>{
            if(res.data.success){
                this.$toast('设置成功');
                (<any>this).setListenerData({recievestatus:ERecieveStatus.休息中});
                this.isNotReceive = true;
                this.showAlertWin = false;
            }else{
                this.$toast(res.data.message);
            }
        });
    }

    cancelListener(){
        //TODO:向后台发请求，取消倾听者身份
    }

    toPage(route:string){
        let query:any = {};
        if(route==="baseInfo"){
            query.from = "my";
        }
        this.$router.push({
            path:'/'+route,
            query
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
        .title{
            .v-middle(40px);
            background:rgb(247,247,247);
            color:rgb(173,173,173);
            text-align:left;
            padding-left:20px;
        }
        a.cell-con{
            padding-left:0;
            .cell-text{
                .t-ellipsis(1)
            }
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
            text-align:left;
            padding:10px;
        }
    }
</style>
