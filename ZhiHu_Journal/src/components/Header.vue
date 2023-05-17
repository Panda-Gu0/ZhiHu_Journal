<template>
  <header class="header-box">
      <div class="left">
          <div class="time">
              <span>{{ timeNow.day }}</span>
              <span>{{ timeNow.month }}</span>
          </div>
          <h1 class="tittle">早点休息</h1>
      </div>
      <router-link to="/person" class="link-btn">
        <img :src="pic">
      </router-link>
  </header>
</template>

<script>
import { computed, onBeforeMount } from '@vue/runtime-core';
import {formatTime } from '../assets/utils'
import { useStore } from 'vuex'
export default {
    name: 'Header',
    props: {
        // 从服务器获取当前的时间
        time: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const getAssetsImages = (name) => {
          return new URL(`/src/assets/images/${name}`, import.meta.url).href;
        }
        const store = useStore();
        // 根据登录状态动态获取头像图片
        /* 动态绑定的图片不能用相对地址: 项目进行打包之后文件的目录结构就不是原来这种 src 目录结构了 */
        let pic = computed(() => {
           let { isLogin, info } = store.state;
        // 如果用户已登录,则获取用户头像,用户没有头像则获取默认小狗头像
        if(isLogin && info) {
            return info.pic || getAssetsImages('timg.jpg');
        }
        return getAssetsImages('timg.jpg');
        })


        // 通过计算属性获取当前时间
        let timeNow = computed(() => {
            // 如果获取不到 props 传过来的时间就将 time 置空然后作为时间格式化函数的参数
            let time = props.time || null; 
            // 获取月份和日期
            let [month, day] = formatTime(time,"{1}-{2}").split('-');
            let monthCN = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月',];
            // 返回格式化后的月份与日期
            return {
                month: monthCN[month -1],
                day
            }
        });

        onBeforeMount(() => { // 为了判断头部头像的变化(游客状态默认为小狗,登录后显示自己的头像),也需要在 Header 组件中进行异步请求登录信息
            let { isLogin, info } = store.state;
            if( isLogin === null) store.dispatch('changeIsLoginAsync');
            if(info === null) store.dispatch('changeInfoAsync');
        })
        return {
            pic,
            getAssetsImages,
            timeNow
        }
    }
}
</script>

<style lang="less" scoped>
    .header-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;

        .left {
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .time {
            padding-right: 15px;
            border-right: 1px solid #ddd;

            span {
                display: block;
                height: 20px;
                line-height: 20px;
                font-size: 20px;
                text-align: center;

                &:nth-child(2) {
                    height: 15px;
                    line-height: 15px;
                    font-size: 12px;
                }
            }
        }

        .tittle {
            padding-left: 10px;
            font-size: 22px;
        }

        .link-btn {
            width: 30px;
            height: 30px;
            box-sizing: border-box;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }
</style>