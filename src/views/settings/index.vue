<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑导航 -->
      </div>
      <el-row>
        <el-col :span="15">
          <el-form
            :rules="formRules"
            ref="ruleForm"
            :model="user"
            label-width="90px"
          >
            <el-form-item label="编号:"> {{ user.id }} </el-form-item>
            <el-form-item label="手机:"> {{ user.mobile }}</el-form-item>
            <el-form-item label="媒体名称:" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍:" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="editUserLoading"
                @click="editProfile(user)"
                >保存设置</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="3" :span="6">
          <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
          <label for="file"
            ><el-avatar
              shape="square"
              :size="150"
              fit="cover"
              :src="user.photo"
            ></el-avatar>
            <p>点击修改头像</p></label
          >
          <input
            id="file"
            type="file"
            hidden
            ref="file"
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      width="40%"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <div class="previewImageWrap">
        <img :src="previewImage" class="previewImage" ref="previewImage" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPhoto" :loading="editPhotoLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { getUserProfile, updateUser, editUserPhoto } from "@/api/user";
import globalBus from "@/utils/global-bus";

export default {
  name: "SettingsIndex",
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      //用户资料
      user: {
        email: "",
        id: null,
        intro: "",
        mobile: "",
        name: "",
        photo: "",
      },
      formRules: {
        name: [
          { required: true, message: "请输入媒体名称", trigger: "blur" },
          { min: 1, max: 7, message: "名称长度1-7字", trigger: "blur" },
        ],
        intro: [{ required: true, message: "请输入媒体介绍", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
            message: "请输入正确的邮箱",
            trigger: "blur",
          },
        ],
      },
      dialogVisible: false,
      //预览图片
      previewImage: "",
      //裁切器实例
      cropper: null,
      //更新用户头像loading状态
      editPhotoLoading: false,
      editUserLoading: false,
    };
  },
  created() {
    this.loadUser();
  },
  methods: {
    //修改用户资料
    editProfile() {
      this.editUserLoading = true;
      updateUser({
        name: this.user.name,
        intro: this.user.intro,
        email: this.user.email,
      }).then((res) => {
        this.loadUser();
        this.$message.success("修改成功");
        this.editUserLoading = false;
        //发布通知，用户信息已经修改
        globalBus.$emit("updataUser", this.user);
      });
    },
    //获取用户资料
    loadUser() {
      getUserProfile().then((res) => {
        this.user = res.data.data;
      });
    },
    onFileChange() {
      const file = this.$refs.file;
      const blobData = window.URL.createObjectURL(file.files[0]);
      this.previewImage = blobData;
      this.dialogVisible = true;
      //解决相同文件不触发change
      file.value = "";
    },
    //弹出层彻底打开触发，此时裁切器才能生效
    onDialogOpened() {
      //获取图片DOM节点
      const image = this.$refs.previewImage;
      //第一次初始化好以后，如果预览裁切的图片发生了变化，裁切器默认不会更新。
      //如果预览图片发生变化更新裁切器 裁切器.replace或者销毁这个裁切器，重新初始化
      //初始化裁切器
      if (this.cropper) {
        this.cropper.replace(this.previewImage);
        return;
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: null,
      });
    },
    //弹出层彻底关闭触发
    onDialogClosed() {
      this.cropper.destroy();
    },
    editPhoto() {
      this.editPhotoLoading = true;
      this.cropper.getCroppedCanvas().toBlob((file) => {
        const fd = new FormData();
        fd.append("photo", file);
        editUserPhoto(fd).then((res) => {
          this.dialogVisible = false;
          this.user.photo=window.URL.createObjectURL(file)
          this.editPhotoLoading = false;
          //发布通知，用户信息已经修改
          globalBus.$emit("updataUser", this.user);
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
p {
  margin-left: 25px;
}
.previewImageWrap {
  .previewImage {
    display: block;
    /* This rule is very important, please don't ignore this */
    max-width: 100%;
    height: 200px;
  }
}
</style>