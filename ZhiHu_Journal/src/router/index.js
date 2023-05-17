/* 导入 vue-router 相关配置 */
import { createRouter, createWebHashHistory } from "vue-router";
import routes from './routes';
import store from '../store/index';
import api from '../api/index';
import { Toast } from "vant";
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
// 设置导航守卫：用户登录直接放行,未登录则进行拦截
router.beforeEach(async (to, from, next) => {
    let arr = ['/person', '/updateperson', '/store']; // 需要进行拦截的页面
    if(arr.includes(to.path)) {
        // 利用 store/index.js 中的 isLogin 判断是否已经登录
        let isLogin = store.state.isLogin;
        if(isLogin) { // 已登录直接放行
            next();
            return;
        }
        if(isLogin === false) { // 未登录跳转到登录界面
            Toast('请先进行登录!');
            next('/login');
            return;
        }
        if(isLogin === null) { // 为向服务器发送检查登录状态请求则异步进行发送请求
            try {
                let { code, data } = await api.checkLogin();
                if(+code !== 0) {
                    Toast('请先进行登录!');
                    next('/login');
                    return;
                }
                store.commit('changeIsLogin', true);
                store.commit('changeInfo',data); // 检测已经登录则更新完 store/index.js 中的登录信息再放行
                console.log(isLogin);
                next();  
            }catch(err) { }
            return;
        }
    }
    next();
})
export default router;