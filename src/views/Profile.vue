<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="我的信息" />
      <el-button type="text" size="small" @click="resetAdminInfo">
        重置信息
      </el-button>
    </div>
    <div class="profile">
      <div class="info">
        <div class="avatar">
          <div class="img">
            <el-image
              :src="
                admin.avatarFile?.fileUrl ||
                require('../assets/images/cabbage.jpg')
              "
              :preview-src-list="adminAvatar"
            >
              <div slot="error">
                <el-image :src="require('../assets/images/cabbage.jpg')" />
              </div>
            </el-image>
          </div>
          <el-upload
            ref="uploadAvatar"
            :action="baseUrl + 'admin/avatar'"
            name="file"
            :data="{
              adminId,
              dir: 'images',
            }"
            :headers="{
              token,
            }"
            :accept="uploadFileTypeLimits.image"
            :on-change="handleAvatarChange"
            :show-file-list="false"
            :on-success="uploadAvatarSuccess"
            style="width: 45%; margin-top: 5px"
          >
            <el-button type="primary" plain round size="mini"
              >更换头像</el-button
            >
          </el-upload>
        </div>
        <div class="common">
          <el-form
            ref="form"
            :model="admin"
            :rules="adminRules"
            label-width="auto"
          >
            <el-form-item label="账号:" prop="account">
              <el-input
                v-model="admin.account"
                size="small"
                maxlength="11"
                clearable
                placeholder="账号"
              />
            </el-form-item>
            <el-form-item label="登陆密码:" prop="password">
              <el-input
                v-model="admin.password"
                size="small"
                maxlength="17"
                clearable
                placeholder="密码"
              />
            </el-form-item>
            <el-form-item label="电话号码:" prop="telephone">
              <el-input
                v-model="admin.telephone"
                size="small"
                maxlength="11"
                clearable
                placeholder="电话号码"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="btns">
        <el-button type="primary" size="small" @click="editAdmin">
          更新信息
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      //当前管理员编号
      adminId: "",
      //管理员原来的账号(用于校验账号唯一性)
      originalAccount: "",
      //管理员表单
      admin: {
        account: "",
        password: "",
        telephone: "",
        avatarFileId: "",
        avatarFile: {},
      },
      //创建管理员表单验证规则
      adminRules: {
        account: [
          {
            required: true,
            message: "管理员登录账号不可为空",
            trigger: "blur",
          },
          { validator: this.adminAccountIsExist, trigger: "blur" },
        ],
        password: [
          {
            required: true,
            message: "管理员登录密码不可为空",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9]{9,17}$/,
            message: "长度在 9 到 17 个数字或者字母",
            trigger: ["blur", "change"],
          },
        ],
        telephone: [
          {
            required: true,
            message: "电话号码不可为空",
            trigger: "blur",
          },
          {
            required: true,
            pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
            message: "输入不符合电话号码格式",
            trigger: ["blur", "change"],
          },
        ],
        power: [
          {
            required: true,
            message: "管理员权限不可为空",
            trigger: ["blur", "change"],
          },
        ],
      },
      //预览大图头像
      adminAvatar: [],
    };
  },
  computed: {
    //默认后端访问地址
    baseUrl() {
      return this.$store.state.baseUrl;
    },
    //token
    token() {
      return JSON.parse(window.sessionStorage.getItem("token"));
    },
    //不同类型的可上传文件列表
    uploadFileTypeLimits() {
      return this.$store.state.uploadFileTypeLimits;
    },
  },
  methods: {
    //普通方式创建管理员
    editAdmin() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        const { data: editAdminRes } = await this.$axios.post(
          "admin/modify",
          this.admin
        );
        this.resetAdminInfo();
        this.$message({
          message: editAdminRes.msg,
          type: `${editAdminRes.code !== 200 ? "error" : "success"}`,
          center: true,
        });
      });
    },

    //重置管理员信息为原有信息
    resetAdminInfo() {
      this.$refs.form.resetFields();
      this.getAdminInfoById();
      this.$store.commit("setCurrentAdminInfo", this.admin);
    },

    //判断用户输入的账号是否已经存在，保证电话号码的唯一性
    async adminAccountIsExist(rule, value, callback) {
      if (this.originalAccount === this.admin.account) return;
      const { data: existRes } = await this.$axios.get(
        "admin/exist/" + this.admin.account
      );
      if (existRes.data) {
        callback(new Error("该账号已被注册"));
      }
    },

    //获取管理员信息
    async getAdminInfoById() {
      this.adminAvatar = [];
      this.adminId = this.$route.params.adminId;
      const { data: adminInfo } = await this.$axios.get(
        "admin/info/id/" + this.adminId
      );
      this.admin = adminInfo.data;
      this.originalAccount = adminInfo.data.account;
      this.adminAvatar.push(adminInfo.data.avatarFile?.fileUrl);
    },

    //文件/文件列表状态发生改变时触发的方法(管理员头像)
    handleAvatarChange(file) {
      //文件大小
      const size = file.size / 1024 / 1024 < 1;
      //文件类型
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const typeList = this.uploadFileTypeLimits.image;
      if (!typeList.includes(fileType)) {
        this.$message({
          message: "只可选择图片类型文件",
          center: true,
          type: "warning",
          showClose: true,
        });
        this.$refs.uploadAvatar.uploadFiles.pop();
        return;
      }
      if (!size) {
        this.$message({
          message: `文件大小不得超过1M 不符合的文件已被忽略`,
          center: true,
          type: "warning",
          showClose: true,
        });
        this.$refs.uploadAvatar.uploadFiles.pop();
        return;
      }
    },

    //管理员头像修改成功触发事件
    uploadAvatarSuccess(response) {
      this.$message({
        message: `${response.code !== 200 ? "头像更新失败" : "头像更新成功"}`,
        type: `${response.code !== 200 ? "error" : "success"}`,
        center: true,
        showClose: true,
      });
      this.getAdminInfoById();
    },
  },
  mounted() {
    this.getAdminInfoById();
  },
};
</script>

<style lang="less">
.profile {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .info {
    width: 100%;
    display: flex;
    flex-direction: row;
    .common {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 55%;
      height: auto;
      .el-form {
        width: 100%;
        margin-top: 10px;
      }
      .btns {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
    }
    .avatar {
      width: 30%;
      height: 100%;
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .el-upload {
        width: 100% !important;
        .el-button {
          width: 100%;
        }
      }
      .img {
        border-radius: 10px;
        overflow: hidden;
        height: 200px;
        width: 200px;
      }
    }
  }
}
</style>
