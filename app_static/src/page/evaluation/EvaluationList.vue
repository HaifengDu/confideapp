<template>
    <div>
        <div class="header">
            <div class="evaluation">
                <div class="rate-box">
                    <rate :value="rate.timely" :disabled="true" label="及时服务"></rate>
                    <rate :value="rate.attitude" :disabled="true" label="服务态度"></rate>
                    <rate :value="rate.ability" :disabled="true" label="服务能力"></rate>
                </div>
            </div>
            <div class="good-eva">
                <div class="eva-box">
                    <p class="rate">100%</p>
                    <p class="text">好评率</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator'; 
import Rate from "@/components/Rate.vue";

@Component({
    components:{
        'rate':Rate
    }
})
export default class EvaluationList extends Vue {
    private rate:any = {
        timely:5,
        attitude:5,
        ability:5
    }

    created(){
        console.log(666);
    }
}
</script>

<style lang="less" scoped>
    @import '../../assets/style.less';
    @orange:rgb(239,146,55);
    *{
        .f-nm;
    }
    .container{
        .p-rl;
    }
    .custom-title{
        .p-rl;
        .v-middle(40px);
        background:rgb(247,247,247);
        color:@gray;
        text-align:left;
        padding-left:20px;
    }
    .header{
        padding:25px 20px;
        border-bottom: 1px solid @gray;
        overflow: hidden;
        .evaluation,.good-eva{
            height:100px;
            .f-nm;
            box-sizing: border-box;
            float: left;
        }
        .evaluation{
            width:70%;
            border-right:1px solid @gray;
            .rate-box{
                margin-top:5px;
            }
        }
        .good-eva{
            width:30%;
            .rate{
                font-size:24px;
                color:@mainColor;
                margin-bottom:10px;
            }
            .text{
                font-size:14px;
                color:@textColor;
            }
            .eva-box{
                margin-top:50%;
                transform:translate(0,-50%);
            }
        }
    }
</style>


