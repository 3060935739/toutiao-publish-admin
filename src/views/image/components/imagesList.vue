<template>
  <div class="imageList">
    <div class="actionHead">
      <el-radio-group
        v-model="collect"
        size="mini"
        class="radio-button"
        @change="loadImages(1)"
      >
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true" v-if="isShowCollet"
          >收藏</el-radio-button
        >
      </el-radio-group>
      <el-button
        v-if="isShowAdd"
        type="success"
        size="mini"
        @click="dialogUploadVisible = true"
        >上传素材</el-button
      >
    </div>

    <!-- 图片展示区域 -->
    <el-row :gutter="20" style="padding: 20px">
      <el-col
        :xs="12"
        :sm="8"
        :md="6"
        :lg="6"
        v-for="(img, index) in images"
        :key="index"
        class="image-item"
        @click.native="selected = index"
      >
        <el-image
          style="height: 150px"
          :src="img.url"
          fit="cover"
          class="img"
        ></el-image>
        <!-- 素材选择对勾效果 -->
        <div class="selected" v-if="isShowSelected && selected === index"></div>
        <div class="imageAction" v-if="isShowAction">
          <el-button
            type="warning"
            :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            circle
            size="mini"
            @click="onCollect(img)"
            :loading="img.loading"
            class="star"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            :loading="img.loading"
            @click="onDelete(img)"
          ></el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="pageSize"
      :current-page.sync="page"
      @current-change="onPageChange"
    >
    </el-pagination>
    <!-- 上传素材弹出层 -->
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      width="21%"
      :append-to-body="true"
    >
      <el-upload
        v-if="dialogUploadVisible"
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :on-success="onUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from "@/api/image";
export default {
  name: "ImageList",
  components: {},
  props: {
    isShowAdd: {
      type: Boolean,
      default: true,
    },
    isShowAction: {
      type: Boolean,
      default: true,
    },
    isShowCollet: {
      type: Boolean,
      default: true,
    },
    isShowSelected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return {
      collect: false,
      images: [],
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      totalCount: 0,
      pageSize: 12,
      page: 1,
      selected: null,
    };
  },
  created() {
    this.loadImages();
  },
  methods: {
    loadImages(page = 1) {
      this.page = page;
      getImages({ collect: this.collect, page, per_page: this.pageSize }).then(
        (res) => {
          const results = res.data.data.results;
          results.forEach((img) => {
            img.loading = false;
          });
          this.images = results;
          this.totalCount = res.data.data.total_count;
        }
      );
    },
    onUploadSuccess() {
      this.dialogUploadVisible = false;
      this.loadImages(this.page);
    },
    onPageChange(page) {
      this.loadImages(page);
    },
    onCollect(img) {
      img.loading = true;
      collectImage(img.id, !img.is_collected).then((res) => {
        img.is_collected = !img.is_collected;
        img.loading = false;
      });
    },
    onDelete(img) {
      img.loading = true;
      deleteImage(img.id).then((res) => {
        this.loadImages(this.page);
        img.loading = false;
      });
    },
  },
};
</script>

<style scoped lang="less">
.actionHead {
  display: flex;
  justify-content: space-between;
}
.img {
  border: 1px solid #ccc;
  margin: 1px;
}
.image-item {
  position: relative;
}
.imageAction {
  height: 40px;
  background-color: rgba(204, 204, 204, 0.5);
  position: absolute;
  bottom: 4px;
  left: 12px;
  right: 12px;
  font-size: 25px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #fff;
}
.el-icon-star-on {
  color: red;
}
.star {
  font-size: 16px;
}
.selected {
  background: url(./selected.png) no-repeat;
  background-size: cover;
  position: absolute;
  left: 0;
  right: 0;
  top: -35px;
  bottom: 0;
  justify-content: center;
  align-items: center;
}
</style>