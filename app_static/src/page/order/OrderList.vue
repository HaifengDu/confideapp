<template>
    <div style="height:100%;">
        <div class="container">
            <div class="header">
                <div v-if="isListener" style="margin:0 auto;width:50%;">
                    <div class="tog-btn-box">
                        <span :class="{'active':isMySale,'positive':!isMySale}" @click="changeType">我售的单</span>
                        <span :class="{'active':!isMySale,'positive':isMySale}" @click="changeType">我下的单</span>
                    </div>
                </div>
                <div class="wrapper" ref="wrapper">
                    <ul class="content" style="width:600px;">
                        <li
                        style="width:60px;"
                        v-for="(item,index) in status"
                        class="tab"
                        :class="{'active-tab':item.active}"
                        :key="index"
                        @click="changeStatus(item.status)">
                        {{item.name}}</li>
                    </ul>
                </div>
            </div>
            <div class="body" ref="body">
                <div 
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="10"
                    class="order-list" 
                    ref="orderList">
                    <ul class="content">
                        <li
                        v-for="(item,index) in list"
                        class="list"
                        :key="index"
                        @click="toOrderDetail(item)">
                            <p class="title">
                                <span class="date">{{item.date}}</span>
                                <span class="status-name" :class="getStatusClass(item.status)">{{item.statusname}}</span>
                            </p>
                            <div style="text-align:left;position:relative;">
                                <img :src="item.src" style="width:40px;vertical-align:bottom;">
                                <span class="detail">
                                    <p class="name">{{item.name}}</p>
                                    <p class="type">{{item.serviceType==1?'文字':'通话'}}服务订单<span style="padding-left:10px;">时长{{item.timecircle}}分钟</span></p>
                                </span>
                                <div class="price">
                                    <u class="icon-type" :class="{'text':item.serviceType==1}"></u>
                                    <span>￥{{item.price}}</span>
                                    <i class="arrow"></i>
                                </div>
                            </div>
                            <div class="btn-box">
                                <mt-button style="margin-right:10px;" size="normal" type="default" @click.native="cancelOrder(item.id)">取消订单</mt-button>
                                <mt-button style="margin-right:20px;background:rgb(239,146,55);color:#fff;" size="normal" type="primary" @click.native="toOrderDetail(item)">支付订单</mt-button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {EPriceType} from "@/enum/EPriceType";
import { ERole } from '../../enum/ERole';
import BScroll from 'better-scroll';
import Pager from "@/helper/Pager.ts"; 
import { mapGetters,mapActions } from 'vuex';
import OrderService from "../../api/OrderService.ts";
const orderService = OrderService.getInstance();

@Component({
    methods:{
        ...mapActions({
            setOrder:'setOrder'
        })
    },
    computed:{
        ...mapGetters({
            user:'user'
        })
    }
})
export default class OrderList extends Vue{
    private pager = new Pager().setLimit(20);
    private isListener = false;
    private isMySale = true;
    private status = [
        {status:1,name:'待付款',active:true},
        {status:2,name:'已付款',active:false},
        {status:3,name:'已取消',active:false},
        {status:4,name:'服务中',active:false},
        {status:5,name:'待评论',active:false},
        {status:6,name:'已完成',active:false}
    ];
    private currentStatus:number = 1;
    private list:any = [];

    create(){
        if((<any>this).user&&(<any>this).user.role){
            this.isListener = (<any>this).user.role === ERole.Listener;
        }
    }

    mounted() {
        this.$nextTick(() => {
            new BScroll((<any>this).$refs.wrapper, {
                scrollX: true,
                scrollY: false,
                click: true,
                bounceTime: 500
            });
        });
        this.loadData();
    }

    changeType(){
        this.isMySale = !this.isMySale;
    }

    changeStatus(status:number){
        this.status.forEach((item:any)=>{
            if(item.status ==+ status){
                item.active = true
            }else{
                item.active = false;
            }
        });
        this.currentStatus = status;
        //TODO:根据status获取对应的单据
        this.pager.clear().setLimit(20);
        this.loadData();
        (<any>this.$refs.body).scrollTop = 0;
    }

    private getStatusClass(status:number){
        const classArray = ['to-be-pay','payed','canceled','service','to-be-evaluate','complete'];
        return classArray[status - 1];
    }

    toOrderDetail(order:any){
        (<any>this).setOrder(order);
        this.$router.push({path:'/orderDetail',query:{orderid:String(order.id)}});
    }

    cancelOrder(id:number){
        //TODO:取消订单,然后跳回到上一页面
    }

