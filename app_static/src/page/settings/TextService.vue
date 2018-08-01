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
                    <input class="entry" type="number" min="0.6" max="20" v-model="priceData.price"/>元/条
                    <p class="tax-price">显示价(含税)：{{priceData.price | getTaxPrice}}元/条</p>
                </div>
            </mt-cell>
            <mt-cell title="最低服务数量" class="cell-con" v-if="priceData.available">
                <div class="price-wrapper">
                    <input class="entry" type="number" min="15" v-model="priceData.timecircle"/>条
                </div>
            </mt-cell>
            <mt-cell title="起步价" class="cell-con" value="9.9元" v-if="priceData.available">
                
            </mt-cell>
            <!-- <div v-for="(item,index) in priceDatas" :key="index">
                <mt-cell :title="titles[item.timecircle-1]" class="cell-con">
                    <mt-switch v-model="item.available"></mt-switch>
                </mt-cell>
                <mt-cell title="价格" class="cell-con" v-if="item.available">
                    <div class="price-wrapper">
                        <span>设定价</span>
                        <input class="entry" type="number" min="5" max="100" v-model="item.price"/>元
                        <p class="tax-price">显示价(含税)：{{calPriceWithTax(item.price)}}元</p>
                    </div>
                </mt-cell>
            </div> -->
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
    // private priceDatas:any = [];
    // private titles = ['15分钟文字服务','30分钟文字服务','45分钟文字服务','60分钟文字服务'];
    private priceData:any = {};
    created(){
        if((<any>this).user.pricesettings){
            let priceData = (<any>this).user.pricesettings.find((price:any)=>price.type==EPriceType.EWord);
            // prices.forEach((item:any)=>{
            //     let tempData = Object.assign({},item);
            //     tempData.available = tempData.status==EPriceStatus.Enable;
            //     this.priceDatas.push(tempData);
            // });
            if(priceData){
                priceData.available = priceData.status==EPriceStatus.Enable;
                this.priceData = Object.assign({},priceData);
            }
        }
    }

    // pricesCheck(prices:any){
    //     let result = {success:true,msg:''}
    //     for(let i=0;i<prices.length;i++){
    //         if(isNaN(prices[i].price)){
    //             result.success = false;
    //             result.msg = '请输入数字';
    //             break;
    //         }
    //         if(prices[i].timecircle === EPriceCircle.Fifteen && (prices[i].price<5||prices[i].price>100)){
    //             result.success = false;
    //             result.msg = '15分钟文字服务价格需大于等于5小于等于100';
    //             break;
    //         }
    //         if(prices[i].timecircle === EPriceCircle.Thirty && (prices[i].price<5||prices[i].price>200)){
    //             result.success = false;
    //             result.msg = '30分钟文字服务价格需大于等于5小于等于200';
    //             break;
    //         }
    //         if(prices[i].timecircle === EPriceCircle.FortyFive && (prices[i].price<5||prices[i].price>300)){
    //             result.success = false;
    //             result.msg = '45分钟文字服务价格需大于等于5小于等于300';
    //             break;
    //         }
    //         if(prices[i].timecircle === EPriceCircle.Sixty && (prices[i].price<5||prices[i].price>400)){
    //             result.success = false;
    //             result.msg = '60分钟文字服务价格需大于等于5小于等于400';
    //             break;
    //         }
    //     }
    //     return result;
    // }

    // save(){
    //     let prices:any = [];
    //     this.priceDatas.forEach((price:any)=>{
    //         prices.push({
    //             id:price.id,
    //             type:price.type,
    //             status:price.available?EPriceStatus.Enable:EPriceStatus.Disable,
    //             timecircle:price.timecircle,
    //             price:parseFloat(price.price)
    //         });
    //     });
    //     const result = this.pricesCheck(prices);
    //     if(!result.success){
    //         this.$toast(result.msg);
    //         return;
    //     }
    //     listenerService.updatePrice({prices:JSON.stringify(prices),type:EPriceType.EWord}).then((res:any)=>{
    //         if(res.data.success){
    //             this.$toast('保存成功');
    //             (<any>this).setPrices(prices);
    //             this.$router.back();
    //         }else{
    //             this.$toast(res.data.message);
    //         }
    //     });
    // }

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
        if(price.price<0.6||price.price>20){
            return {
                success : false,
                msg : '文字服务价格需大于等于0.6/条小于等于20/条'
            };
        }
        if(price.timecircle<15){
            return {
                success : false,
                msg : '最低服务数量需大于10条'
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
