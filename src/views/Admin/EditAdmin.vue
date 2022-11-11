<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="更新管理员信息" />
      <el-button size="mini" type="primary" @click="resetAdminPassword"
        >重置密码</el-button
      >
    </div>
    <div class="editAdmin">
      <div class="common">
        <div class="title">
          <span>请输入新的管理员信息:</span>
        </div>
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
          <el-form-item label="系统权限:" prop="power">
            <el-select
              v-model="admin.power"
              filterable
              size="small"
              clearable
              placeholder="分配权限"
              style="width: 100%"
            >
              <el-option
                v-for="item in adminPower"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button type="info" size="small" @click="resetAdminInfo">
            重置
          </el-button>
          <el-button type="primary" size="small" @click="editAdmin">
            更新
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "EditAdmin",
  data() {
    return {
      //当前管理员编号
      adminId: "",
      //管理员表单
      admin: {
        account: "",
        password: "",
        power: 1,
        telephone: "",
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
      ///可供选择的权限角色列表
      adminPower: [
        { label: "管理员", value: 2 },
        { label: "业务员", value: 1 },
        { label: "无权限", value: 0 },
      ],
    };
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
    },

    //判断用户输入的账号是否已经存在，保证电话号码的唯一性
    async adminAccountIsExist(rule, value, callback) {
      if (this.originalAdmin.account === this.admin.account) return;
      const { data: existRes } = await this.$axios.get(
        "admin/exist/" + this.admin.account
      );
      if (existRes.data) {
        callback(new Error("该账号已被注册"));
      }
    },

    //获取管理员信息
    async getAdminInfoById() {
      this.adminId = this.$route.params.adminId;
      const { data: adminInfo } = await this.$axios.get(
        "admin/info/id/" + this.adminId
      );
      this.admin = adminInfo.data;
    },

    //重置管理员密码
    async resetAdminPassword() {
      const { data: resetRes } = await this.$axios.put(
        "admin/reset/password/" + this.adminId
      );
      this.$message({
        message: resetRes.msg,
        type: `${resetRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },
  },
  mounted() {
    this.getAdminInfoById();
  },
};
</script>

<style lang="less">
.editAdmin {
  display: flex;
  flex-direction: column;
  align-items: center;
  .common {
    width: 50%;
    height: auto;
    .el-form {
      margin-top: 10px;
    }
    .title {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 1em;
      margin-top: 10px;
    }
    .btns {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
