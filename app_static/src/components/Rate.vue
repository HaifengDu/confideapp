<template>
    <div class="container">
        <div class="text" v-if="label">{{label}}</div>
        <div class="rate">
            <el-rate
                v-model="value"
                :disabled="disabled"
                show-score
                text-color="#00D1CF"
                :colors="['#00D1CF', '#00D1CF', '#00D1CF']"
                score-template="{value}">
            </el-rate>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {Prop} from "vue-property-decorator"; 

@Component
export default class Rate extends Vue{
    
    @Prop({
        type:Object,
        default:{}
    })
    value:any

    @Prop({
        type:Boolean,
        default:false
    })
    disabled:boolean

    @Prop({
        type:String,
        default:''
    })
    label:string
}
</script>

<style lang="less" scoped>
    @import '../assets/style.less';
    .container{
        padding:5px 0;
        overflow: hidden;
        .text,.rate{
            float:left;
            text-align:left;
        }
        .text{
            width:30%;
            color:@textColor;
        }
        .rate{
            width:70%;
        }
    }
</style>


