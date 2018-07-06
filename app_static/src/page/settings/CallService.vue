<template>
    <div class="container">
        <div class="body">
            <mt-cell title="修改服务价格需平台审核，每月可修改3次" is-link class="cell-con info"></mt-cell>
            <mt-cell title="通话服务" class="cell-con">
                <mt-switch v-model="priceData.available"></mt-switch>
            </mt-cell>
            <mt-cell title="价格" class="cell-con" v-if="priceData.available">
                <div class="price-wrapper">
                    <span>设定价</span>
                    <input class="entry" type="number" min="0.6" max="20" v-model="priceData.price"/>元
                    <p class="tax-price">显示价(含税)：{{priceData.taxprice}}元</p>
                </div>
            </mt-cell>
            <mt-cell title="最低服务时长" class="cell-con" v-if="priceData.available">
                <div class="price-wrapper">
                    <input class="entry" type="number" min="15" v-model="priceData.timecircle"/>分钟
                </div>
            </mt-cell>
            <mt-cell title="起步价" class="cell-con" value="9.9元" v-if="priceData.available">
                
            </mt-cell>
            <div class="reminder">
                <p>温馨提示：</p>
                <p>平台将按15分钟展示服务价格（含税），订单收益按不含税交易额计算。</p>
            </div>
        </div>
        <div class="button-box">
            <mt-button size="normal" type="primary" @click.native="save">保存设置</mt-button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import ListenerService from "../../api/ListenerService.ts";
import {EPriceType} from "../../enum/EPriceType.ts";
import {mapGetters,mapActions} from 'vuex';
const listenerService = ListenerService.getInstance();

@Component({
    methods:{
        ...mapActions({
            setPrices:'setPrices'
        })
    },
    computed:{
        ...mapGetters({
            user:'user'
        })
    }
})
export default class CallService extends Vue{
    //是否设置通话服务
    private priceData:any = {};
    //TODO:设置最低价格、计算税后价格
    created(){
        if((<any>this).user.pricesettings){
            let priceData = (<any>this).user.pricesettings.find((price:any)=>price.type==EPriceType.ECall);
            if(priceData){
                priceData.available = priceData.status==1;
                this.priceData = Object.assign({},priceData);
            }
            
        }
    }

    checkPrice(price:any){
        if(isNaN(price.price)){
           return {
                success : false,
                msg : '设定价格必须是数字'
            };
        }
        if(isNaN(price.timecircle)){
            return {
                success : false,
                msg : '最低时长必须是数字'
            };
        }
        if(price.price<0.6||price.price>20){
            return {
                success : false,
                msg : '通话服务价格需大于等于0.6小于等于20'
            };
        }
        if(price.timecircle<15){
            return {
                success : false,
                msg : '最低服务时长需大于15分钟'
            };
        }
        return {success:true,msg:''};
    }

    save(){
        const prices:any = {
            id:this.priceData.id,
            type:this.priceData.type,
            status:this.priceData.available?1:0,
            price:parseFloat(this.priceData.price),
            timecircle:parseInt(this.priceData.timecircle)
        };
        const result = this.checkPrice(prices);
        if(!result.success){
            this.$toast(result.msg);
            return;
        }
        listenerService.updatePrice({prices:JSON.stringify([prices]),type:EPriceType.ECall}).then((res:any)=>{
            if(res.data.success){
                this.$toast('保存成功');
                (<any>this).setPrices([prices]);
            }else{
                this.$toast(res.data.message);
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
        .info{
            background: rgb(255,253,228);
            color: rgb(230,162,92);
        }
        .cell-con .price-wrapper{
            line-height: 20px;
            .entry{
                outline: none;
                border:none;
                border-bottom:1px solid @mainColor;
                width: 50px;
            }
            .tax-price{
                padding-left:10px;
                color:rgb(181,181,181);
            }
            .tax-price,.design,.entry{
                .i-bl;
            }
        }
        .reminder{
            text-align:left;
            color:rgb(181,181,181);
            padding:20px;
        }
    }
</style>
