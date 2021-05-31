<template>
  <el-menu
    class="nav-menu"
    default-active="/"
    background-color="#fff"
    text-color="#000"
    active-text-color="hotpink"
    router
    :collapse="isCollapse"
  >
    <div>
      <img src="./toutiao.png" alt="" class="toutiao" />
    </div>
    <el-menu-item index="/" class="firstItem" >
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-document"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont icon-image"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont icon-publish"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="iconfont icon-commentdots-fill"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="iconfont icon-fans"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "AppAside",
  props:['is-collapse'],
  data() {
    return {
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.toutiao {
  width: 198px;
  height: 56px;
}
.el-menu-item {
  border-bottom: 1px solid pink;
}
.firstItem {
  border-top: 1px solid pink;
}
.nav-menu {
  border: none;
  .iconfont {
    margin-right: 8px;
    padding-left: 5px;
  }
}
</style>