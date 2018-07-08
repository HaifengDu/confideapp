<template>
  <div class="lists-container">
    <div class="tab">
      <div class="item sort" :class="{'active':tab=='sort'}" @click="showSlide('sort')">排序</div>
      <div class="item filter" :class="{'active':tab=='filter'}" @click="showSlide('filter')">筛选</div>
    </div>
    <div class="lists">
      <list-item v-for="(item,i) in lists" :key="i" :user="item"></list-item>
    </div>
    <slide-page ref="slidePage">
      <search-filter from="list" @filter="closeSlide" v-if="tab=='filter'"></search-filter>
      <div class="sort-list" v-else>
        <div :class="['time',{'active':sorter=='time'}]" @click="setSorter('')">综合排序</div>
        <div :class="['time',{'active':sorter=='time'}]" @click="setSorter('sealtimes')">月售时长</div>
        <div :class="['comments',{'active':sorter=='comments'}]" @click="setSorter('praisepercent')">好评率</div>
      </div>
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
const listService = ListService.getInstance();

@Component({
  components:{
    ListItem,
    SlidePage,
    SearchFilter
  },
  computed:{
      ...mapGetters({"searchConds":"list/searchConds"})
  }
})
export default class List extends Vue{
  private lists = []
  private tab = ''
  private sorter = ''
  created() {
    this.getLists()
  }
  showSlide(item:any){
    this.tab = item;
    (<any>this.$refs.slidePage).show();
  }
  closeSlide(){
    (<any>this.$refs.slidePage).close();
    this.getLists()
  }
  setSorter(item:any){
    this.sorter = item
    this.closeSlide()
  }
  getLists(){
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
        listService.getSearchResult(conds).then(res => {
          (<any>this).lists = res.data.data
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
      border-right:1px solid #d3d3d3;
    }
    .filter{
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

