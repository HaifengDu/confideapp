<template>
  <div class="help-detail">
    <ListItem from="detail"></ListItem>
    <div class="accept-answer">
      <div class="medal">已采纳解答</div>
      <div class="author">
        <UserIcon class="icon" :user="user"></UserIcon>
        <div class="wrap">
          <div class="top">
            <div class="nick-name">此处是评论人姓名</div>
            <div class="days">*天前</div>
          </div>
          <div class="summary">
            此处是个人信息截断n个字
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from "lodash"
import {Component} from "vue-property-decorator";
import ListItem from '../../components/HelpItem.vue'
import UserIcon from '../../components/UserIcon.vue'
@Component({
  components:{
    ListItem,
    UserIcon
  }
})
export default class HelpDetail extends Vue{
private user = {
  headimgurl:'',
  sex:0
}
}
</script>

<style lang="less" scoped>
@import "../../assets/common.less";
.help-detail{
  .accept-answer{
    border-top:1px solid #d3d3d3;
    border-bottom:1px solid #d3d3d3;
    padding:0 1rem 1rem;
    .medal{
      height:3rem;
      line-height: 3rem;
      padding-left:3rem;
      background:url(../../../static/images/help/medal.png) no-repeat left;
      background-size:2.5rem;
      color:@mainColor;
    }
    .author{
      display:flex;
      .icon{
        width:4rem;
      }
      .wrap{
        flex:1;
        .top{
          display: flex;
          .nick-name{
            font-size:.13rem;
            color:#555;
          }
          .days{
            margin-left:1rem;
            font-size:.1rem;
            color:#999;
          }
        }
      }
    }
  }
}
</style>
