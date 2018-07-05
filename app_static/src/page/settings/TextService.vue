<template>
    <div class="container">
        <div class="body">
            <mt-cell title="修改服务价格需平台审核，每月可修改3次" is-link class="cell-con info"></mt-cell>
            <mt-cell title="15分钟文字服务" class="cell-con">
                <mt-switch v-model="isFirstLevel"></mt-switch>
            </mt-cell>
            <mt-cell title="价格" class="cell-con" v-if="isFirstLevel">
                <div class="price-wrapper">
                    <span>设定价</span>
                    <input class="entry" type="number" min="5" max="100" v-model="firstValue"/>元
                    <p class="tax-price">显示价(含税)：4.91元</p>
                </div>
            </mt-cell>
            <mt-cell title="30分钟文字服务" class="cell-con">
                <mt-switch v-model="isSecondLevel"></mt-switch>
            </mt-cell>
            <mt-cell title="价格" class="cell-con" v-if="isSecondLevel">
                <div class="price-wrapper">
                    <span>设定价</span>
                    <input class="entry" type="number" min="5" max="200" v-model="secondValue"/>元
                    <p class="tax-price">显示价(含税)：9.81元</p>
                </div>
            </mt-cell>
            <mt-cell title="45分钟文字服务" class="cell-con">
                <mt-switch v-model="isThirdLevel"></mt-switch>
            </mt-cell>
            <mt-cell title="价格" class="cell-con" v-if="isThirdLevel">
                <div class="price-wrapper">
                    <span>设定价</span>
                    <input class="entry" type="number" min="5" max="300" v-model="thirdValue"/>元
                    <p class="tax-price">显示价(含税)：19.8元</p>
                </div>
            </mt-cell>
            <mt-cell title="60分钟文字服务" class="cell-con">
                <mt-switch v-model="isFourthLevel"></mt-switch>
            </mt-cell>
            <mt-cell title="价格" class="cell-con" v-if="isFourthLevel">
                <div class="price-wrapper">
                    <span class="design">设定价</span>
                    <input class="entry" type="number" min="5" max="400" v-model="fourthValue"/>元
                    <p class="tax-price">显示价(含税)：2000.8元</p>
                </div>
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
const listenerService = ListenerService.getInstance();

@Component({

})
export default class TextService extends Vue{
    //是否开启15分钟文字服务
    private isFirstLevel = true;
    //是否开启30分钟文字服务
    private isSecondLevel = true;
    //是否开启45分钟文字服务
    private isThirdLevel = true;
    //是否开启60分钟文字服务
    private isFourthLevel = true;
    
    private firstValue = "4.6";
    private secondValue = "4.6";
    private thirdValue = "4.6";
    private fourthValue = "4.6";
    created(){
        //TODO:获取该用户相关的文字服务费用设置数据
        listenerService.getPrice({type:EPriceType.EWord}).then((res:any)=>{
            console.log(res);
        });
    }

    changePrice(type:string){
        console.log(type);
    }

    save(){
       console.log(this.isFirstLevel);
       console.log(this.isSecondLevel);
       console.log(this.isThirdLevel);
       console.log(this.isFourthLevel);
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
