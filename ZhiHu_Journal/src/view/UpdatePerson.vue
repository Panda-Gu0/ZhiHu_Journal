<template>
  <Nav />
  <div class="form-box">
    <van-cell-group inset>
      <van-field v-model="name" label="用户名" label-width="60px" />
      <van-field label="用户头像" label-width="60px">
        <template #input>
          <van-uploader v-model="pic" max-count="1" />
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 20px 40px">
      <van-button
        :loading="loading"
        loading-text="处理中..."
        round
        block
        type="primary"
        @click="submit"
      >
        修改信息
      </van-button>
    </div>
  </div>
</template>

<script>
import Nav from "../components/Nav.vue";
import { reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { Toast } from "vant";
import api from "../api/index";
import { useRouter } from "vue-router";

export default {
  components: { Nav },
  name: "UpdatePerson",
  setup() {
    const store = useStore();
    const router = useRouter();
    let { name } = store.state.info;
    // 获取用户昵称及头像
    let state = reactive({
      name: name,
      pic: [],
      loading: false,
    });
    // 提交修改信息
    const submit = async () => {
      if(state.loading === true) return;
      state.loading = true;
      let { name, pic } = state;
      let reg = /^[\w\u4e00-\u9fa5]+$/;
      // 规则校验
      if (!reg.test(name)) {
        Toast("请输入正确格式的用户名!");
        return;
      }
      if (pic.length === 0) {
        Toast("用户头像不能为空!");
        state.loading = false;
        return;
      }
      // 请求接口上传修改后的用户信息
      let { code, data } = await api.userUpdate(name, pic[0].file);
      if (+code !== 0) {
        Toast("信息修改失败，请检查当前网络或稍后再试!");
        return;
      }
      Toast('个人信息修改成功!');
      // 将服务器返回的最新修改信息更新到 store 中
      store.commit('changeInfo', data);
      router.replace('/person');
      state.loading = false;
    };
    return {
      ...toRefs(state),
      submit,
    };
  },
};
</script>

<style lang="less" scoped>
.form-box {
  margin-top: 30px;
}
</style>