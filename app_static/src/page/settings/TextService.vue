<template>
    <div class="container">
        <div class="body">
            <mt-cell title="修改服务价格需平台审核，每月可修改3次" is-link class="cell-con info"></mt-cell>
            <mt-cell title="文字服务" class="cell-con">
                <mt-switch v-model="priceData.available"></mt-switch>
            </mt-cell>
            <mt-cell title="价格" class="cell-con" v-if="priceData.available">
                <div class="price-wrapper">
                    <span>设定价</span>
                    <input class="entry" type="number" min="0.05" max="20" v-model="priceData.price"/>元/条
                    <p class="tax-price">显示价(含税)：{{priceData.price | getTaxPrice}}元/条</p>
                </div>
            </mt-cell>
            <mt-cell title="最低服务数量" class="cell-con" v-if="priceData.available">
                <div class="price-wrapper">
                    <input class="entry" type="number" min="5" v-model="priceData.timecircle"/>条
                </div>
            </mt-cell>
            <mt-cell title="起步价" class="cell-con" :value="priceData.price * priceData.timecircle" v-if="priceData.available">
                
            </mt-cell>
            <div class="reminder">
                <p>温馨提示：</p>
                <p>1、文字服务为即时服务，订单将在倾诉者下单后开始计时，为保证服务质量，请您做好即时服务准备。</p>
                <p>2、平台将按含税价展示文字服务价格，订单收益按不含税交易额计算。</p>
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
import {EPriceCircle} from "../../enum/EPriceCircle.ts";
import {EPriceStatus} from "../../enum/EPriceStatus.ts";
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
    },
    filters: {
        getTaxPrice:(price:number)=>{
            return (price*(1+0.066)).toFixed(2);
        }
    }
})
export default class TextService extends Vue{
    private priceData:any = {};
    created(){
        if((<any>this).user.pricesettings){
            let priceData = (<any>this).user.pricesettings.find((price:any)=>price.type==EPriceType.EWord);
            if(priceData){
                priceData.available = priceData.status==EPriceStatus.Enable;
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
                msg : '最低服务数量必须是数字'
            };
        }
        if(price.price<0.05||price.price>20){
            return {
                success : false,
                msg : '文字服务价格需大于等于0.05/条小于等于20/条'
            };
        }
        if(price.timecircle<=5){
            return {
                success : false,
                msg : '最低服务数量需大于5条'
            };
        }
        return {success:true,msg:''};
    }

    save(){
        const prices:any = {
            id:this.priceData.id,
            type:this.priceData.type,
            status:this.priceData.available?EPriceStatus.Enable:EPriceStatus.Disable,
            price:parseFloat(this.priceData.price),
            timecircle:parseInt(this.priceData.timecircle)
        };
        const result = this.checkPrice(prices);
        if(!result.success){
            this.$toast(result.msg);
            return;
        }
        listenerService.updatePrice({prices:JSON.stringify([prices]),type:EPriceType.EWord}).then((res:any)=>{
            if(res.data.success){
                this.$toast('保存成功');
                (<any>this).setPrices([prices]);
                this.$router.back();
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
        padding-bottom:50px;
        .p-rl;
    }
    .body{
        .info{
            .f-nm;
            background: rgb(255,253,228);
            color: rgb(230,162,92);
        }
        .cell-con .price-wrapper{
            line-height: 20px;
            .entry{
                outline: none;
                border:none;
                border-radius:0;
                border-bottom:1px solid @mainColor;
                width: 30px;
                text-align:center;
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
