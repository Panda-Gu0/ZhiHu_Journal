/* 将对接好请求接口暴露出去供其他组件使用 */
import axios from './http';
export default {
    // 获取最新日报列表
    queryNewsLatest() {
        return axios.get('/api/news_latest');
    },
    // 获取历史日报列表
    queryNewsBefore(time) {
        return axios.get('/api/news_before', {
            params: {
                time
            }
        });
    },
    // 获取新闻详情
    queryNewsInfo(id) {
        return axios.get('/api/news_info', {
            params: {
                id
            }
        });
    },
    // 获取日报详细信息(点赞，评论数等)
    queryNewsStory(id) {
        return axios.get('/api/story_extra', {
            params: {
                id
            }
        });
    },
    // 用户登录
    login(phone, code) {
        return axios.post('/api/login', {
            phone,
            code
        });
    },
    // 获取手机验证码
    phoneCode(phone) {
        return axios.post('/api/phone_code',{
            phone
        });
    },
    // 检测用户登录状态
    checkLogin() { // 此处不需要获取 token,因为 token 已经添加到请求头中
        return axios.get('/api/check_login');
    },
    // 获取用户登录信息
    getUserInfo() {
        return axios.get('/api/user_info');
    },
    // 修改用户个人信息
    userUpdate(username, file) {
        // 因为需要上传图片,所以这里参数使用的是 FormData 格式
        let fm = new FormData();
        fm.append('username', username); // 通过 FormData 中的 append 方法将传参
        fm.append('file', file);
        return axios.post('/api/user_update', fm);
    },
    // 用户进行新闻收藏
    store(newsId) {
        return axios.post('/api/store', {
            newsId
        });
    },
    // 用户移除新闻收藏
    storeRemove(id) {
        return axios.get('/api/store_remove', {
            params: {
                id
            }
        });
    },
    // 获取登录用户的收藏列表
    storeList() {
        return axios.get('/api/store_list');
    }
}