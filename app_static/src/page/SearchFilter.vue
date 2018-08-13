<template>
<div class="filter-b-container">
    <div class="filter-title">精准筛选</div>
    <section class="filter-container" v-if="!labelid">
        <div>话题分类</div>
        <div :class="{'collose':!toggleModel.topic}">
            <radio-button v-model="filterModel.labelid" :list="topicList">

            </radio-button>
        </div>
        <div @click="toggleMore('topic')">展开
            <i class="fa" :class="{'fa-angle-up':toggleModel.topic,'fa-angle-down':!toggleModel.topic}"></i>
        </div>
    </section>
    <section class="filter-container">
        <div>起步价</div>
        <div :class="{'collose':!toggleModel.price}">
            <radio-button v-model="filterModel.price" :list="priceList">

            </radio-button>
        </div>
        <div @click="toggleMore('price')">展开
            <i class="fa" :class="{'fa-angle-up':toggleModel.price,'fa-angle-down':!toggleModel.price}"></i>
        </div>
    </section>
    <section class="filter-container">
        <div>性别</div>
        <div>
            <radio-button v-model="filterModel.sex" :list="sexList">

            </radio-button>
        </div>
    </section>
    <section class="filter-container">
        <div>家庭</div>
        <div :class="{'collose':!toggleModel.family}">
            <radio-button v-model="filterModel.family" :list="allBaseData.family">

            </radio-button>
        </div>

        <div @click="toggleMore('family')">展开
            <i class="fa" :class="{'fa-angle-up':toggleModel.family,'fa-angle-down':!toggleModel.family}"></i>
        </div>
    </section>
    <section class="filter-container">
        <div>是否认证</div>
        <div>
            <radio-button v-model="filterModel.auth" :list="authList">

            </radio-button>
        </div>
    </section>
    <section class="filter-container">
        <div>年龄</div>
        <div>
            <radio-button v-model="filterModel.age" :list="ageList">

            </radio-button>
        </div>
    </section>
    <section class="filter-container">
        <div>学历</div>
        <div :class="{'collose':!toggleModel.edu}">
            <radio-button v-model="filterModel.edu" :list="allBaseData.edu">

            </radio-button>
        </div>
        <div @click="toggleMore('edu')">展开
            <i class="fa" :class="{'fa-angle-up':toggleModel.edu,'fa-angle-down':!toggleModel.edu}"></i>
        </div>
    </section>
    <section class="filter-container">
        <div>职业</div>
        <div :class="{'collose':!toggleModel.job}">
            <radio-button v-model="filterModel.job" :list="allBaseData.job">

            </radio-button>
        </div>
        <div @click="toggleMore('job')">展开
            <i class="fa" :class="{'fa-angle-up':toggleModel.job,'fa-angle-down':!toggleModel.job}"></i>
        </div>
    </section>
    <section class="filter-container">
        <div>地区</div>
        <div>
            <select name="area">
                <option :key="index" :value="item.id" v-for="(item,index) in allBaseData.area">
                    {{item.name}}
                </option>
            </select>
        </div>
    </section>
    <div class="footer-btn">
        <mt-button size="normal" class="half-btn" @click="reset" type="primary">重  置</mt-button>
        <mt-button size="normal" class="half-btn" @click="filter" type="primary">筛  选</mt-button>
    </div>
</div>

</template>

<script lang="ts">
import Vue from 'vue'
import {Component, Prop} from "vue-property-decorator";
import RadioButton from "@/components/RadioButton.vue"
import LabelService from "@/api/LabelService"
import { mapActions, mapGetters } from 'vuex';
import {INoop} from "@/util/methods"
import { ESex } from '../enum/ESex';

const labelService = LabelService.getInstance();
@Component({
    components:{
        "radio-button":RadioButton
    },
    methods:{
        ...mapActions({
            getAllBaseData:"getAllBaseData",
            setConds:"list/setFilterConds"
        })
    },
    computed:{
        ...mapGetters(["allBaseData"])
    }
})
export default class SearchFilter extends Vue{
  @Prop()
  private from:string
  @Prop()
  private labelid:number
    private filterModel = {
        labelid:this.labelid||-1,
        price:-1,
        sex:-1,
        family:-1,
        auth:-1,
        edu:-1,
        job:-1,
        age:-1,
        area:-1
    };
    private toggleModel:any = {};
    private topicList:any[] = [];
    private priceList = [
        {
            id:-1,
            name:"不限"
        },{
            id:{
                min:0,
                max:15
            },
            name:"15元以下"
        },{
            id:{
                min:15,
                max:30
            },
            name:"15-30元"
        },{
            id:{
                min:30,
                max:45
            },
            name:"30-45元"
        },{
            id:{
                min:45,
                max:60
            },
            name:"45-60元"
        },{
            id:{
                min:60
            },
            name:"60元以上"
        }
    ];
    private ageList = [{
        id:-1,
        name:"不限"
    },{
        id:[0,22],
        name:"22岁及以下"
    },{
        id:[22,30],
        name:"20岁~30岁"
    },{
        id:[30],
        name:"30岁及以上"
    }]
    private sexList = [{
        id:-1,
        name:"不限"
    },{
        id:ESex.Famale,
        name:"男"
    },{
        id:ESex.Male,
        name:"女"
    }];
    private authList = [{
        id:-1,
        name:"不限"
    },{
        id:1,
        name:"已认证"
    }];
    created(){
        const temp:any = {topic:false};
        Object.keys(this.filterModel).forEach(item=>{
            temp[item] = false;
        });
        this.toggleModel = temp;
        labelService.getSystemLabel().then(res=>{
            const data = res.data;
            if(data.success){
                this.topicList = data.data;
                this.topicList.unshift({
                    id:-1,
                    name:"不限"
                })
            }
        });

        this.getAllBaseData();

    }
    toggleMore(key:string){
        this.toggleModel[key] = !this.toggleModel[key];
    }
    reset(){
        for(let key in this.filterModel){
            this.filterModel[key]= -1;
        }
    }
    filter(){
        this.setConds(this.filterModel);
        if(this.from==='list'){
          this.$emit('filter')
          return
        }
        this.$router.push("/searchResult")
    }
    private getAllBaseData:INoop;
    private setConds:INoop;
}
</script>
<style lang="less" scoped>
@import "../assets/common.less";
.filter-b-container{
    padding: 2px 8px;
    margin-bottom: 41px;
}
.filter-title{
    margin-top:5px;
    font-size: 1.8rem;
    color:@mainColor;
}
.filter-container{
    margin:15px 0;
    position: relative;
    div:first-child{
       text-align: left;
       margin-bottom: 3px;
       font-size: 1.5rem;
    }
    div:nth-child(2){
        width:95%;
        margin: 0 auto;
        &.collose{
            overflow: hidden;
            max-height:2.5rem;
        }
    }
    div:nth-child(3){
        position: absolute;
        right: 5px;
        top:2px;
        font-size: .7rem;
    }
    &>div{
        &:after{display:block;clear:both;content:"";visibility:hidden;height:0}
        zoom:1;
    }
}
</style>
