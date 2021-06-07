<template>
  <div class="uploadCover" @click="showCoverSelect">
    <div class="coverWrap">
      <img class="coverImage" :src="value" ref="cover" />

      <el-dialog title="选择封面" :visible.sync="dialogVisible" append-to-body>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="素材库" name="first">
            <ImageList
              :isShowAdd="false"
              :isShowAction="false"
              :isShowCollet="false"
              ref="imageList"
              isShowSelected
            />
          </el-tab-pane>
          <el-tab-pane label="上传图片" name="second">
            <input type="file" @change="onFileChange" ref="file" />
            <br />
            <img src="" width="100" ref="previewImg" />
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { uploadImage } from "@/api/image";
import ImageList from "@/views/image/components/imagesList";
export default {
  name: "uploadCover",
  components: { ImageList },
  props: ["value"],
  data() {
    return {
      dialogVisible: false,
      activeName: "first",
    };
  },
  created() {},
  methods: {
    showCoverSelect() {
      this.dialogVisible = true;
    },
    onFileChange() {
      //获取文件对象
      const file = this.$refs.file.files[0];
      //图片预览
      const blob = window.URL.createObjectURL(file);
      this.$refs["previewImg"].src = blob;

      //防止用户选择同一个文件不触发change事件
      // this.$refs.file.value = "";
    },
    onCoverConfirm() {
      //如果tab是上传图片，并且input-file有选择的文件，才执行上传图片的操作
      if (this.activeName === "second") {
        const file = this.$refs.file.files[0];
        if (!file) {
          this.$message.error("请选择文件");
          return;
        }
        //执行上传文件的操作
        const fd = new FormData();
        fd.append("image", file);
        uploadImage(fd).then((res) => {
          this.$refs.cover.src = res.data.data.url;
          this.dialogVisible = false;
          //将图片地址发送给父组件
          this.$emit("input", res.data.data.url);
        });
      } else if (this.activeName === "first") {
        //父组件可以直接访问子组件中的数据
        const imageList = this.$refs.imageList;
        const selected = imageList.selected;
        if (selected === null) {
          this.$message("请选择封面图片");
          return;
        }
        this.dialogVisible = false;
        this.$emit("input", imageList.images[selected].url);
      }
    },
  },
};
</script>

<style scoped lang='less'>
.coverWrap {
  width: 150px;
  height: 120px;
  border: 1px solid #000;
  .coverImage {
    max-width: 100%;
    height: 120px;
  }
}
</style>