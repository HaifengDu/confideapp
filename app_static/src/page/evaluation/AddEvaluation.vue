<template>
    <div>
        999
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator'; 

@Component
export default class AddEvaluation extends Vue{

    created(){
        console.log(666);
        console.log(this.$route.params.id);
    }
}
</script>

<style lang="less" scoped>
    @import '../../assets/style.less';

</style>


