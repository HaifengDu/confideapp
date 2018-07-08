<template>
<div class="rb-root">
    <div @click="btnClick(item)" class="ra-btn-container" :key="index" v-for="(item,index) in list">
        <div :class="{'active':item[idProp]===idValue}">{{item.active}}{{item[nameProp]}}</div>
    </div>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component, Prop, Model, Watch} from "vue-property-decorator";

@Component
export default class RadioBtton extends Vue{
    @Prop({
        type:Array,
        default:[],
        required:true
    })
    private list:Array<any>;
    
    @Prop({
        type:String,
        default:"id"
    })
    private idProp:string;

    @Prop({
        type:String,
        default:"name"
    })
    private nameProp:string;

    @Model("change")
    private idValue:number;

    btnClick(item:any){
        const idname = this.idProp;
        this.$emit('change',item[this.idProp]);
    }
}
</script>
<style lang="less" scoped>
@import "../assets/common.less";
.rb-root{
    width:100%;
    color:#666;
}
.ra-btn-container{
    min-width:25%;
    padding:3px 5px;
    zoom:1;
    float: left;    
    box-sizing: border-box;
    div{
        box-sizing: border-box;
        height: 2rem;
        line-height: 2rem;
        padding:0 3px;
        box-sizing: border-box;
        text-align: center;
        border-radius: 10px;
        border:1px solid #ddd;
    }
    div.active{
        background-color: @mainColor;
        color:#fff;
        border-color:@mainColor;
    }
    &:after{
        display:block;clear:both;content:"";visibility:hidden;height:0
    }
}
</style>


