<template>
    
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator";
import {mapGetters} from "vuex";
import ListService from "../api/ListService";
const listService = ListService.getInstance();

@Component({
    computed:{
        ...mapGetters({"searchConds":"list/searchConds"})
    }
})
export default class SearchResult extends Vue{
    created() {
        // console.log((<any>this).searchConds)
        const searchConds = (<any>this).searchConds;
        if(searchConds){
            const conds = Object.assign({},searchConds);
            for(let key in conds){
                if(conds[key]===-1){
                    delete conds[key];
                }
            }
            listService.getSearchResult(conds);
        }
    }
}
</script>
<style lang="less" scoped>

</style>

