<template>
    <div class="help-create-wrapper">
        <div class="lists">
            <div class="list">
                <mt-cell title="名字" is-link>
                    <select v-model="help.money">
                        <option value='' disabled selected>请选项价格</option>
                        <option 
                        :value="item.value" 
                        :key="index"
                        v-for="(item,index) in moneyList">
                        {{item.value}}
                        </option>
                    </select>
                </mt-cell>
            </div>
            <div class="list">
                <mt-cell title="名字" is-link>
                    <select v-model="help.labelid">
                        <option value='' disabled selected>请选项话题类型</option>
                        <option 
                        :value="item.id" 
                        :key="index"
                        v-for="(item,index) in tagList">
                        {{item.name}}
                        </option>
                    </select>
                </mt-cell>
            </div>
        </div>
        <div class="content-wrapper">
            <textarea v-model="help.content">
                请填写求助内容
            </textarea>
        </div>
        <div class="foot-button">
            <mt-button @click="submit" size="normal" type="primary">保   存</mt-button>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator";
import IHelp from "../../interface/model/IHelp";
import HelpService from "../../api/HelpService";

@Component
export default class HelpCreate extends Vue{
    private help:IHelp = {
        labelid:"",
        money:""
    };
    private tagList = [{
        id:1,
        name:"测试1"
    },{
        id:2,
        name:"测试2"
    }]
    private moneyList = [{
        id:1,
        value:'1'
    },{
        id:2,
        value:'3'
    },{
        id:3,
        value:'5'
    },{
        id:4,
        value:'10'
    },{
        id:5,
        value:'15'
    },{
        id:6,
        value:'20'
    }];
    private service:HelpService;
    created() {
        this.service = HelpService.getInstance();
    }
    submit(){
        this.service.create(this.help).then(res=>{
            if(res.data.success){
                this.$toast("发布成功");
            }else{
                this.$toast(res.data.message);
            }
        },err=>{
            this.$toast(err.message);
        });
    }
}
</script>

<style lang="less" scoped>
.lists{
    background:#fff;
    .list{
      text-align:left;
      padding-left:1rem;
      &:last-child{
        .mint-cell{
          border:none;
        }
      }
      select{
        border:none;
        height:48px;
        appearance:none;
        -moz-appearance:none;
        -webkit-appearance:none;
        background-image: none;
        background: no-repeat scroll right center transparent;
        margin-right:25px;
        color:#888;
        font-size:1.4rem;
        direction: rtl;
      }
      .mint-cell-value.is-link {
        img{
          height:4.2rem;
          width:4.2rem;
          border-radius:1.6rem;
        }
      }
    }
  }
.content-wrapper{
    margin-top:10px;
    text-align: center;
    margin-bottom: 2rem;
    textarea{
        width: 90%;
        height: 250px;
    }
}
.foot-button{
    position:fixed;
    width: 100%;
    bottom:2rem;
    left:0;
    button{
        width: 75%;
    }
}
</style>
<style lang="less">
.help-create-wrapper{
    .mint-cell-mask::after {
        display: none;
    }
}
</style>

