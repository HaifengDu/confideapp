<template>
    <div></div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Prop,Component } from 'vue-property-decorator';
import { mapActions } from 'vuex';
import {INoop} from "../util/methods"
import ErrorMsg from '../model/ErrorMsg';
import { IUser } from '../interface/model/IUser';
import config from "../config";

@Component({
    methods:{
        ...mapActions(["checkCode"])
    }
})
export default class Login extends Vue{
    private checkCode:INoop;
    created() {
        this.checkCode().then((res:IUser)=>{
            this.$router.replace("/");
        },(err:ErrorMsg)=>{
            const originUrl = encodeURIComponent(location.origin);
            const appid = config.appid;
            // location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${originUrl}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect;`;
            location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${originUrl}&response_type=code&scope=snsapi_userinfo&state=State#wechat_redirect`;
        });
    }
}
</script>
