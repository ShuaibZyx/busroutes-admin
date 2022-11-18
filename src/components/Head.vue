<template>
  <div class="head">
    <div class="title">
      <span class="info">
        <el-tooltip
          effect="light"
          content="折叠"
          :enterable="false"
          v-if="!$store.state.iscollapse"
        >
          <i
            class="el-icon-s-fold flold"
            style="margin-right: 5px"
            @click="$store.commit('setIscollapse', true)"
          />
        </el-tooltip>
        <el-tooltip effect="light" content="展开" :enterable="false" v-else>
          <i
            class="el-icon-s-unfold flold"
            style="margin-right: 5px"
            @click="$store.commit('setIscollapse', false)"
          />
        </el-tooltip>
        <div class="text">
          <span>欢迎进入公交线路后台管理系统</span>
          <div>
            <span>当前角色-</span>
            <span style="color: orange"
              >{{ adminInfo.power | powerFormat }}
            </span>
          </div>
        </div>
      </span>
    </div>
    <div class="operation">
      <div class="admin">
        <span style="margin-right: 10px">{{ adminInfo.telephone }}</span>
        <el-dropdown>
          <el-avatar size="medium" style="cursor: pointer">
            <el-image
              :src="
                adminInfo.avatarFile
                  ? adminInfo.avatarFile?.fileUrl
                  : require('../assets/icons/women.png')
              "
            />
          </el-avatar>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="!$route.path.includes('/profile')">
              <span @click="$router.push('/profile/' + adminInfo.adminId)"
                >我的信息</span
              >
            </el-dropdown-item>
            <el-dropdown-item v-if="$route.path !== '/index'">
              <span @click="$router.push('/index')">返回主页</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="btns">
        <el-select
          v-model="functionName"
          size="medium"
          slot="prepend"
          style="width: 100%"
          clearable
          filterable
          :default-first-option="true"
          placeholder="请选择功能"
          @change="handleSelectMenu"
          v-if="adminInfo.power === 3"
        >
          <el-option
            :label="menu.label"
            :value="menu.value"
            v-for="(menu, index) in menuSelect"
            :key="index"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Head",
  data() {
    return {
      functionName: "",
      //可以选择的功能数组
      menuSelect: [
        {
          label: "用户",
          value: "/user",
        },
        {
          label: "公交",
          value: "/bus",
        },
        {
          label: "站点",
          value: "/station",
        },
        {
          label: "线路",
          value: "/busroute",
        },
        {
          label: "留言",
          value: "/issue",
        },
        {
          label: "公告",
          value: "/notice",
        },
      ],
      //当前管理员对象
      adminInfo: {},
    };
  },
  methods: {
    //获取当前登录的管理员信息
    async getAdminInfoByToken() {
      const token = JSON.parse(window.sessionStorage.getItem("admin_token"));
      const { data: adminInfoRes } = await this.$axios.get(
        "admin/info/token/" + token
      );
      this.adminInfo = adminInfoRes.data;
      this.$store.commit("setCurrentAdminInfo", this.adminInfo);
    },

    //退出登录
    logout() {
      window.sessionStorage.removeItem("admin_token");
      this.$cookies.remove("admin_token");
      this.$router.push("/login");
      this.$message({
        message: "已退出登录",
        type: "success",
        center: true,
        showClose: true,
      });
    },

    //选中菜单栏的方法
    handleSelectMenu(path) {
      this.$router.push(`${path}`);
    },
  },
  created() {
    this.getAdminInfoByToken();
  },
};
</script>

<style lang="less">
.head {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background-color: rgb(220, 228, 221);
  .title {
    width: 35%;
    .info {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .flold:hover {
        cursor: pointer;
        font-size: larger;
      }
      .text {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .operation {
    width: 60%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    .admin {
      margin-right: 2%;
      min-width: 20%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    .btns {
      min-width: 30%;
    }
  }
}
</style>