    loadData(){
        //TODO:从store中获取订单数据
        let params = {
            status:this.currentStatus
        }
        Object.assign(params,this.pager);
        // orderService.getOrderList(params).then((res:any)=>{
        //     console.log(res);
        // });
        let result = [
            {id:1,src:'static/images/tab/my-active.png',name:'重新的开始',timecircle:15,price:9.9,status:5,statusname:'待评论',date:'2018-06-26',serviceType:1},
            {id:2,src:'static/images/tab/my-active.png',name:'重新的开始',timecircle:30,price:19.9,status:2,statusname:'已付款',date:'2018-07-26',serviceType:2},
            {id:3,src:'static/images/tab/my-active.png',name:'重新的开始',timecircle:15,price:9.9,status:5,statusname:'待评论',date:'2018-06-26',serviceType:1},
            {id:4,src:'static/images/tab/my-active.png',name:'重新的开始',timecircle:30,price:19.9,status:2,statusname:'已付款',date:'2018-07-26',serviceType:2},
            {id:5,src:'static/images/tab/my-active.png',name:'重新的开始',timecircle:15,price:9.9,status:5,statusname:'待评论',date:'2018-06-26',serviceType:1},
            {id:6,src:'static/images/tab/my-active.png',name:'重新的开始',timecircle:30,price:19.9,status:2,statusname:'已付款',date:'2018-07-26',serviceType:2},
            {id:7,src:'static/images/tab/my-active.png',name:'重新的开始',timecircle:15,price:9.9,status:5,statusname:'待评论',date:'2018-06-26',serviceType:1},
            {id:8,src:'static/images/tab/my-active.png',name:'重新的开始',timecircle:30,price:19.9,status:2,statusname:'已付款',date:'2018-07-26',serviceType:2},
            {id:9,src:'static/images/tab/my-active.png',name:'重新的开始',timecircle:15,price:9.9,status:5,statusname:'待评论',date:'2018-06-26',serviceType:1},
            {id:10,src:'static/images/tab/my-active.png',name:'重新的开始',timecircle:30,price:19.9,status:2,statusname:'已付款',date:'2018-07-26',serviceType:2}
        ];
        if(this.pager.getPage().page === 1){
            this.list = result;
        }else{
            this.list = this.list.concat(result);
        }
        this.pager.setNext();
    }

    loadMore(){
        //TODO:获取数据
        if(this.pager.getPage().page===1)return;
        this.loadData();
    }

}
</script>

<style lang="less" scoped>
    @import '../../assets/style.less';
    @orange:rgb(239,146,55);
    @bgColor:rgb(238,238,238);
    @border-radius-width:5px;
    @default-white:#fff;
    .to-be-pay{color:@orange;}
    .payed{color:@mainColor;}
    .canceled{color:#e43937;}
    .service{color:purple;}
    .to-be-evaluate{color:#11b7f3;}
    .complete{color:#333;}
    .con-bg{
        background:@bgColor;
    }
    *{
        .f-nm;
    }
    .container{
        height:100%;
        overflow:hidden;
        background:rgb(229,229,229);
        .p-rl;
        .header{
            background:@default-white;
            .wrapper{
                margin:10px 0;
                overflow: hidden;
                .content{
                    width:600px;
                    .tab{
                        display: inline-block;
                        padding:10px 20px;
                        width:60px;
                    }
                }
            }
        }
        .tog-btn-box{
            height:32px;
            line-height: 28px;
            margin-top:3px;
            font-size:14px;
            text-align:right;
            span{
                display: inline-block;
                height:30px;
                width:45%;
                text-align:center;
            }
            &>span:first-child{
                border-top-left-radius: @border-radius-width;
                border-bottom-left-radius: @border-radius-width;
            }
            &>span:last-child{
                position: relative;
                right:5px;
                border-top-right-radius: @border-radius-width;
                border-bottom-right-radius: @border-radius-width;
            }
            .active{
                background: @mainColor;
                color: @default-white;
                border: 1px solid @mainColor;
            }
            .positive{
                background: @default-white;
                color: @mainColor;
                border: 1px solid @mainColor;
            }
        }
    }
    .body{
        height:~'calc(100vh - 92px)';
        overflow-y:auto;
        .order-list{
            .content{
                .list{
                    padding:10px;
                    margin-bottom:10px;
                    background: @default-white;
                    .title{
                        padding-bottom: 10px;
                        .date,.status-name{
                            display:inline-block;
                            width:49%;
                        }
                        .date{
                            text-align:left;
                        }
                        .status-name{
                            text-align:right;
                        }
                    }
                    .detail{
                        display:inline-block;
                        padding-left:10px;
                        .name{
                            margin-bottom: 5px;
                        }
                        .type{
                            color:rgb(173,173,173);
                        }
                    }
                    .price{
                        border:1px solid #eee;
                        padding:5px 0 5px 15px;
                        height:22px;
                        line-height:22px;
                        .p-ab;
                        right:-10px;
                        bottom:5px;
                        border-top-left-radius: 16px;
                        border-bottom-left-radius: 16px;
                        .icon-type,.arrow{
                            display:inline-block;
                            width:20px;
                            height:20px;
                            background-image: url(../../../static/images/pay/microphone-black.png);
                            background-repeat: no-repeat;
                            background-size: 100% 100%;
                            vertical-align: middle;
                            .p-rl;
                            top:-2px;
                        }
                        .icon-type.text{
                            background-image: url(../../../static/images/pay/chat-black.png);
                        }
                        .arrow{
                            background-image: url(../../../static/images/userInfo/arrow-right.png);
                        }
                    }
                    .btn-box{
                        .m-width;
                        width: 100%;
                        text-align:right;
                        padding:10px 20px 0 20px;
                        margin-top:10px;
                        margin-left:-10px;
                        border-top:1px solid #eee;
                        button{
                            min-width: 80px;
                            padding:0 12px;
                            .mint-button-text{
                                font-size:16px;
                            }
                        }
                    }
                }
            }
        }
    }
    .active-tab{
        color:@mainColor;
        border-bottom:1px solid @mainColor;
    }
</style>
