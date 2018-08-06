<template>
    <div class="container" 
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <div class="list" v-for="(item,index) in followDatas" :key="index" @click="toUserInfo(item)">
            <img class="head-img" :src="item.headimgurl"/>
            <div class="content">
                <p class="name">{{item.nickname}}</p>
                <p v-if="type==2" class="date">{{item.clickdate}}</p>
            </div>
            <div v-if="type==2" class="button" @click.stop="followMe(item)">{{item.record?'已关注':'关注'}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {EFollowType} from "@/enum/EFollowType";
import Pager from "@/helper/Pager.ts"; 
import MyService from "../../api/UserService.ts";
import { Indicator } from 'mint-ui';
const userService = MyService.getInstance();

@Component({
   
})
export default class Follow extends Vue{
    private pager = new Pager().setLimit(20);
    //1代表关注，2代表访客
    private type = 1;
    private followDatas:any = [];
    
    created(){
        /**
         * 先获取列表数据，然后根据ids获取对应的关注数据
         * 需分页
         */
        this.type = (<any>this).$route.query.type;
        this.initData();
    }

    initData(){
        if(this.type == EFollowType.Follow){
            this.getFavoriteData();
        }else{
            this.getVisitorData();
        }
    }

    getRecordStatus(){
        const tempData = this.followDatas.slice(this.pager.getPage().limit*(this.pager.getPage().page-2));
        let params = tempData.map((item:any)=>item.id);
        Indicator.open();
        userService.getCheckRecord(params).then((res:any)=>{
            if(res.data.success){   
                res.data.data.forEach((item:any)=>{
                    const temp = this.followDatas.find((follow:any)=>follow.id==item.id);
                    if(temp){
                        temp.record = item.record;
                    }
                })
            }else{
                this.$toast(res.data.message);
            }
            Indicator.close();
        },err=>{
            Indicator.close();
        });
    }

    getFavoriteData(){
        Indicator.open();
        userService.getFavorites(this.pager).then((res:any)=>{
            if(res.data.success){   
                const data = res.data.data;
                data.forEach((item:any)=>item.record=true);
                if(this.pager.getPage().page==1){
                    this.followDatas = data;
                }else{
                    this.followDatas = this.followDatas.concat(data);
                }
                this.pager.setNext();
            }else{
                this.$toast(res.data.message);
            }
            Indicator.close();
        },err=>{
            Indicator.close();
        });
    }

    getVisitorData(){
        userService.getVisitVecords(this.pager).then((res:any)=>{
            if(res.data.success){   
                const data = res.data.data;
                data.forEach((item:any)=>item.record=true);
                if(this.pager.getPage().page==1){
                    this.followDatas = data;
                }else{
                    this.followDatas.concat(data);
                }
                this.getRecordStatus();
                this.pager.setNext();
            }
        });
    }

    toUserInfo(item:any){
        if(item.id){
            this.$router.push({name:'userInfo',params:{uid:item.id}});
        }
    }

    followMe(item:any){
        if(!item.record){
            userService.addfavorite(item.id).then((res:any)=>{
                if(res.data.success){
                    item.record = true;
                }
            });
        }else{
            //取消关注
            userService.delfavorite(item.id).then((res:any)=>{
                console.log(res);
                if(res.data.success){
                    item.record = false;
                }
            });
        }
    }

    loadMore(){
        if(this.pager.getPage().page===1)return;
        if(this.type === EFollowType.Follow){
            this.getFavoriteData();
        }else{
            this.getVisitorData();
        }
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
    .list{
        text-align:left;
        padding:10px 20px;
        border-bottom:1px solid #eee;
        display:flex;
        .p-rl;
        .head-img{
            width:50px;
            height:50px;
            vertical-align: middle;
            border-radius: 6px;
        }
        .content{
            display:flex;
            flex-direction:column;
            justify-content:center;
            padding-left:20px;
            .date,.name{
                padding:3px;
            }
            .date{
                color:rgb(171,171,171);
            }
        }
        .button{
            height: 30px;
            line-height: 30px;
            padding: 2px 15px;
            border-radius: 17px;
            justify-content: center;
            color:#fff;
            background:#f3a843;
            .p-ab;
            right: 20px;
            top: 17px;
        }
    }
</style>
