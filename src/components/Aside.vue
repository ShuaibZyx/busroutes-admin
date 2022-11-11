<template>
  <div class="aside">
    <div class="menu" :class="{ menucollapse: iscollapse }">
      <div class="logobox">
        <el-tooltip effect="light" content="不许点我!😒" :enterable="false">
          <img
            src="../assets/icons/bus-right.png"
            width="30%"
            @click="$router.push('/home')"
            style="cursor: pointer"
          />
        </el-tooltip>
      </div>
      <el-menu
        :default-active="$route.path.split('/')[0]"
        :default-openeds="['menu']"
        background-color="transparent"
        text-color="black"
        :collapse="iscollapse"
        active-text-color="#409EFF"
        :router="true"
      >
        <el-menu-item index="/index">
          <i class="el-icon-s-home"></i>
          <template slot="title">
            <span slot="title">首页</span>
          </template>
        </el-menu-item>
        <el-submenu index="menu">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">菜单</span>
          </template>
          <el-menu-item index="/admin" v-if="adminInfo.power === 3">
            <i class="el-icon-s-grid"></i>
            <span slot="title">管理员</span>
          </el-menu-item>
          <el-menu-item index="/user" v-if="adminInfo.power >= 2">
            <i class="el-icon-user"></i>
            <span slot="title">用户</span>
          </el-menu-item>
          <el-menu-item index="/bus" v-if="adminInfo.power >= 2">
            <i class="el-icon-truck"></i>
            <span slot="title"> 公交</span>
          </el-menu-item>
          <el-menu-item index="/station" v-if="adminInfo.power >= 2">
            <i class="el-icon-guide"></i>
            <span slot="title">站点</span>
          </el-menu-item>
          <el-menu-item index="/busroute" v-if="adminInfo.power >= 2">
            <i class="el-icon-document"></i>
            <span slot="title">线路</span>
          </el-menu-item>
          <el-menu-item index="/issue" v-if="adminInfo.power >= 1">
            <i class="el-icon-message"></i>
            <span slot="title">留言</span>
          </el-menu-item>
          <el-menu-item index="/notice" v-if="adminInfo.power === 3">
            <i class="el-icon-bell"></i>
            <span slot="title">公告</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <div class="ads"></div>
  </div>
</template>

<script>
export default {
  name: "Aside",
  computed: {
    //是否折叠
    iscollapse() {
      return this.$store.state.iscollapse;
    },
    //当前管理员信息
    adminInfo() {
      return this.$store.state.currentAdminInfo;
    },
  },
};
</script>

<style lang="less">
.aside {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .menu {
    width: 100%;
    height: auto;
    .el-submenu .el-menu-item {
      min-width: 0px !important;
      padding-left: 30px !important;
    }
    .logobox {
      background-color: rgb(220, 228, 221);
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
  .ads {
    width: 100%;
    height: auto;
  }
}
.menucollapse {
  width: 64px;
}
</style>
