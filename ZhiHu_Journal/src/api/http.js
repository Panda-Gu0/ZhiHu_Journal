import axios from "axios";
import qs from 'qs';
import { isPlainObject } from '../assets/utils';
import { Notify } from 'vant';
// 导入加密算法
import md5 from 'blueimp-md5';
axios.defaults.baseURL = '';
axios.defaults.timeout = 60000;
// 自定义请求配置, transformRequest 允许在向服务器发送前，修改请求数据
axios.defaults.transformRequest = data => {
    // 如果请求的数据是纯粹的对象, 则将其序列化成 URL 的形式再进行发送
    if (isPlainObject(data)) return qs.stringify(data);
    return data;
};
// 请求拦截器之前进行一些自定义配置
axios.interceptors.request.use(config => {
    // 针对于部分接口，我们携带令牌 token 和签名信息 sign
    let apiList = ['/check_login', '/user_info', '/user_update', '/store', '/store_remove', '/store_list'],
        token = localStorage.getItem('token');
        // 将 config.url（接口发送请求的地址） 中的前缀 "/api" 去掉，再查看其是否存在于 apiList 中,如果存在且本地能够获取 token, 则生成签名信息 sign(基于 md5 算法将 token 和时间戳进行加密)
    if (apiList.includes(config.url.replace('/api', '')) && token) {
        // 构建一个新的时间戳
        let time = +new Date(),
            // 利用 md5 算法加密生签名信息 sign
            sign = md5(`${token}@${time}@pandaGuo`);
            // 最后在请求头中携带三个信息
        config.headers['authorzation'] = token;
        config.headers['time'] = time;
        config.headers['sign'] = sign;
    }
    return config;
});
axios.interceptors.response.use(response => {
    return response.data;
}, reason => {
    Notify({
        type: 'danger',
        message: '当前网络繁忙,请稍后再试!'
    });
    return Promise.reject(reason);
});
export default axios;