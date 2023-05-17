import { createStore, createLogger } from "vuex";
import api from "../api/index";
const env = process.env.NODE_ENV;
export default createStore({
    state: {
        isLogin: null, // 判断用户是否登录
        info: null, // 存储用户登录信息
        storeList: null // 用户收藏列表信息
    },
    mutations: {
        changeIsLogin(state, bool) {
            state.isLogin = bool;
        },
        changeInfo(state, payload) {
            state.info = payload;
        },
        changeStoreList(state, payload) {
            state.storeList = payload
        },
        removeStoreList(state, id) {
            if(state.storeList === null) return;
            state.storeList = state.storeList.filter(item => {
                return +item.id !== +id;
            })
        }
    },
    actions: {
        // 异步请求
        async changeIsLoginAsync({ commit }) {
            let bool = false; // 默认状态未登录
            let { code } = await api.checkLogin(); // 请求接口检测用户登录状态
            if(+code === 0) bool = true; // 如果响应码为 0,则用户已登录(code 前的加号是将其转换成 number 类型)
            commit('changeIsLogin', bool);
        },
        async changeInfoAsync({ commit }) {
            let { code, data } = await api.getUserInfo();
            if(+code === 0) {
                commit('changeInfo', data);
            } 
        },
        async changeStoreListAsync({ commit }) {
            let { code, data } = await api.storeList();
            if(+code !== 0) {
                data = [];
            } 
            commit('changeStoreList', data);
        }
    },
    plugins: env === 'production' ? [] : [createLogger()]
});