<template>
  <div class="base-info-container">
    <div class="lists">
      <div class="list head-image">
        <mt-cell title="头像" is-link>
          <img :src="baseInfo.headimgurl" width="24" height="24">
          <i class="mint-cell-allow-right"></i>
        </mt-cell>
      </div>
      <div class="list" @click="showName=true">
        <mt-cell title="名字" is-link>
          <span>{{baseInfo.nickname}}</span>
          <i class="mint-cell-allow-right"></i>
        </mt-cell>
      </div>
      <div class="list">
        <mt-cell title="地区">
          <select v-model="baseInfo.address">
              <option :value="item.code" :key="index" v-for="(item,index) in areas">{{item.name}}</option>
          </select>
          <i class="mint-cell-allow-right"></i>
        </mt-cell>
      </div>
      <div class="list" @click="selectDate">
        <mt-cell title="生日" is-link>
          <span>{{baseInfo.birthday}}</span>
          <i class="mint-cell-allow-right"></i>
        </mt-cell>
      </div>
      <div class="list">
        <mt-radio
          title="性别"
          v-model="baseInfo.sex"
          :options="sexOptions">
        </mt-radio>
      </div>
      <mt-datetime-picker
        type="date"
        ref="picker"
        :start-date="new Date(1950,1,1)"
        :end-date="new Date()"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        @confirm="handleConfirm">
      </mt-datetime-picker>
    </div>
    <div class="introduce">
      <p>个人简介</p>
      <textarea name="" id="" cols="30" rows="10" placeholder="请输入个人介绍" v-model="baseInfo.resume"></textarea>
    </div>
    <div class="button">
      <mt-button class="next" @click="goExperience" size="normal" type="primary">下一步</mt-button>
    </div>
    <update-name :name="baseInfo.nickname" v-if="showName" @cancel="cancel" @changeContent="updatedName"></update-name>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from 'vue-property-decorator';
import UpdateName from '@/components/UpdateName'
import UserService from "../../api/UserService";
import { EBaseDataType } from '../../enum/EBaseDataType';
import { mapActions, mapGetters } from 'vuex';
import {INoop} from "../../util/methods"

@Component({
  components:{
    UpdateName
  },
  methods:{
    ...mapActions({
      setBaseInfo:'my/setBaseInfo',
    })
  },
  computed:{
    ...mapGetters({
      user:'user'
    })
  }
})
export default class BaseInfo extends Vue{
  private service = UserService.getInstance();
  private areas:Array<{code:string,name:string}> = []
  private showName = false
  private setBaseInfo:INoop;
  private sexOptions = [{
      label: '男',
      value: 1
  },{
      label: '女',
      value: 2
  }]
  private baseInfo = {
    headimgurl:'',
    birthday:'',
    sex:'1',
    address:'',
    resume:'',
    nickname: '',
  }
  created(){
    document.title = "基础信息"
    Object.assign(this.baseInfo,(<any>this).user)
    this.baseInfo.sex = this.baseInfo.sex.toString()
    this.service.getBase(EBaseDataType.Area).then(res=>{
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
    this.baseInfo.birthday = (<any>new Date(data)).format("yyyy-MM-dd");
  }
  cancel(){
    this.showName = false;
  }
  updatedName(name:string){
    this.baseInfo.nickname = name;
    this.showName = false;
  }
  goExperience(){
    //验证
    if(!this.baseInfo.address){
      this.$toast("请选择地址");
      return;
    }
    if(!this.baseInfo.birthday){
      this.$toast("请选择生日");
      return;
    }
    this.setBaseInfo(this.baseInfo)
    this.$router.push({path:'/exprience'})
  }
}
</script>

<style lang="less" scoped>
@bg:#f5f5f5;
@mainColor:#00D1CF;
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
      .mint-cell-value.is-link {
        img{
          height:4.2rem;
          width:4.2rem;
          border-radius:1.6rem;
        }
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
  .button{
    display: flex;
    justify-content: center;
    background:#fff;
    width:100%;
    bottom:80px;
    padding-top:20px;
    .next{
      width:12rem;
      height:4rem;
      line-height: 4rem;
      color:#fff;
      background:@mainColor;
      border-radius:.3rem;
    }
  }
}
</style>
