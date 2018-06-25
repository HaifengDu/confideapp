<template>
  <div class="base-info-container">
    <div class="lists">
      <div class="list head-image">
        <mt-cell title="头像" is-link>
          <img src="static/images/my/listener.png" width="24" height="24">
          <i class="mint-cell-allow-right"></i>
        </mt-cell>
      </div>
      <div class="list" @click="showName=true">
        <mt-cell title="名字" is-link>
          <span>尚小牛</span>
          <i class="mint-cell-allow-right"></i>
        </mt-cell>
      </div>
      <div class="list">
        <mt-cell title="地区">
          <select v-model="area">
            <template v-for="item in areas">
              <option :value="item.code">{{item.name}}</option>
            </template>
          </select>
          <i class="mint-cell-allow-right"></i>
        </mt-cell>
      </div>
      <div class="list" @click="selectDate">
        <mt-cell title="生日" is-link>
          <span>{{birthday}}</span>
          <i class="mint-cell-allow-right"></i>
        </mt-cell>
      </div>
      <div class="list">
        <mt-radio
          title="性别"
          v-model="sex"
          :options="['男', '女']">
        </mt-radio>
      </div>
      <mt-datetime-picker
        type="date"
        ref="picker"
        :start-date="new Date(1900,1,1)"
        :end-date="new Date()"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        @confirm="handleConfirm">
      </mt-datetime-picker>
    </div>
    <div class="introduce">
      <p>个人简介</p>
      <textarea name="" id="" cols="30" rows="10" placeholder="请输入个人介绍" v-model="resume"></textarea>
    </div>
    <update-name :name="nickName" v-if="showName" @changeName="updateName"></update-name>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from 'vue-property-decorator';
import UpdateName from '@/components/UpdateName'
import BaseInfoService from "../api/baseInfo";
import { EBaseDataType } from '../enum/EBaseDataType';

@Component({
  components:{
    UpdateName
  }
})
export default class BaseInfo extends Vue{
  private birthday:any='';
  private sex:any = '男';
  private area = '110000';
  private areas:Array<{code:string,name:string}> = []
  private service = BaseInfoService.getInstance();
  private resume:string = '此处是个人简介'
  private nickName:string = '尚小牛'
  private showName:boolean = false
  created(){
    this.service.getArea(EBaseDataType.Area).then(res=>{
      let data = res.data.data;
      for(var key in data){
        this.areas.push({
          code:key,
          name:data[key].name
        })
      }
    })
  }
  selectDate(){
    (<any>this.$refs.picker).open();
  }
  handleConfirm(data:string){
    this.birthday = (<any>new Date(data)).format("yyyy-MM-dd");
  }
  updateName(name:string){
    this.nickName = name;
    this.showName = false;
  }
}
</script>

<style lang="less" scoped>
@bg:#f5f5f5;
.base-info-container{
  padding-top:1.6rem;
  background:@bg;
  font-size:1.4rem;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  .lists{
    background:#fff;
    .list{
      text-align:left;
      padding-left:1rem;
      select{
        border:none;
        height:48px;
        appearance:none;
        -moz-appearance:none;
        -webkit-appearance:none;
        background-image: none;
        background: no-repeat scroll right center transparent;
        margin-right:25px;
        color:#888;
        font-size:1.4rem;
        direction: rtl;
      }
    }
  }
  .introduce{
    margin-top:1rem;
    width:100%;
    background:#fff;
    p{
      height:4rem;
      line-height: 4rem;
      width:90%;
      margin:0 auto;
      text-align: left;
    }
    textarea{
      height:12rem;
      width:85%;
      border:1px solid #d2d2d2;
      appearance: none;
      font-size: 1.4rem;
      padding:1rem;
    }
  }

}
</style>
