<template>
  <div class="login-container">
    <el-form
      class="login-form"
      ref="login-form"
      :model="user"
      :rules="formRules"
    >
      <h3>头条内容发布系统</h3>
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree"
          >我已阅读并同意用户协议和隐私条款</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="onLogin"
          :loading="loginLoading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/api/user.js";

export default {
  name: "LoginIndex",
  data() {
    return {
      user: {
        mobile: "13911111111",
        code: "246810",
        agree: false,
      },
      loginLoading: false,
      formRules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "请输入验证码称", trigger: "blur" },
          {
            pattern: /^\d{6}$/,
            message: "请输入正确的验证码",
            trigger: "blur",
          },
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                callback(new Error("请勾选用户协议"));
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    // 点击登录事件
    onLogin() {
      const user = this.user;
      this.$refs["login-form"].validate((valid) => {
        if (!valid) {
          return this.$message.error("请填写正确表单");
        }
        this.login();
      });
    },
    // 向服务器发起登录请求
    // 接口请求可能协议重用,实际工作接口容易变动
    // 建议把所有的请求封装成函数然后组织到模块中进行管理
    login() {
      this.loginLoading = true;
      login(this.user)
        .then((res) => {
          this.$message.success("登录成功！");
          this.loginLoading = false;
          window.localStorage.setItem("user", JSON.stringify(res.data.data));
          this.$router.push("/");
        })
        .catch((err) => {
          this.$message.error("登录失败！");
          this.loginLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
  .login-form {
    h3 {
      text-align: center;
      margin: 25px auto;
    }
    background-color: #fff;
    padding: 0px 50px 10px 50px;
    min-width: 400px;
    .login-btn {
      width: 100%;
    }
  }
}
</style>