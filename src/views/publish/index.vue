<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? "修改文章" : "发布文章"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑导航 -->
      </div>

      <!--  -->
      <el-form
        ref="publishForm"
        :model="article"
        :rules="formRules"
        label-width="60px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            lang="zh"
            height="500"
            placeholder="Write something …"
          />
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 封装组件 -->
          <!-- 如果在事件处理函数自定义传参以后还想得到原来的那个事件本身的参数，则手动指定$event -->
          <template v-if="article.cover.type > 0">
            <uploadCover
              v-for="(cover, index) in article.cover.type"
              :key="cover"
              v-model="article.cover.images[index]"
            />
          </template>
          <!-- /封装组件 -->
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <!-- <el-option label="全部" :value="null"></el-option> -->
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发布</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import uploadCover from "./components/uploadCover.vue";
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle,
} from "@/api/article";

import { uploadImage } from "@/api/image";

import "element-tiptap/lib/index.css";
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Image,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  TextAlign,
  Indent,
  LineHeight,
  HorizontalRule,
  HardBreak,
  TrailingNode,
  History,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  FormatClear,
  TextColor,
  TextHighlight,
  Preview,
  Print,
  Fullscreen,
  SelectAll,
  FontType,
  FontSize,
} from "element-tiptap";

export default {
  name: "PublishIndex",
  components: {
    "el-tiptap": ElementTiptap,
    uploadCover,
  },
  data() {
    return {
      channels: [], //文章频道列表
      article: {
        title: "",
        content: "",
        cover: {
          type: 1, // 封面类型 -1-自动 0-无图 1-一张 3-3张
          images: [], // 图片地址
        },
        channel_id: null,
      },
      // 编辑器的 extensions
      // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮\
        new Image({
          // 默认会把图片生成base64字符串和内容储存在一起，如果需要自定义图片上传
          uploadRequest(file) {
            const fd = new FormData();
            fd.append("image", file);
            return uploadImage(fd).then((res) => {
              return res.data.data.url;
            });
          },
        }),
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new TextAlign(),
        new Indent(),
        new LineHeight(),
        new HorizontalRule(),
        new HardBreak(),
        new TrailingNode(),
        new History(),
        new Table(),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new FormatClear(),
        new TextColor(),
        new TextHighlight(),
        new Preview(),
        new Print(),
        new Fullscreen(),
        new SelectAll(),
        new FontType(),
        new FontSize(),
      ],
      formRules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 5,
            max: 30,
            message: "标题字数为：5~30个字符",
            trigger: "blur",
          },
        ],
        content: [
          {
            validator(rule, value, callback) {
              if (value === "<p></p>") {
                callback(new Error("请输入文章内容"));
              } else {
                callback();
              }
            },
          },
          { required: true, message: "请输入文章内容" },
        ],
        channel_id: [{ required: true, message: "请选择频道" }],
      },
    };
  },
  created() {
    this.loadChannels();
    // 由于发布和修改使用同一个组件
    // 所以这里要判断
    // 如果路由路径参数中有id,则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle();
    }
  },
  methods: {
    loadChannels() {
      getArticleChannels().then((res) => {
        this.channels = res.data.data.channels;
      });
    },
    onPublish(draft = false) {
      this.$refs.publishForm.validate((valid) => {
        if (!valid) {
          return this.$message.error("请确认格式是否输入正确");
        }
        const articleId = this.$route.query.id;
        if (articleId) {
          updateArticle(articleId, this.article, draft).then((res) => {
            draft
              ? this.$message.success("存入草稿成功")
              : this.$message.success("修改成功");
          });
          this.$router.push("./article");
        } else {
          addArticle(this.article, draft).then((res) => {
            draft
              ? this.$message.success("存入草稿成功")
              : this.$message.success("发布成功");
          });
          this.$router.push("./article");
        }
      });
    },
    // 修改文章：加载文章内容
    loadArticle() {
      getArticle(this.$route.query.id).then((res) => {
        this.article = res.data.data;
      });
    },
    onUpdateCover(index, url) {
      this.article.cover.images[index] = url;
    },
  },
};
</script>

<style lang="less" scoped>
</style>