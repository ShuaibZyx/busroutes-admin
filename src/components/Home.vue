<template>
  <div class="home">
    <el-container>
      <el-aside width="auto">
        <Aside />
      </el-aside>
      <el-container>
        <el-header>
          <Head />
        </el-header>
        <div class="bread">
          <BreadCrumb />
          <div class="operation">
            <el-link
              type="primary"
              class="checklink"
              @click="$router.back()"
              style="margin-right: 15px"
              >返回</el-link
            >
            <div class="route">
              <el-tooltip effect="light" content="返回" placement="top">
                <i class="el-icon-arrow-left item" @click="$router.back()" />
              </el-tooltip>
              <el-tooltip effect="light" content="前进" placement="top">
                <i
                  class="el-icon-arrow-right item"
                  @click="$router.forward()"
                />
              </el-tooltip>
            </div>
          </div>
        </div>
        <el-main>
          <router-view />
        </el-main>
        <el-footer>
          <Foot />
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Head from "../components/Head.vue";
import Aside from "../components/Aside.vue";
import Foot from "../components/Foot.vue";
import BreadCrumb from "../components/BreadCrumb.vue";
export default {
  name: "Home",
  components: {
    Head,
    Aside,
    Foot,
    BreadCrumb,
  },
  computed: {
    breadList() {
      return this.$route.meta.breadList || [];
    },
  },
};
</script>

<style lang="less">
.home {
  height: 100%;
  .el-container {
    .el-header {
      padding: 0px;
      display: flex;
      align-items: center;
      height: 50px !important;
    }
    .el-main {
      border-bottom: 1px rgb(213, 211, 211) solid;
      padding: 5px;
    }
    .el-footer {
      padding: 5px;
      height: 5% !important;
    }
    height: 100%;
    .bread {
      border-bottom: 1px rgb(213, 211, 211) solid;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 5px;
      .el-breadcrumb {
        margin: 5px;
        width: 60%;
      }
      .operation {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;
        width: 38%;
        margin-right: 10px;
        .route {
          width: 55px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-right: 20px;
          .item {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
