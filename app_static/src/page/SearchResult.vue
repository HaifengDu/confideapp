<template>
  <div class="lists-container">
    <div class="tab">
      <div class="item sort">排序</div>
      <div class="item filter">筛选</div>
    </div>
    <div class="lists">
      <list-item v-for="(item,i) in lists" :key="i" :user="item"></list-item>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator";
import {mapGetters} from "vuex";
import ListItem from '@/components/ListItem'
import ListService from "../api/ListService";
const listService = ListService.getInstance();

@Component({
  components:{
    ListItem
  },
  computed:{
      ...mapGetters({"searchConds":"list/searchConds"})
  }
})
export default class SearchResult extends Vue{
  private lists = []
  created() {
      const searchConds = (<any>this).searchConds;
      if(searchConds){
          const conds = Object.assign({},searchConds);
          for(let key in conds){
              if(conds[key]===-1){
                  delete conds[key];
              }
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
}
</style>

