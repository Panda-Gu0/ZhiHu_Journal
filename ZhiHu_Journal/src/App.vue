<template>
  <router-view v-slot="{ Component }">
    <keep-alive include="Home">
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
</template>

<script>
export default {

}
</script>

<style lang="less">
  html,body {
    min-height: 100%;
    /* 不会出现横向滚动条 */ 
    overflow-x: hidden;
    background: #f4f4f4;
  }
  #app {
      margin: 0 auto;
      background: #fff;
  }
</style>