<template>
    <div class="container">
        <div class="body">
            <mt-cell title="修改服务价格需平台审核，每月可修改2次" is-link class="cell-con info"></mt-cell>
            <mt-cell title="通话服务" class="cell-con">
                <mt-switch v-model="isSetCall"></mt-switch>
            </mt-cell>
            <mt-cell title="价格" class="cell-con" v-if="isSetCall">
                <div class="price-wrapper">
                    <span>设定价</span>
                    <input class="entry" type="number" min="0.6" max="20" v-model="callPrice"/>元
                    <p class="tax-price">显示价(含税)：0.66元</p>
                </div>
            </mt-cell>
            <mt-cell title="最低服务时长" class="cell-con" v-if="isSetCall">
                <div class="price-wrapper">
                    <input class="entry" type="number" min="15" v-model="minCallTime"/>分钟
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
    private callPrice = 0.66;
    private minCallTime = 15;
    created(){
        console.log(888);
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
            line-height: 20px;
            .entry{
                outline: none;
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
