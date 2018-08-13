<template>
  <div class="lists-container">
    <div class="tab">
      <div :class="['item','all',{'active':tab==''}]" @click="setSorter('')">综合排序</div>
      <div :class="['item','time',{'active':tab=='sealtimes'}]" @click="setSorter('sealtimes')">月售时长</div>
      <div :class="['item','comments',{'active':tab=='praisepercent'}]" @click="setSorter('praisepercent')">好评率</div>
      <div class="item filter" :class="{'active':filter=='active'}" @click="showSlide"></div>
    </div>
    <div class="lists" v-infinite-scroll="loadMore"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="10">
      <list-item v-for="(item,i) in lists" :key="i" :listener="item"></list-item>
    </div>
    <slide-page ref="slidePage">
      <search-filter from="list" :labelid="searchConds.labelid" @filter="closeSlide"></search-filter>
    </slide-page>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator";
import {mapGetters} from "vuex";
import ListItem from '@/components/ListItem';
import SlidePage from '@/components/SlidePage';
import SearchFilter from '@/page/SearchFilter';
import ListService from "../api/ListService";
import { IListener } from '../interface/model/IListener';
const listService = ListService.getInstance();

@Component({
  components:{
    ListItem,
    SlidePage,
    SearchFilter
  },
  computed:{
      ...mapGetters({
        "searchConds":"list/searchConds",
      })
  }
})
export default class List extends Vue{
  private lists:IListener[] = []
  private tab = ''
  private filter = 's'
  private sorter = ''
  private limit = 5
  private start = 0
  private loadMoreFlag = true
  created() {
    this.getLists()
  }
  showSlide(){
    (<any>this.$refs.slidePage).show();
  }
  closeSlide(){
    this.filter = 'active';
    (<any>this.$refs.slidePage).close();
    this.getLists()
  }
  setSorter(item:any){
    this.tab = item
    this.sorter = item
    this.getLists()
  }
  loadMore(){
    if(this.loadMoreFlag){
      this.getLists(this.start)
    }
  }
  getLists(start?:number){
    const searchConds = (<any>this).searchConds;
    if(searchConds){
        const conds = Object.assign({},searchConds);
        for(let key in conds){
            if(conds[key]===-1){
                delete conds[key];
            }
        }
        if(this.sorter){
          conds.sort = this.sorter;
        }
        conds.start = start||0
        conds.limit = this.limit;
        if(conds.start===0){
          this.lists = [];
        }
        listService.getSearchResult(conds).then(res => {
          if(res.data.data.length<this.limit){
            this.loadMoreFlag = false
          }else{
            this.loadMoreFlag = true
          }
          this.lists=this.lists.concat(res.data.data)
          this.start = this.lists.length||0
        });
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/common.less';
.lists-container{
  background:#f5f5f5;
  height:100vh;
  .tab{
    display: flex;
    height:3.4rem;
    line-height: 3.4rem;
    background:#f5f5f5;
    border-bottom:1px solid #d3d3d3;
    .item{
      flex:1;
      &.active{
        color:@mainColor;
      }
    }
    .sort{
      // border-right:1px solid #d3d3d3;
    }
    .filter{
      background:url(../../static/images/list/filter.png) no-repeat center;
      background-size:2rem;
      &.active{
        background:url(../../static/images/list/filter-active.png) no-repeat center;
        background-size:2rem;
      }
    }
  }
  .lists{
    height:~'calc(100% - 3.4rem)';
    overflow: auto;
    /deep/ .list{
      &:first-child{
        border:none;
      }
    }
  }
  .sort-list{
    div{
      height:4rem;
      line-height: 4rem;
      text-align: left;
      padding-left:1rem;
      border-bottom:1px solid #d3d3d3;
      &.active{
        color:@mainColor;
      }
    }
  }
}
</style>

