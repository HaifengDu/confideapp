<template>
    <div class="container">
        <div class="list" v-for="(item,index) in followDatas" :key="index" @click="toUserInfo(item.id)">
            <img class="head-img" :src="item.src"/>
            <div class="content">
                <p class="name">{{item.name}}</p>
                <p v-if="type==2" class="date">{{item.date}}</p>
            </div>
            <div v-if="type==2" class="button" @click.stop="followMe(item)">{{item.isFollow?'已关注':'关注'}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {EFollowType} from "@/enum/EFollowType";

@Component({
   
})
export default class Follow extends Vue{
    //1代表关注，2代表访客
    private type = 1;
    private followDatas:any = [
        {
            id:1,
            name:'重新的开始',
            date:'2018-06-26 18:09',
            isFollow:true,
            src:'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIkkg9icSGleYN53EtQiaOuxCkTnicpibicOgRicZS2iaGzCYOh2TLA4Wh86mFDCbmamZ9c7WibGXiaveK47Og/132'
        },
        {
            id:2,
            name:'星空下的嗳',
            date:'2018-06-26 18:09',
            isFollow:false,
            src:'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIkkg9icSGleYN53EtQiaOuxCkTnicpibicOgRicZS2iaGzCYOh2TLA4Wh86mFDCbmamZ9c7WibGXiaveK47Og/132'
        }
    ];
    
    created(){
        //获取页面类型，关注还是访客
        //TODO:根据页面类型，获取关注列表数据或访客列表数据
        this.type = (<any>this).$route.query.type;
        console.log(this.type);
    }

    toUserInfo(id:number){
        //TODO:跳转到userInfo页面，获取id对应的用户信息
        (<any>this).$router.push({path:'/userInfo',query:{id:id}});
    }

    followMe(item:any){
        //TODO:向后台发送请求，关注或者取消关注
        item.isFollow = !item.isFollow;
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
