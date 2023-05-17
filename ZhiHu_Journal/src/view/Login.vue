<template>
  <Nav></Nav>
  <van-form ref="formBox" @submit="submit">
    <van-cell-group inset>
      <van-field
        v-model="phone"
        center
        label="手机号"
        label-width="50px"
        name="phone"
        :rules="[
          { required: true, message: '手机号不能为空!' },
          { pattern: regPhone, message: '请输入正确的手机号码!' },
        ]"
      >
        <template #button>
          <van-button
            size="small"
            :type="enable ? 'primary' : ''"
            class="form-btn"
            :disabled="!enable"
            @click="sendcode"
          >
            {{ enable ? "发送验证码" : time }}
          </van-button>
        </template>
      </van-field>

      <van-field
        v-model.trim="code"
        label="验证码"
        label-width="50px"
        :rules="[
          { required: true, message: '验证码不能为空!' },
          { pattern: regCode, message: '验证码必须是6位有效数字!' },
        ]"
      />
    </van-cell-group>

    <div style="margin: 20px 40px">
      <van-button round block type="primary" native-type="submit">
        立即登录/注册
      </van-button>
    </div>
  </van-form>
</template>

<script>
import { reactive, ref, toRefs } from "@vue/reactivity";
import Nav from "../components/Nav.vue";
import api from "../api/index";
import { Toast } from "vant";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
export default {
  name: "Login",
  components: {
    Nav,
  },
  setup() {
    const store = useStore(),
      router = useRouter(),
      route = useRoute();
    let state = reactive({
      phone: "",
      code: "",
      enable: true, // 判断是否能够点击发送验证码
      time: "60s", // 发送验证码倒计时
    });
    // 用来获取手机号表单区域的对象
    let formBox = ref(null);

    // 发送验证码
    const sendcode = async () => {
      // 请求发送验证码之前先进行表单预验证
      try {
        await formBox.value.validate("phone");
        // 通过预验证发送验证码
        let { code, loginCode } = await api.phoneCode(state.phone);

        if (+code !== 0) {
          return Toast("当前网络繁忙,请稍后再试!");
        }
        // 请求成功后开启倒计时
        state.enable = false; // 禁止发送
        state.time = `60s`; // 保证下次发送验证码是从 60s 开始显示倒计时
        // 设置定时器
        let seconds = 60;
        let timer = setInterval(() => {
          seconds--;
          if (seconds === 0) {
            clearInterval(timer); // 倒计时结束清除定时器允许再次点击发送按钮
            state.enable = true;
            return;
          }
          state.time = `${seconds}s`;
        }, 1000);
        return Toast.success({
          message: `短信发送成功,验证码为:\n${loginCode}`,
          duration: 4000, //设置展示时间为4秒
        });
      } catch (err) {}
    };

    // 表单提交
    const submit = async () => {
      let { code, token } = await api.login(state.phone, state.code);
      if (+code !== 0) {
        formBox.value.resetValidation(); // 登录失败清除校验提示
        state.code = "";
        return Toast("验证码已过期,请稍后再试!");
      }
      // 请求接口成功将 token 进行存储,并保存登录用户信息
      localStorage.setItem("token", token);
      store.commit("changeIsLogin", true);
      store.dispatch("changeInfoAsync");
      store.commit('changeStoreList', null);
      Toast("登录成功!");
      // 进行页面跳转
      // 如果是从非主页面点击的页面跳转则遵循从哪里来回哪去,如果是进入个人中心,则登录成功后直接跳转到个人中心页面
      let from = route.query.from; // 获取进入登录页面的前一个地址
      if (from) {
        router.replace(`/${from}`); // 如果 from 为真,则从哪来回哪去
      }
      router.replace("/person"); // from 为空,直接跳转到个人中心
    };
    return {
      ...toRefs(state),
      formBox,
      sendcode,
      submit,
      // 手机号码正则
      regPhone:
        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
      // 短信验证码正则
      regCode: /^\d{6}$/,
    };
  },
};
</script>

<style lang="less" scoped>
.van-form {
  margin-top: 30px;

  .form-btn {
    width: 78px;
  }
}
</style>