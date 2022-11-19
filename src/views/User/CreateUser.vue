<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="创建用户" />
      <el-button type="primary" size="small" @click="createUserFast">
        快速添加
      </el-button>
    </div>
    <div class="createUser">
      <div class="common">
        <div class="title">
          <span>请输入用户信息:</span>
        </div>
        <el-form ref="form" :model="user" :rules="userRules" label-width="auto">
          <el-form-item label="登录账号:" prop="account">
            <el-input
              v-model="user.account"
              size="small"
              maxlength="11"
              clearable
              placeholder="账号"
            />
          </el-form-item>
          <el-form-item label="登陆密码:" prop="password">
            <el-input
              v-model="user.password"
              size="small"
              maxlength="17"
              clearable
              placeholder="密码"
            />
          </el-form-item>
          <el-form-item label="用户昵称:" prop="userInfo.nickname">
            <el-input
              v-model="user.userInfo.nickname"
              size="small"
              maxlength="20"
              clearable
              placeholder="用户昵称"
            />
          </el-form-item>
          <el-form-item label="用户性别:" prop="userInfo.gender">
            <el-radio-group v-model="user.userInfo.gender">
              <el-radio :label="0"><i class="el-icon-male"> 男</i></el-radio>
              <el-radio :label="1"><i class="el-icon-female"> 女</i></el-radio>
              <el-radio :label="2"
                ><i class="el-icon-question"> 未知</i></el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户地址:" prop="userInfo.cityCode">
            <el-cascader
              style="width: 100%"
              v-model="user.userInfo.cityCode"
              :options="citys"
              size="small"
              filterable
              clearable
              :props="{ expandTrigger: 'hover' }"
            />
          </el-form-item>
          <el-form-item label="出生日期:">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="user.userInfo.birthday"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="用户邮箱:" prop="userInfo.email">
            <el-input
              v-model="user.userInfo.email"
              type="email"
              size="small"
              clearable
              placeholder="邮箱"
            />
          </el-form-item>

          <el-form-item label="用户状态:" prop="available">
            <el-select
              v-model="user.available"
              filterable
              size="small"
              clearable
              placeholder="是否可用"
              style="width: 100%"
            >
              <el-option
                v-for="item in userAvailable"
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
          <el-button type="primary" size="small" @click="createUser">
            创建
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import citys from "../../assets/js/citys";
export default {
  name: "CreateUser",
  data() {
    return {
      //用户表单
      user: {
        account: "",
        password: "",
        available: 1,
        userInfo: {
          telephone: "",
          nickname: "",
          telephone: "",
          gender: 0,
          age: 0,
          birthday: "",
          cityCode: "",
          email: "",
        },
      },
      //创建用户表单验证规则
      userRules: {
        account: [
          {
            required: true,
            message: "用户登录账号不可为空",
            trigger: "blur",
          },
          {
            required: true,
            pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
            message: "输入不符合电话号码格式",
            trigger: "blur",
          },
          { validator: this.userAccountIsExist, trigger: "blur" },
        ],
        password: [
          {
            required: true,
            message: "用户登录密码不可为空",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9]{9,17}$/,
            message: "长度在 9 到 17 个数字或者字母",
            trigger: ["blur", "change"],
          },
        ],
        "userInfo.nickname": [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9-\u4e00-\u9fa5]{1,20}$/,
            message: "长度在 1 到 20 个数字,中文或者字母",
            trigger: ["blur", "change"],
          },
        ],
        "userInfo.gender": [
          { required: true, message: "请选择用户性别", trigger: "blur" },
        ],
        "userInfo.cityCode": [
          { required: true, message: "请选择用户地址", trigger: "blur" },
        ],
        "userInfo.email": [
          {
            required: false,
            type: "email",
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
            message: "邮箱格式不符",
            trigger: "blur",
          },
        ],
      },
      //可供选择的权限角色列表
      userAvailable: [
        { label: "可用", value: 1 },
        { label: "禁用", value: 0 },
      ],
      //城市列表
      citys,
    };
  },
  computed: {
    userAge() {
      return this.$moment().diff(
        this.user.userInfo.birthday.substring(0, 4),
        "years"
      );
    },
  },
  methods: {
    //普通方式创建用户
    createUser() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.user.userInfo.age = this.userAge;
        this.user.userInfo.cityCode = this.user.userInfo.cityCode?.join("-");
        this.user.userInfo.telephone = this.user.account;
        const { data: createUserRes } = await this.$axios.post(
          "user/create/common",
          this.user
        );
        this.$refs.form.resetFields();
        this.$message({
          message: createUserRes.msg,
          type: `${createUserRes.code !== 200 ? "error" : "success"}`,
          duration: 1000,
          center: true,
        });
      });
    },

    //快速创建用户
    createUserFast() {
      this.$prompt("请输入电话号码", "快速添加", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern:
          /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
        inputErrorMessage: "电话号码格式不正确",
        center: true,
        closeOnClickModal: false,
        inputPlaceholder: "请输入用户电话",
      })
        .then(async ({ value }) => {
          const { data: createuserFastRes } = await this.$axios.post(
            "user/create/fast",
            {
              account: value,
            }
          );
          this.$message({
            center: true,
            message: createuserFastRes.msg,
            type: `${createuserFastRes.code !== 200 ? "error" : "success"}`,
            duration: `${createuserFastRes.code !== 200 ? 0 : 1500}`,
            showClose: true,
          });
        })
        .catch(() => {});
    },

    //判断用户输入的账号是否已经存在，保证电话号码的唯一性
    async userAccountIsExist(rule, value, callback) {
      const { data: existRes } = await this.$axios.get(
        "user/register/exist/" + this.user.account
      );
      if (existRes.data) {
        callback(new Error("该账号已被注册"));
      }
    },
  },
};
</script>

<style lang="less">
.createUser {
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
