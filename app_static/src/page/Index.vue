<template>
  <div class="wrap">
    <router-view/>
    <tabbar></tabbar>
  </div>
</template>

<script>
import Tabbar from '@/components/Tabbar'
export default {
  components:{
    Tabbar
  }
}
</script>

<style lang="less">
.wrap{
  margin-bottom: 56px;
}
</style>
