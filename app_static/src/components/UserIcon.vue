<template>
	<div class="fbui-user-icon" :title="filterTitle" :style="{'width':filterWidth,'height':filterHeight,'line-height':filterHeight}">
		<template v-if="user">
			<div :class="{'u_icon':true,'is_img':(user.ico),'sex_2':(user.sex == 2),'sex_1':(user.sex == 1)}">
				<template v-if="user.ico">
					<img :src="user.ico" />
				</template>
				<template v-else>
					{{filterName}}
				</template>
			</div>
		</template>
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component, Prop, Watch, Emit} from 'vue-property-decorator';

@Component
export default class UserIcon extends Vue{
  @Prop()
  private user:any
  @Prop({type:String,default:''})
  private size:string

	get filterName(){
			 	var result = "未";
				var name = "";
				if(this.user){
					name = this.user.nick_name || this.user.name;
				}
				if(name){
					if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(name)){//有中文
						result = name.substr(name.length-1,name.length);
					}else{//纯英文
						result = name.substr(0,1);
					}
				}
				return result;
			}
	get	filterWidth(){
				var width = '40px';
				if(this.size){
					width = this.size + 'rem';
				}
				return width;
			}
	get	filterHeight(){
				var height = '40px';
				if(this.size){
					height = this.size + 'rem';
				}
				return height;
			}
		get	filterTitle(){
				if(this.user && (this.user.nick_name || this.user.name)){
					return this.user.nick_name || this.user.name
        }
        return '未'
			}
		}
</script>
<style scoped lang="less">
	.fbui-user-icon{
		.u_icon{
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background: #67caff;
		    font-size: 14px;
		    color: #fff;
		    text-align: center;
		    &.is_img{
		    	background: #fff !important;
		    }
		    img{
		    	width: 100%;
		    	height: 100%;
		    	border-radius: 50%;
		    	vertical-align: top;
		    }
		    &.sex_2{
		    	background: #67caff;
		    }
		    &.sex_1{
		    	background: #ff746f;
		    }
		}
	}
</style>




