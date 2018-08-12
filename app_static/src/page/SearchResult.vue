<template>
  <div class="lists-container"
  v-infinite-scroll="loadMore"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="10">
    <!-- <div class="search">
      <mt-search
        v-model="value"
        cancel-text="取消"
        placeholder="倾听者"></mt-search>
    </div> -->
    <!-- <div class="lists" > -->
      <list-item v-for="(item,i) in lists" :key="i" :user="item"></list-item>
    <!-- </div> -->
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

  }
})
export default class SearchResult extends Vue{
  private lists = []
  private limit = 20
  private start = 0
  private name = ''
  private loadMore(){
    if(this.start===0){
      return
    }
  }
  private getSearchResult(){
    listService.searchList(this.name,this.start,this.limit).then(res => {
      if(res.data.success){
        if(this.start===0){
          this.lists = []
        }
        this.lists = this.lists.concat(res.data.data)
        this.start = this.lists.length
      }
    })
  }
  created() {
    this.name = this.$route.query.name
    this.getSearchResult()
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/common.less';
.lists-container{
  background:#f5f5f5;
  height:100vh;
  .search{
    height:4rem;
    width:100%;
    input{
      .fs(1.4rem);
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

