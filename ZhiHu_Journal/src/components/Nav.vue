<template>
  <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="goBack"></van-nav-bar>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
export default {
    name: 'Nav',
    props: {
        title: {
            type: String,
            default: '' 
        }
    },
    setup() {
        // 创建路由实例
        const router = useRouter();
        const route = useRoute();
        const goBack = () => {
            router.back();
        }
        return {
            goBack
        }
    }
}
</script>

<style lang="less">
    :deep(.van-icon),
    :deep(.van-nav-bar__text) {
      color: #000;
    }
</style>