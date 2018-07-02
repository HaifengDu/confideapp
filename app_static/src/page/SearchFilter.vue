<template>
<div>
    <div class="filter-title">精准筛选</div>
    <section>
        <div>话题</div>
        <div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </section>
    <section>
        <div>起步价</div>
        <div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </section>
    <section>
        <div>性别</div>
        <div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </section>
    <section>
        <div>家庭</div>
        <div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </section>
    <section>
        <div>是否认证</div>
        <div>
            <div></div>
            <div></div>
        </div>
    </section>
    <section>
        <div>年龄</div>
        <div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </section>
    <section>
        <div>学历</div>
        <div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </section>
    <section>
        <div>职业</div>
        <div>

        </div>
    </section>
    <section>
        <div>地区</div>
        <div>
            <select name="address"></select>
        </div>
    </section>
</div>
    
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator";

@Component
export default class SearchFilter extends Vue{
    
}
</script>
<style lang="less" scoped>
.filter-title{
    font-size: 1.8rem;
    color:@mainColor;
}
</style>
