<template>
    <div class="container">
        <div class="text" v-if="label">{{label}}</div>
        <div class="rate">
            <el-rate
                @change="rateChange"
                v-model="curValue"
                :disabled="disabled"
                :show-score="showScore"
                text-color="#00D1CF"
                :colors="['#00D1CF', '#00D1CF', '#00D1CF']"
                score-template="{value}">
            </el-rate>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Watch} from 'vue-property-decorator';
import {Prop,Model} from "vue-property-decorator"; 

@Component
export default class Rate extends Vue{
    private curValue = 0;
    @Model("change",{
        default:0
    })
    value:0;

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

    @Prop({
        type:Boolean,
        default:true
    })
    showScore:boolean

    created(){
        this.curValue = this.value;
    }

    @Watch('value')
    valueWatch(newValue:number,oldValue:number){
        this.curValue = newValue;
    }

    rateChange(score:number){
        this.$emit('change',score);
    }
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


