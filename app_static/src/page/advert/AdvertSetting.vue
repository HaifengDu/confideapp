<template>
    <div class="container">
        <div class="body">
            <div class="title">用户单价（元）</div>
            <div class="price">
                <div class="content">
                    同等服务质量的，单价越高曝光越多，同一用户当日所有访问只记一次（只扣一次费用）。
                </div>
            </div>
            <div class="title price-number">
                <el-input-number v-model="price" :min="0.1" :step="0.1"></el-input-number>
            </div>
            <div class="divider"></div>
            <div class="title">推广排名</div>
            <div class="info">
                <div>
                    <p class="count">66~99</p>
                    <p class="content">预计首页排名</p>
                </div>
                <!-- <div>
                    <p class="count">11.3倍</p>
                    <p class="content">预计曝光增长</p>
                </div> -->
            </div>
            <div class="reminder">
                <p>推广排名由用户单价决定，提高单价有利于您获得更靠前的排名。</p>
            </div>
            <div class="divider"></div>
            <mt-cell title="推广预算设置" class="cell-con">
                <mt-switch v-model="isOpenAdvLimit"></mt-switch>
            </mt-cell>
            <mt-cell title="当日预算金额" class="cell-con" v-if="isOpenAdvLimit">
                <div class="price-wrapper">
                    <input class="entry" type="number" v-model="limitPrice"/> 元
                </div>
            </mt-cell>
            <div class="reminder">
                <p>开启推广预算设置后，您可以设置当日的推广预算金额（扣费上限）。当推广扣费达到该价格时，系统将为您暂停推广直至次日凌晨0点。关闭后再次开启时，推广扣费达到新的预算值才会自动暂停。</p>
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
export default class AdvertSetting extends Vue{
    private isOpenAdvLimit = false;
    private limitPrice = 0;
    private price = 0.1;

    save(){
        console.log('save settings...');
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
        padding-bottom:65px;
    }
    .title{
        .p-rl;
        .v-middle(40px);
        background:rgb(247,247,247);
        color:rgb(173,173,173);
        text-align:left;
        padding-left:20px;
    }
    .title.price-number{
        padding: 10px 20px;
        text-align: right;
        background: #fff;
    }
    .divider{
        height:10px;
        background:#eee;
    }
    .custom-price{
        .p-ab;
        right:20px;
        top:10px;
        outline: none;
        border:none;
        border-bottom:1px solid @mainColor;
        width: 50px;
        border-radius:0;
        background: rgb(247,247,247);

    }
    .info{
        width:100%;
        padding-top:30px;
        display:flex;
        flex-direction: row;
        div{
            flex-grow: 1;
            .count,.content{
                padding:10px 0;
            }
            .count{
                font-size:16px;
                color:rgb(231,165,50);
            }
        }
    }
    .body{
        .price{
            .content{
                text-align: left;
                padding: 10px 20px;
                color:rgb(181,181,181);
            }
        }
        .cell-con .price-wrapper{
            line-height: 20px;
            .entry{
                outline: none;
                border:none;
                border-radius:0;
                border-bottom:1px solid @mainColor;
                width: 50px;
            }
        }
        .reminder{
            text-align:justify;
            color:rgb(181,181,181);
            padding:20px;
        }
    }
</style>
