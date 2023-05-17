<template>
  <Nav></Nav>
  <div class="base-info" v-if="info">
    <img :src="info.pic" @click="$router.push('./updateperson')"/>
    <p>{{ info.name }}</p>
  </div>
  <van-cell-group>
    <van-cell title="我的收藏" is-link url="#/store" />
    <van-cell title="退出登录" @click="logout" />
  </van-cell-group>
</template>

<script>
import Nav from "../components/Nav.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Toast } from "vant";
import { computed, onBeforeMount } from "vue";
export default {
  name: "Person",
  components: {
    Nav,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    let info = computed(() => {
      let { isLogin, info } = store.state;
      if(isLogin && info) return info;
      return null;
    })
    onBeforeMount(() => {
      // 为了判断头部头像的变化(游客状态默认为小狗,登录后显示自己的头像),也需要在 Header 组件中进行异步请求登录信息
      let { isLogin, info } = store.state;
      if (isLogin === null) store.dispatch("changeIsLoginAsync");
      if (info === null) store.dispatch("changeInfoAsync");
    });
    // 退出登录逻辑处理
    const logout = () => {
      Toast("您已成功退出登录!");
      localStorage.removeItem("token"); // 清除 token
      store.commit("changeIsLogin", null);
      store.commit("changeInfo", null);
      store.commit('changeStoreList', null);
      router.replace("/lgoin"); // 跳转回登录界面
    };

    return { logout, info };
  },
};
</script>

<style lang="less" scoped>
.base-info {
  box-sizing: border-box;
  margin: 20px 0;

  img {
    display: block;
    margin: 0 auto;
    width: 86px;
    height: 86px;
    border-radius: 50%;
  }

  p {
    line-height: 50px;
    font-size: 18px;
    text-align: center;
  }
}
</style>