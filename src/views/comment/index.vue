<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑导航 -->
      </div>
      <!-- 表格区域 -->
      <!-- 
        1.把数据列表绑定给表格的data
        2.设计表格列
        3.给表格列绑定要渲染的数据字段
       -->
      <el-table :data="articles" style="width: 100%" stripe>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
        ></el-table-column>
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数"
        ></el-table-column>
        <el-table-column prop="" label="评论状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? "正常" : "关闭" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.statusDisabled"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- /表格区域 -->
      <!-- 页码区域 -->
      <!-- 
        1.绑定页码
        2.绑定每页大小
        3.
       -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background
      >
      </el-pagination>
      <!-- /页码区域 -->
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from "@/api/article";
export default {
  name: "CommentIndex",
  data() {
    return {
      // 文章数据列表
      articles: [],
      totalCount: 0,
      pageSize: 20,
      page: 1,
    };
  },
  created() {
    this.loadArticles();
  },
  methods: {
    handleSizeChange() {
      this.loadArticles(1);
    },
    handleCurrentChange(page) {
      this.loadArticles(page);
    },
    loadArticles(page) {
      this.page = page;
      getArticles({
        response_type: "comment",
        page,
        per_page: this.pageSize,
      }).then((res) => {
        const { results } = res.data.data;
        results.forEach((article) => {
          article.statusDisabled = false;
        });
        this.totalCount = res.data.data.total_count;
        this.articles = results;
      });
    },
    //关闭开启评论功能
    onStatusChange(article) {
      article.statusDisabled = true;
      updateCommentStatus(article.id.toString(), article.comment_status).then(
        (res) => {
          article.statusDisabled = false;
          article.comment_status
            ? this.$message.success("开启该文章评论功能")
            : this.$message.error("关闭该文章评论功能");
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
.el-pagination {
  padding-top: 20px;
}
</style>