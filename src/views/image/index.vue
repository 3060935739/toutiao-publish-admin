<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑导航 -->
      </div>
      <ImageList />
    </el-card>
  </div>
</template>

<script>
import ImageList from "./components/imagesList.vue";
export default {
  name: "ImageIndex",
  components: {
    ImageList,
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="less">
</style>