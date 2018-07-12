<template>
    <div>
        <span>

        </span>
        <button @click="test">发送</button>
    </div>    
</template>
<script lang="ts">
import Vue from 'vue'
import { getSocket } from '../socketLaunch';
import {Component} from "vue-property-decorator"
import SocketWrapper from '../socket';
@Component
export default class Chat extends Vue{
    private sockeWrapper:SocketWrapper;
    private roomid:string;
    constructor(){
        super();
        this.sockeWrapper = getSocket();
    }
    created(){
        this.sockeWrapper.emit("join",{
            pid:1,lid:2,name:"杜海峰"
        });
        this.sockeWrapper.on("join",this.joinM);
        this.sockeWrapper.on("send",this.sendM);
    }
    test(){
        this.sockeWrapper.emit("send",{
            msg:"123123123",
            pid:1,
            lid:2
        });
    }
    private joinM=(obj:any)=>{
        this.roomid = obj.roomid;
    } 
    private sendM = (obj:any)=>{
        console.log(obj);
    }
    beforeDestroy() {
       this.sockeWrapper.emit("leave",{
           roomid:this.roomid
       }); 
       this.sockeWrapper.remove("join",this.joinM);
       this.sockeWrapper.remove("send",this.sendM);
    }
}
</script>

<style lang="less" scoped>

</style>


