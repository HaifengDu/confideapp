<template>
  <div>
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

</style>
