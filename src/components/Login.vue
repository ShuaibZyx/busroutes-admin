<template>
  <div class="login_container">
    <div class="login_bg" />
    <!--github小猫咪-->
    <a
      href="https://github.com/ShuaibZyx/busroutes-admin"
      class="github-corner"
      target="_blank"
      title="Follow me on GitHub"
      aria-label="Follow me on GitHub"
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 250 250"
        style="
          fill: black;
          color: #fff;
          position: absolute;
          top: 0;
          border: 0;
          right: 0;
        "
        aria-hidden="true"
      >
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
        <path
          d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
          fill="currentColor"
          style="transform-origin: 130px 106px"
          class="octo-arm"
        />
        <path
          d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
          fill="currentColor"
          class="octo-body"
        />
      </svg>
    </a>

    <!-- 图形验证码 -->
    <Vcode
      :show="isShowValid"
      @success="success"
      @close="close"
      :successText="validSuccessText"
    />

    <!-- 登录表单盒子 -->
    <div class="login_box">
      <div class="form">
        <div class="title">
          <span> 公交线路管理系统 </span>
        </div>
        <!-- 登录 -->
        <el-form
          status-icon
          :model="loginForm"
          :rules="loginFormRules"
          ref="loginFormRef"
          :hide-required-asterisk="true"
        >
          <el-form-item prop="account">
            <el-input
              v-model="loginForm.account"
              autocomplete="off"
              prefix-icon="el-icon-user"
              size="medium"
              clearable
              placeholder="请输入管理员账号"
              :maxlength="11"
              @keyup.enter.native="showValid"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              prefix-icon="el-icon-lock"
              autocomplete="off"
              clearable
              validate-event
              size="medium"
              placeholder="请输入您的密码"
              :maxlength="17"
              :show-password="true"
              @keyup.enter.native="showValid"
            />
          </el-form-item>
          <el-form-item>
            <div class="login-btn">
              <el-button
                type="primary"
                size="medium"
                round
                plain
                icon="el-icon-check"
                style="width: 95%"
                @click="showValid"
                >登录</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="btns">
        <el-checkbox v-model="autoLogin">7天免登录</el-checkbox>
      </div>
      <div class="context">
        <div class="right">
          <span>本网站仅供学习交流使用</span>
          <span>如有疑问请联系: 2631667689(QQ)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import Vcode from "vue-puzzle-vcode";
export default {
  name: "Login",
  components: {
    Vcode,
  },
  data() {
    return {
      //登录表单
      loginForm: {
        account: "",
        password: "",
      },
      //登陆验证规则
      loginFormRules: {
        // 验证用户名是否合法
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
        ],
      },
      // 图形验证码模态框是否出现
      isShowValid: false,
      //7天免登录
      autoLogin: true,
      //滑块验证成功时显示的文字
      validSuccessText: "你太棒了",
    };
  },
  methods: {
    //登录所用方法
    loginByPassword() {
      //首先进行数据预验证
      this.$refs.loginFormRef.validate(async (valid) => {
        //验证不通过直接返回
        if (!valid) return;
        //登录权限有效时间
        var expire = this.autoLogin ? 60 * 60 * 24 * 7 : 2 * 60 * 60;
        //发起登录请求
        const { data: loginRes } = await this.$axios.post("admin/login", {
          account: this.loginForm.account,
          password: this.loginForm.password,
          expire,
        });
        if (loginRes.code === 200) {
          //将返回的token存入session
          const token = loginRes.data.token;
          window.sessionStorage.setItem("admin_token", JSON.stringify(token));
          //将token值存入cookie用户实现7天免登录
          if (this.autoLogin)
            this.$cookies.set("admin_token", JSON.stringify(token), "7d");
          //跳转路由
          this.$router.push("/home");
        }
        //提示用户登录状态
        this.$message({
          message: loginRes.msg,
          type: `${loginRes.code !== 200 ? "error" : "success"}`,
          center: true,
        });
      });
    },

    //展示滑块所用方法
    showValid() {
      this.$refs.loginFormRef.validate((valid) => {
        //验证不通过直接返回
        if (!valid) return;
        this.isShowValid = true;
      });
    },

    // 用户验证码通过了验证
    success(time) {
      this.validSuccessText = `只用了${parseInt(time)}秒 你太快了`;
      this.loginByPassword();
      // 通过验证后，需要手动隐藏模态框
      this.isShowValid = false;
    },

    // 用户点击遮罩层，应该关闭模态框
    close() {
      this.isShowValid = false;
    },
  },
  mounted() {
    const token = JSON.parse(this.$cookies.get("admin_token"));
    if (token) {
      window.sessionStorage.setItem("admin_token", JSON.stringify(token));
      this.$router.push("/home");
    }
  },
};
</script>
