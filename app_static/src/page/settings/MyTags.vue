<template>
    <div class="container">
        <div class="body">
            <div class="topic">擅长话题<span>7/24</span></div>
            <div class="tag" v-for="(tag,index) in tags" :key="index">
                <span class="title">{{tag.title}}</span>
                <p class="content">{{tag.text}}</p>
            </div>
            <div class="add-box">
                <span class="add" @click="addTag">+</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

@Component({
 
})
export default class MyTags extends Vue{
    private tags = [
        {
            title:'情感挽回',
            text:'暂无个性宣言'
        },
        {
            title:'婚姻关系',
            text:'暂无个性宣言'
        },
        {
            title:'情绪疏导',
            text:'特别擅长情绪疏导'
        },{
            title:'心理负担',
            text:'暂无个性宣言'
        },{
            title:'职业规划',
            text:'擅长于帮人建立职业规划'
        }
    ];
    created(){
        console.log(666);
    }

    addTag(){
        (<any>this).$router.push('/tag');
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
    .body{
        .topic{
            .v-middle(40px);
            background:rgb(247,247,247);
            color:rgb(75,75,75);
            text-align:left;
            padding-left:20px;
            span{
                padding-left:20px;
                color:@light-blue;
            }
        }
        .tag{
            padding:20px 20px 0 20px;
            text-align:left;
            .title{
                .f-lg;
                color:#fff;
                display:inline-block;
                background:@light-blue;
                border-radius:5px;
                padding:5px 10px;
            }
            .content{
                .t-ellipsis(1);
                color:rgb(173,173,173);
                margin-top:10px;
            }
        }
        .add-box{
            text-align:left;
            padding:20px;
            .add{
                display: inline-block;
                .v-middle(1.2em);
                font-size:34px;
                text-align: center;
                width:2em;
                border-radius:5px;
                padding:0 10px;
                background:#f5f5f5;
                color:@light-blue;
            }
        }
    }
</style>
