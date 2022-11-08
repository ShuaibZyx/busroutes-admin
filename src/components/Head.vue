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
            <span style="color: orange">{{ adminInfo.power | powerFormat }} </span>
          </div>
        </div>
      </span>
    </div>
    <div class="operation">
      <div class="admin">
        <span style="margin-right: 10px">{{ adminInfo.telephone }}</span>
        <el-avatar
          size="medium"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        >
        </el-avatar>
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
        >
          <el-option
            :label="menu"
            :value="menu"
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
      role: "管理员",
      functionName: "",
      menuSelect: ["用户", "公交", "站点", "线路", "留言", "公告"],
      adminInfo: {},
    };
  },
  methods: {
    //获取当前登录的管理员信息
    async getAdminInfoByToken() {
      const token = JSON.parse(window.sessionStorage.getItem("token"));
      const { data: adminInfoRes } = await this.$axios.get(
        "admin/info/token/" + token
      );
      this.adminInfo = adminInfoRes.data;
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
