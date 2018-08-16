<template>
    <div class="add-container">
        <div class="title">本次服务是否满意</div>
        <div class="evaluation">
            <div class="eva" 
                v-for="(eva,index) in evas" 
                :key="index">
                <div class="con" @click="evaChange(eva)" :class="{'active':eva.active}">
                    <div class="icon"><img :src="eva.active?eva.src+'_active.png':eva.src+'.png'"></div>
                    <p class="text">{{eva.text}}</p>
                </div>
            </div>
        </div>
        <div class="tags" v-if="isShowTags">
            <span 
            v-for="(tag,index) in tags" 
            @click="tagChange(tag)"
            :key="index" 
            :class="{'active':tag.checked}"
            class="tag">{{tag.text}}</span>
        </div>
        <div class="title">服务改进计划</div>
        <div class="improve">
            <div class="info">您的评分有助于我们为您提供更好的服务（该项评分仅平台可见）</div>
            <div class="rate-box cus-rate">
                <rate v-model="rate.timerate" :show-score="false" label="及时服务"></rate>
                <rate v-model="rate.serviceattitude" :show-score="false" label="服务态度"></rate>
                <rate v-model="rate.servicepower" :show-score="false" label="服务能力"></rate>
            </div>
        </div>
        <div class="suggest">
            <el-input
                type="textarea"
                :rows="6"
                placeholder="您的评价能够帮助其他倾诉者哦"
                @input="textChange"
                v-model="suggest">
            </el-input>
            <div class="count">{{suggest.length}}/150</div>
        </div>
        <div class="button-box">
            <mt-button size="normal" type="primary" @click.native="submit">提交</mt-button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator'; 
import Rate from "@/components/Rate.vue";
import EvaluateService from "@/api/EvaluateService.ts";
const evaluateService = EvaluateService.getInstance();

@Component({
    components:{
        'rate':Rate
    }
})
export default class AddEvaluation extends Vue{
    private orderId:string = '';
    private suggest:string = '';
    private isShowTags:boolean = false;
    private rate:any = {
        timerate:0,
        serviceattitude:0,
        servicepower:0
    }
    private evas:any = [
        {id:1,text:'不满意',active:false,src:'/static/images/evaluation/bad'},
        {id:2,text:'一般',active:false,src:'/static/images/evaluation/normal'},
        {id:3,text:'满意',active:false,src:'/static/images/evaluation/good'},
    ];

    private tagObj:any = {
        'tag_1':[
                {text:'没有效果',checked:false},
                {text:'服务较差',checked:false},
                {text:'回复太慢',checked:false}
            ],
        'tag_2':[
                {text:'普普通通',checked:false},
                {text:'一般',checked:false},
                {text:'正常',checked:false}
            ],
        'tag_3':[
                {text:'很懂得安抚',checked:false},
                {text:'受益匪浅',checked:false},
                {text:'知己',checked:false}
            ]
    }

    private tags:any = [];

    created(){
        this.orderId = this.$route.params.id;
        
    }

    evaChange(eva:any){
        this.evas.forEach((item:any)=>{
            if(item.id === eva.id){
                eva.active = !eva.active;
            }else{
                item.active = false;
            }
        });
        this.isShowTags = true;
        this.tags = this.tagObj['tag_'+eva.id];
    }

    tagChange(tag:any){
        tag.checked = !tag.checked;
    }

    textChange(){
        if(this.suggest.length > 150){
            this.$nextTick(()=>{
                this.suggest = this.suggest.slice(0,150);
            });
        }
    }

    submit(){
        if(this.suggest.length>150){
            this.$toast('评论字数不能大于150字');
            return;
        }
        const labels = this.tags.filter((item:any)=>item.checked);
        const satisfied = this.evas.find((item:any)=>item.active);
        let params:any = {
            orderid:this.orderId,
            timerate:this.rate.timerate||5,
            serviceattitude:this.rate.serviceattitude||5,
            servicepower:this.rate.servicepower||5,
            leavemessage:this.suggest,
            satisfaction:satisfied&&satisfied.id||3
        }
        if(labels&&labels.length>0){
            params.labels = labels;
        }
        evaluateService.addEva(params).then((res:any)=>{
            if(res.data.success){
                this.$toast('评论成功！');
                this.$router.push('/orderlist');
            }else{
                this.$toast(res.data.message);
            }
        });
    }
}
</script>

<style lang="less" scoped>
    @import '../../assets/style.less';
    .add-container{
        padding-bottom:65px;
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
            .p-rl;
            .count{
                .p-ab;
                right:25px;
                bottom:15px;
                color:#adadad;
            }
        }
        .tags{
            padding:15px 20px;
            text-align:left;
            border-top: 1px solid @gray;
            .tag{
                padding:5px 8px;
                border-radius:5px;
                background:rgb(230,248,249);
                display:inline-block;
                margin-right:15px;
                margin-bottom: 5px;
            }
            .tag.active{
                background:@mainColor;
            }
        }
    }
    
</style>


