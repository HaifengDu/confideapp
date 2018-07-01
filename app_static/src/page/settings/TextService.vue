<template>
    <div class="container">
        <div class="body">
            <mt-cell title="修改服务价格需平台审核，每月可修改2次" is-link class="cell-con info"></mt-cell>
            <mt-cell title="15分钟文字服务" class="cell-con">
                <mt-switch v-model="isFirstLevel"></mt-switch>
            </mt-cell>
            <mt-cell title="价格" class="cell-con" v-if="isFirstLevel">
                <div class="price-wrapper">
                    <div class="price" @click="changePrice('first')">
                        <img src="static/images/settings/edit.png"/>4.6元
                    </div>
                    <p>含税价：4.91元</p>
                </div>
            </mt-cell>
            <mt-cell title="30分钟文字服务" class="cell-con">
                <mt-switch v-model="isSecondLevel"></mt-switch>
            </mt-cell>
            <mt-cell title="价格" class="cell-con" v-if="isSecondLevel">
                <div class="price-wrapper" @click="changePrice('second')">
                    <div class="price">
                        <img src="static/images/settings/edit.png"/>9.2元
                    </div>
                    <p>含税价：9.81元</p>
                </div>
            </mt-cell>
            <mt-cell title="60分钟文字服务" class="cell-con">
                <mt-switch v-model="isThirdLevel"></mt-switch>
            </mt-cell>
            <mt-cell title="价格" class="cell-con" v-if="isThirdLevel">
                <div class="price-wrapper" @click="changePrice('third')">
                    <div class="price">
                        <img src="static/images/settings/edit.png"/>19.8元
                    </div>
                    <p>含税价：21.11元</p>
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

@Component({

})
export default class TextService extends Vue{
    //是否开启15分钟文字服务
    private isFirstLevel = true;
    //是否开启30分钟文字服务
    private isSecondLevel = true;
    //是否开启60分钟文字服务
    private isThirdLevel = true;
    created(){
        console.log(888);
    }

    changePrice(type:string){
        console.log(type);
    }

    save(){
       console.log(this.isFirstLevel);
       console.log(this.isSecondLevel);
       console.log(this.isThirdLevel);
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
            text-align:right;
            display: flex;
            flex-direction: column;
            .price{
                font-size:16px;
                color:@light-blue;
                padding-bottom:5px;
                img{
                    width:20px;
                    margin-right:5px;
                    vertical-align: bottom;
                }
            }
            .tax-price{
                color:rgb(181,181,181);
            }
        }
        .reminder{
            text-align:left;
            color:rgb(181,181,181);
            padding:20px;
        }
    }
</style>
