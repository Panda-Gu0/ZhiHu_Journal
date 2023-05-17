<template>
  <!-- 头部日期 -->
  <Header :time="today"/>
  <!-- 轮播图区域 -->
  <section class="banner-box">
    <van-swipe v-if="bannerList.length > 0" autoplay="3000" lazy-render>
      <van-swipe-item v-for="item in bannerList" :key="item.id">
        <router-link :to="`/detail/${item.id}`" class="content">
          <img :src="item.image" alt="">
          <div class="mark">
            <h3 class="title">{{ item.title }}</h3>
            <span class="tip">{{ item.hint }}</span>
          </div>
        </router-link>
      </van-swipe-item>
    </van-swipe>
  </section>
  <!-- 新闻列表区域 -->
  <van-skeleton title :row="5" v-if="newsList.length === 0"></van-skeleton>
  <div v-else>
    <section class="news-box" v-for="(item, index) in newsList" :key="index">
    <van-divider content-position="left" v-if="index !== 0">
      {{ formatTime(item.date, "{1}月{2}日") }}
    </van-divider>
    <div class="content">
      <Item v-for="item2 in item.stories" :key="item2.id" :data="item2"/>
    </div>
  </section>
  </div>
  <!-- '加载更多'区域 -->
  <div class="lazy-more" v-show="newsList.length !== 0" ref="loadMore">
    <van-loading size="12px">资源拼命加载中...</van-loading>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Item from '../components/Item.vue'
import api from '../api/index'
import { reactive, ref, toRefs } from '@vue/reactivity'
import { onBeforeMount, onMounted } from '@vue/runtime-core'
import { formatTime } from '../assets/utils'
export default {
  components: { Header, Item },
    name: 'Home',
    setup() {
      // 创建响应式数据
      let state = reactive({
        today: '', // 接收请求回来的当日日期
        newsList: [], // 接收请求回来的新闻列表信息
        bannerList: [], // 接收请求回来的轮播图信息
      });

      // 获取提示加载标签 DOM 元素
      let loadMore = ref(null);


      // 第一次加载时请求获取数据
      onBeforeMount(async () => {
        let { date, stories, top_stories } = await api.queryNewsLatest();
        // 请求成功后将对应数据存储到本地
        state.today = date;
        state.newsList.push( // newsList 需要动态插入新数据不能冻结,但里面的每一项可以进行冻结
          Object.freeze({
          date,
          stories
        })
        )
        // 将接受到的对象进行冻结后就不再进行 proxy 代理,一定程度上可以提高性能(适用在获取到的数据后续不需要更新的情况)
        state.bannerList = Object.freeze(top_stories);
      })


      // 第一次渲染完加载更多数据
      onMounted(() => {
        // 利用 IntersectionObserver 监听 loadMore,其中 change 是一个数组
        let ob = new IntersectionObserver( async (changes) => {
          let item = changes[0];
          // 如果 loadMore 出现在可视区域,则向接口发起请求
          if(item.isIntersecting) {
           let res = await api.queryNewsBefore(state.newsList[ state.newsList.length - 1 ][ "date" ]);
          // 将获取到的往日新闻列表存储到 newList 中
          state.newsList.push((res));
          }
        });
        // 对获取到的 DOM 元素 loadMore 进行监听
        ob.observe(loadMore.value);
      })

      return {
        ...toRefs(state),
        loadMore,
        formatTime // 记得导入其他文件夹的函数也需要 return
      }
    }
}
</script>

<style lang="less" scoped>
  .banner-box {
    // 这里后续可以加一个加载资源的样式
    box-sizing: border-box;
    height: 375px;
    background: #d5d5d5;

    .van-swipe {
      height: 100%;
      background: #fff;

      .content {
        display: block;
        height: 100%;
        color: #fff;
        // 在详情页面中的 content 中样式重新进行定义而首页进行了组件缓存没有被销毁,所以在此返回首页时首页的图片会受到详情页面 css 的影响(接口请求回来的 css 影响到的是全局的)
        margin: 0;

        img {
          display: block;
          width: 100%;
          height: 100%;
          margin: 0;
        }
        .mark {
          position: absolute;
          bottom: 0;
          left: 0;
          box-sizing: border-box;
          padding: 10px 20px;
          width: 100%;
          height: 110px;
          // 设置背景渐变色
          background: rgba(0, 0, 0, 0.3);
          background: -webkit-linear-gradient(
            top,
            rgba(0,0,0,0.0),
            rgba(0,0,0,0.5)
          );

          .title {
            padding-top: 10px;
            max-height: 50px;
            font-size: 20px;
            line-height: 25px;
            overflow: hidden;
          }

          .tip {
            font-size: 12px;
            line-height: 20px;
          }
        }
      }

      :deep(.van-swipe__indicators) {
        left: auto;
        right: 15px;
        transform: none;

        .van-swipe__indicator--active {
          width: 15px;
          border-radius: 3px;
          background: #fff;
        }
      }
    }
  }

  .news-box {
    padding: 0 15px;

    .van-divider {
      margin: 5px 0;
      font-size: 12px;
      // 去掉显示时间左边的线
      &:before {
        display: none;
      }
    }
  }

  .van-skeleton {
    padding: 30px 15px;
  }

  .lazy-more {
    display: flex;
    justify-content: center;
    padding: 10px;
    background: #f4f4f4;
  }
</style>