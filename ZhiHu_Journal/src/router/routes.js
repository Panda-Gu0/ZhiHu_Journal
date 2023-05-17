/* 配置页面路由 */
import Home from '../view/Home.vue';
const routes = [
    {
        path: '/',
        component: Home // 默认进入主页界面
    },
    // 其他页面采用路由懒加载方式,提高用户使用体验
    {
        path: '/detail/:id',
        // webpackChunkName 将懒加载分成几个板块进行加载
        component: () => import(/* webpackChunkName:"other1" */ '../view/Detail.vue') // .vue 扩展名记得补齐否则报错
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName:"other1" */ '../view/Login.vue')
    },
    {
        path: '/person',
        component: () => import(/* webpackChunkName:"other2" */ '../view/Person.vue')
    },
    {
        path: '/store',
        component: () => import(/* webpackChunkName:"other2" */ '../view/Store.vue')
    },
    {
        path: '/updateperson',
        component: () => import(/* webpackChunkName:"other2" */'../view/UpdatePerson.vue')
    },
    {
        path: '/:pathMatch(.*)*', // Vue3 路由重定向方式
        redirect: '/'
    },
];
export default routes;