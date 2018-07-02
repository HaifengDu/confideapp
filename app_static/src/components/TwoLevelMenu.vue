<template>
  <div class="menu-container">
    <div class="parent">
      <div class="lists">
        <template v-for="item in parent">
          <div class="list" :class="{'active':item.id==current.id}" @click="selectParent(item)">
            <div class="name">{{item.name}}</div>
            <div class="arrow"></div>
          </div>
        </template>
      </div>
    </div>
    <div class="child">
      <div class="lists">
        <div class="list" v-for="item in current.children" @click="selectChild(item)">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component, Prop, Watch, Emit} from 'vue-property-decorator';

@Component
export default class TwoLevelMenu extends Vue{
  @Prop({
    type:Array
  })
  private lists:Array<any>
  private parent:Array<any>
  private current = {}

  created(){
    this.parent = this.lists
    this.current = this.lists[0];
    console.log(this.current);
  }
  selectParent(item:any){
    console.log(item);
    this.current = item
  }
  selectChild(item:any){
    this.$emit('changeMenu',item)
  }
}
</script>

<style lang="less">
@mainColor:#00D1CF;
.menu-container{
  display: flex;
  width:100%;
  height:100%;
  overflow: hidden;
  .list{
    height:4rem;
    line-height: 4rem;
    border-bottom:1px solid #d7d7d7;
    &:last-child{border-bottom:none;}
  }
  .parent{
    flex:2;
    height:100%;
    .lists{
      .list{
        display:flex;
        border-right:1px solid #d7d7d7;
        &.active{
          background:#f7f7f7;
          .arrow{
            background:url(../../static/images/baseInfo/right-arrow.png) no-repeat center;
            background-size:14px;
          }
        }
        .name{
          flex:1;
        }
        .arrow{
          width:16px;
          height:4rem;
        }
      }
    }
  }
  .child{
    flex:3;
    .list{
      background:#f7f7f7;
      border-left:1px solid #d7d7d7;
    }
  }
}
</style>
