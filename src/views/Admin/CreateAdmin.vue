<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="创建管理员" />
      <el-button type="primary" size="small" @click="createAdminFast">
        快速添加
      </el-button>
    </div>
    <div class="createAdmin">
      <div class="common">
        <div class="title">
          <span>请输入管理员信息:</span>
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
          <el-button type="info" size="small" @click="$refs.form.resetFields()">
            重置
          </el-button>
          <el-button type="primary" size="small" @click="createAdmin">
            创建
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "CreateAdmin",
  data() {
    return {
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
      ],
    };
  },
  methods: {
    //普通方式创建管理员
    createAdmin() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        const { data: createAdminRes } = await this.$axios.post(
          "admin/create",
          this.admin
        );
        this.$refs.form.resetFields();
        this.$message({
          message: createAdminRes.msg,
          type: `${createAdminRes.code !== 200 ? "error" : "success"}`,
          center: true,
        });
      });
    },

    //快速创建管理员
    createAdminFast() {
      this.$prompt("请输入电话号码", "快速添加", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern:
          /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
        inputErrorMessage: "电话号码格式不正确",
        center: true,
        closeOnClickModal: false,
        inputPlaceholder: "请输入管理员联系电话",
      })
        .then(async ({ value }) => {
          const { data: createAdminFastRes } = await this.$axios.post(
            "admin/create/fast",
            {
              telephone: value,
            }
          );
          this.$message({
            center: true,
            message: createAdminFastRes.msg,
            type: `${createAdminFastRes.code !== 200 ? "error" : "success"}`,
            duration: 0,
            showClose: true,
          });
        })
        .catch(() => {});
    },

    //判断用户输入的账号是否已经存在，保证电话号码的唯一性
    async adminAccountIsExist(rule, value, callback) {
      const { data: existRes } = await this.$axios.get(
        "admin/exist/" + this.admin.account
      );
      if (existRes.data) {
        callback(new Error("该账号已被注册"));
      }
    },
  },
};
</script>

<style lang="less">
.createAdmin {
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
