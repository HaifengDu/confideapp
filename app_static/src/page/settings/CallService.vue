<template>
    <div class="container">
        <div class="body">
            <mt-cell title="修改服务价格需平台审核，每月可修改2次" is-link class="cell-con info"></mt-cell>
            <mt-cell title="通话服务" class="cell-con">
                <mt-switch v-model="isSetCall"></mt-switch>
            </mt-cell>
            <mt-cell title="设置单价" class="cell-con" v-if="isSetCall">
                <div class="price-wrapper">
                    <div class="price" @click="changePrice()">
                        <img src="static/images/settings/edit.png"/>0.61元
                    </div>
                    <p>含税价：0.66元</p>
                </div>
            </mt-cell>
            <mt-cell title="最低服务时长" class="cell-con" v-if="isSetCall">
                <div class="price-wrapper" @click="changeTime()">
                    <div class="price">
                        <img src="static/images/settings/edit.png"/>15分钟
                    </div>
                </div>
            </mt-cell>
            <mt-cell title="起步价" class="cell-con" value="9.9元" v-if="isSetCall">
                
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

@Component({

})
export default class CallService extends Vue{
    //是否设置通话服务
    private isSetCall = true;
    created(){
        console.log(888);
    }

    changePrice(){
        console.log(999);
    }

    changeTime(){

    }

    save(){
       
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
