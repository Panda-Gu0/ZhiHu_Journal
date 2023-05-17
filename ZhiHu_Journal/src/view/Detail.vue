<template>
  <van-skeleton title :row="5" v-if="newsInfo === null"/>
  <div class="container" v-else v-html="newsInfo.body"></div>
      <h2 class="imgTitle"></h2>
  <div class="nav-box">
    <van-icon name="arrow-left" @click="turnBack"></van-icon>
    <van-icon name="comment-o" :badge="comments"></van-icon>
    <van-icon name="good-job-o" :badge="popularity"></van-icon>
    <van-icon name="star-o" :color="isStore ? '#1989fa' : '#000'"  @click="storeHandle"></van-icon>
    <van-icon name="share-o" color="#ccc"></van-icon>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { computed, onBeforeMount, onBeforeUnmount, onUpdated, reactive, toRefs } from '@vue/runtime-core'
import api from '../api/index'
import { useStore } from 'vuex'
import { Toast } from 'vant'
export default {
    name: 'Detail',
    setup() {
      // 创建 useRouter 实例
      const router = useRouter();
      // 可以通过 useRoute 来获取详情页的相关 id
      const route = useRoute();
      const store = useStore();
      let state = reactive({
        comments: 0, // 用来接收请求获取到的评论数
        popularity: 0, // 用来接收请求收到的点赞数
        newsInfo: null // 用来接收请求到的新闻详情信息
      });

      let isStore = computed(() => {
        let { isLogin, storeList } = store.state;
        if(isLogin) {
          if(!Array.isArray(storeList)) storeList = [];
          return storeList.some((item) => {
            return +item.news.id === +route.params.id;
          })
        }
        return false;
      })

      onBeforeMount(async () => {
        if(store.state.isLogin === null) {
          await store.dispatch('changeIsLoginAsync');
        }
        if(store.state.isLogin) {
          if(store.state.info === null) store.dispatch('changeInfoAsync');
          if(store.state.storeList === null) store.dispatch('changeStoreListAsync');
        }
      })

      // 收藏文章事件
      const storeHandle = async () => {
        if(!store.state.isLogin) {
          Toast('登录账号后才能进行收藏!');
          router.push({
            path: '/login',
            query: {
              from: `detail/${route.params.id}`,
            },
          });
          return;
        }
        if(isStore.value) return;
        let { code } = await api.store(route.params.id);
        if(+code !== 0) {
          Toast('收藏失败,请检查当前网络状态!');
          return;
        }
        Toast('收藏成功!');
        store.dispatch('changeStoreListAsync');
      }

      // 定义返回上一页面函数
      const turnBack = () => {
        router.back();
      }

      onBeforeMount( async () => {
        let id = route.params.id;
        // 获取并存储新闻详情信息
        let newsInfo = await api.queryNewsInfo(id);
        state.newsInfo = newsInfo;
        // 动态创建 css
        let link = document.createElement('link');
        link.id = 'link';
        link.rel = 'stylesheet';
        link.href = state.newsInfo.css[0];
        document.head.appendChild(link); // 导入动态创建好的 css
        // 获取并存储点赞数等相关信息
        let { popularity, comments } = await api.queryNewsStory(id);
        state.popularity = popularity;
        state.comments = comments;
      })

        // 在页面第一次进行数据更新时将详情页面的 banner 区域图片渲染到页面上
        onUpdated(() => {
          let imgPlaceHolder = document.querySelector('.img-place-holder');
          let imgTitle = document.querySelector('.imgTitle');
          if(imgPlaceHolder) {
            // 因为进入详情页面会自行触发一次 onUpdated,所以需要再加个判断条件确保只进行一次图片渲染
            if(imgPlaceHolder.innerHTML.trim() === '') {
              imgPlaceHolder.innerHTML += `<img src="${state.newsInfo.image}"></img>`;
              imgTitle.innerHTML += `${state.newsInfo.title}`;
            }

          }
        })
        // 为了防止详情页面新增的 css 对缓存的主页面的图片样式产生影响,在组件销毁前应将详情页面的 css 移除掉
      onBeforeUnmount(() => {
        let link = document.getElementById('link');
        if(!link) return;
        document.head.removeChild(link);
      })
      return {
        ...toRefs(state),
        isStore,
        storeHandle,
        turnBack
      }
    }
}
</script>

<style lang="less" scoped>
  .container {
    background: #fff;
    padding-bottom: 50px;
    margin: 0;

    :deep(.img-place-holder) {
      height: 375px;
      overflow: hidden;
      img {
        display: block;
        margin: 0;
        width: 100%;
        min-height: 100%;
      }
    }
  }

  .imgTitle {
    width: 92%;
    max-height: 50px;
    line-height: 25px;
    position: absolute;
    color: #fff;
    font-size: 20px;
    top: 300px;
    left: 19px;
  }

  .van-skeleton {
    padding: 30px 15px;
  }

  .nav-box {
    position: fixed;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f4f4f4;
    height: 50px;
    padding: 0 20px;

    .van-icon:nth-child(1) {
      position: relative;
      &::after {
        position: absolute;
        top: -10%;
        right: -15px;
        content: '';
        width: 1px;
        height: 120%;
        background: #d5d5d5;
      }
    }

    :deep(.van-badge) {
      background-color: transparent;
      border: none;
      color: #000;
      right: -5px;
    }
  }
</style>