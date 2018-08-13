<template>
    <div class="container">
        <div class="title">本次服务是否满意</div>
        <div class="evaluation">
            <div class="eva" 
                v-for="(eva,index) in evas" 
                :key="index">
                <div class="con" @click="evaChange(eva)" :class="{'active':eva.active}">
                    <div class="icon"><img :src="eva.active?eva.acSrc:eva.src"></div>
                    <p class="text">{{eva.text}}</p>
                </div>
            </div>
        </div>
        <div class="title">服务改进计划</div>
        <div class="improve">
            <div class="info">您的评分有助于我们为您提供更好的服务（该项评分仅平台可见）</div>
            <div class="rate-box">
                <rate :value="rate.timely" :show-score="false" label="及时服务"></rate>
                <rate :value="rate.attitude" :show-score="false" label="服务态度"></rate>
                <rate :value="rate.ability" :show-score="false" label="服务能力"></rate>
            </div>
        </div>
        <div class="suggest">
            <el-input
                type="textarea"
                :rows="6"
                placeholder="您的评价能够帮助其他倾诉者哦"
                v-model="suggest">
            </el-input>
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
export default class AddEvaluation extends Vue{
    private orderId:string = '';
    private suggest:string = '';
    private rate:any = {
        timely:0,
        attitude:0,
        ability:0
    }
    private evas:any = [
        {id:1,text:'不满意',num:2,active:false,src:'/static/images/evaluation/bad.png',acSrc:'/static/images/evaluation/bad_active.png'},
        {id:2,text:'一般',num:0,active:false,src:'/static/images/evaluation/normal.png',acSrc:'/static/images/evaluation/normal_active.png'},
        {id:3,text:'满意',num:0,active:false,src:'/static/images/evaluation/good.png',acSrc:'/static/images/evaluation/good_active.png'},
    ];

    created(){
        this.orderId = this.$route.params.id;

    }

    evaChange(eva:any){
        eva.active = !eva.active;
        this.evas.forEach((item:any)=>{
            item.id!=eva.id&&(item.active = false);
        });
    }
}
</script>

<style lang="less" scoped>
    @import '../../assets/style.less';
    .container{
        .title{
            .v-middle(40px);
            background:rgb(247,247,247);
            color:rgb(173,173,173);
            text-align:center;
            padding-left:20px;
        }
        .evaluation{
            padding:20px;
            overflow: hidden;
            .eva{
                width:33.3%;
                float:left;
                .con{
                    width:70px;
                    margin:0 auto;
                    padding:5px 0;
                    border-bottom:1px solid transparent;
                    .icon{
                        img{
                            width:50px;
                        }
                    }
                    .text{
                        margin-bottom:10px;
                        color:#666;
                    }
                }
                .con.active{
                    .text{
                        color:@mainColor;
                    }
                }
            }
        }
        .improve{
            padding:20px;
            .info{
                text-align:left;
            }
            .rate-box{
                margin-top:20px;
            }
        }
        .suggest{
            padding:10px 20px;
        }
    }
    
</style>


