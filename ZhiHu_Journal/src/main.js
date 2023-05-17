import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';
/* 引入 vant 组件库 */
import Vant,{Lazyload} from 'vant';
import 'vant/lib/index.css';
import './assets/reset.min.css';
/* 配置可伸缩布局方案 */
import 'amfe-flexible';
/* 引入 vuex 状态管理文件 */ 
import store from './store/index';
/* 引入处理设备最大宽度函数并执行 */
import { handleMaxWidth } from './assets/utils';
/* 当窗口大小改变时也执行处理最大宽度函数 */
window.addEventListener('resize',handleMaxWidth);
handleMaxWidth();
const app = createApp(App);
app.use(router);
app.use(Vant);
app.use(store);
app.use(Lazyload, {
    lazyComponent: true
})
app.mount('#app');