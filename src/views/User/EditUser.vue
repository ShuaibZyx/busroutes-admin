<template>
  <div class="editUser">
    <el-page-header @back="$router.back()" content="更新用户信息" />
    <div class="common">
      <div class="title">
        <span>请输入新的用户信息:</span>
        <el-button type="primary" size="small" @click="modifyUserPassword">
          修改用户登录密码
        </el-button>
      </div>
      <el-form ref="form" :model="user" :rules="userRules" label-width="auto">
        <el-form-item label="用户昵称:" prop="nickname">
          <el-input
            v-model="user.nickname"
            size="small"
            maxlength="20"
            clearable
            placeholder="用户昵称"
          />
        </el-form-item>
        <el-form-item label="用户性别:" prop="gender">
          <el-radio-group v-model="user.gender">
            <el-radio :label="0"><i class="el-icon-male"> 男</i></el-radio>
            <el-radio :label="1"><i class="el-icon-female"> 女</i></el-radio>
            <el-radio :label="2"
              ><i class="el-icon-question"> 未知</i></el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户地址:" prop="cityCode">
          <el-cascader
            style="width: 100%"
            v-model="user.cityCode"
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
            v-model="user.birthday"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            size="small"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="用户邮箱:" prop="email">
          <el-input
            v-model="user.email"
            type="email"
            size="small"
            clearable
            placeholder="邮箱"
          />
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="info" size="small" @click="resetUserInfo">
          重置
        </el-button>
        <el-button type="primary" size="small" @click="editUser">
          更新
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import citys from "../../assets/js/citys";
export default {
  name: "EditUser",
  data() {
    return {
      //管理员表单
      user: {
        telephone: "",
        nickname: "",
        telephone: "",
        gender: 0,
        age: 0,
        birthday: "",
        cityCode: "",
        email: "",
      },
      //创建管理员表单验证规则
      userRules: {
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
        nickname: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/,
            message: "长度在 1 到 20 个数字或者字母",
            trigger: ["blur", "change"],
          },
        ],
        gender: [
          { required: true, message: "请选择用户性别", trigger: "blur" },
        ],
        cityCode: [
          { required: true, message: "请选择用户地址", trigger: "blur" },
        ],
        email: [
          {
            required: false,
            type: "email",
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
            message: "邮箱格式不符",
            trigger: "blur",
          },
        ],
      },
      //城市列表
      citys,
    };
  },
  computed: {
    userAge() {
      return this.$moment().diff(this.user.birthday.substring(0, 4), "years");
    },
    userId() {
      return this.$route.params.userId;
    },
  },
  methods: {
    //获取用户信息
    async getUserInfoById() {
      const { data: userRes } = await this.$axios.get(
        "user/info/" + this.userId
      );
      userRes.data.cityCode = userRes.data.cityCode.split("-");
      this.user = userRes.data;
    },

    //重置用户原有信息
    resetUserInfo() {
      this.$refs.form.resetFields();
      this.getUserInfoById();
    },

    //普通方式创建用户
    editUser() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.user.age = this.userAge;
        this.user.cityCode = this.user.cityCode?.join("-");
        const { data: editUserRes } = await this.$axios.post(
          "user/modify",
          this.user
        );
        this.resetUserInfo();
        this.$message({
          message: editUserRes.msg,
          type: `${editUserRes.code !== 200 ? "error" : "success"}`,
          center: true,
        });
      });
    },

    //修改用户登录密码
    modifyUserPassword() {
      this.$prompt("请输入新的登陆密码", "修改登录密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[a-zA-Z0-9]{9,17}$/,
        inputErrorMessage: "登陆密码应为9-17位数字或字母",
        center: true,
        closeOnClickModal: false,
        inputPlaceholder: "请输入登陆密码",
      })
        .then(async ({ value }) => {
          const { data: createUserFastRes } = await this.$axios.post(
            "user/create/fast",
            {
              account: value,
            }
          );
          this.$message({
            center: true,
            message: createUserFastRes.msg,
            type: `${createUserFastRes.code !== 200 ? "error" : "success"}`,
            duration: `${createUserFastRes.code !== 200 ? 1500 : 0}`,
            showClose: true,
          });
        })
        .catch(() => {});
    },
  },
  mounted() {
    this.getUserInfoById();
  },
};
</script>

<style lang="less">
.editUser {
  width: 99%;
  height: auto;
  padding: 5px;
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
