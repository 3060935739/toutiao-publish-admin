<template>
  <el-container class="layout-container">
    <el-aside width="auto" class="aside">
      <app-aside class="aside-menu" :is-collapse="isCollapse"></app-aside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i
            :class="{
              'el-icon-s-fold': isCollapse,
              'el-icon-s-unfold': !isCollapse,
            }"
            @click="isCollapse = !isCollapse"
          ></i>
          <span class="headerText">头条内容发布系统</span>
        </div>
        <el-dropdown>
          <div class="avatar-warp">
            <img class="avatar" :src="user.photo" alt="" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <!-- 组件默认不识别原生事件的，除非内部做了处理 .native原生事件修饰符 -->
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from "./components/aside";
import { getUserProfile } from "@/api/user";
import globalBus from "@/utils/global-bus";

export default {
  name: "LayoutIndex",
  components: {
    AppAside,
  },
  data() {
    return {
      user: {}, //当前登录用户信息
      isCollapse: false,
    };
  },
  created() {
    this.loadUserProfile();
    //注册自定义事件 当这个事件发布以后才执行
    globalBus.$on("updataUser", (data) => {
      this.user.name = data.name;
      this.user.photo = data.photo;
    });
  },
  methods: {
    //获取用户信息
    loadUserProfile() {
      getUserProfile().then((res) => {
        this.user = res.data.data;
      });
    },
    //退出登录事件
    onLogout() {
      this.$confirm("确认退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.localStorage.removeItem("user");
          this.$router.push("/login");
          this.$message({
            type: "success",
            message: "退出成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消退出",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside {
  border-right: 1px solid pink;
  .aside-menu {
    height: 100%;
  }
}
.header {
  height: 61px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fffffd;
  border-bottom: 1px solid pink;
}
.el-icon-s-fold {
  margin-right: 8px;
  font-size: 18px;
}
.el-icon-s-unfold {
  margin-right: 8px;
  font-size: 18px;
}
.headerText {
  font-size: 18px;
  font-weight: 700;
}
.avatar-warp {
  display: flex;
  align-items: center;
  .avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 5px;
  }
}
</style>