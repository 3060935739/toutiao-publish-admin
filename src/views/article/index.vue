<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑导航 -->
      </div>
      <el-form v-loading="loading" ref="form" :model="form" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio>全部 </el-radio>
            <el-radio label="0">草稿 </el-radio>
            <el-radio label="1">待审核 </el-radio>
            <el-radio label="2">审核通过</el-radio>
            <el-radio label="3">审核失败</el-radio>
            <el-radio label="4">已删除 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="loadArticles(1)"
            :disabled="loading"
          >
            查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 筛选区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选共查询到{{ totalCount }}条结果：
      </div>
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        size="mini"
        v-loading="loading"
      >
        <el-table-column prop="" label="封面">
          <template slot-scope="scope">
            <!-- <img
              v-if="scope.row.cover.images[0]"
              class="article-cover"
              :src="scope.row.cover.images[0]"
              alt=""
            />
            <img v-else class="article-cover" src="./no-cover.png" alt="" /> -->
            <el-image
              class="article-cover"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
            <!-- <el-tag type="info" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 2"
              >审核通过</el-tag
            >
            <el-tag type="warning" v-else-if="scope.row.status === 3"
              >审核失败</el-tag
            >
            <el-tag type="danger" v-else>已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="$router.push('./publish?id=' + scope.row.id.toString())"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        layout="prev, pager, next"
        :total="totalCount"
        background
        @current-change="onCurrentChange"
        :page-size="pageSize"
        :disabled="loading"
        :current-page.sync="page"
      />
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from "@/api/article";

export default {
  name: "ArticleIndex",
  data() {
    return {
      form: {
        data1: "",
      },
      // 文字数据列表
      articles: [],
      articleStatus: [
        { status: 0, text: "草稿", type: "info" },
        { status: 1, text: "待审核", type: "" },
        { status: 2, text: "审核通过", type: "success" },
        { status: 3, text: "审核失败", type: "warning" },
        { status: 4, text: "已删除", type: "danger" },
      ],
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页条数
      status: null, // 查询文章的状态，不传就是全部
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的频道
      rangeDate: null, // 筛选的范围日期
      loading: true,
      page: 1, //当前页码
    };
  },
  created() {
    this.loadArticles();
    this.loadChannels();
  },
  methods: {
    loadArticles(page = 1) {
      this.loading = true;
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null,
      }).then((res) => {
        const { results, total_count: totalCount } = res.data.data;
        this.articles = results;
        this.totalCount = totalCount;
        this.loading = false;
      });
    },
    loadChannels() {
      getArticleChannels().then((res) => {
        this.channels = res.data.data.channels;
      });
    },
    onCurrentChange(page) {
      this.loadArticles(page);
    },
    //删除文章
    onDeleteArticle(articleId) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteArticle(articleId.toString()).then((res) => {
            this.$message.success("删除成功");
            this.loadArticles(this.page);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 20px;
}
.filter-card {
  margin-bottom: 30px;
}
.article-cover {
  width: 60px;
  height: 60px;
  // background-size: cover;
}
.image-slot {
  text-align: center;
}
</style>