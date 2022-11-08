<template>
  <div class="userDetail">
    <el-page-header @back="$router.back()" content="用户详情" />
    <div class="common">
      <el-descriptions
        title="用户详细信息"
        direction="vertical"
        :column="2"
        border
        style="margin-top: 20px"
      >
        <el-descriptions-item label="用户编号">{{
          user.userId
        }}</el-descriptions-item>
        <el-descriptions-item label="创建时间"
          >{{ user.createTime | dateFormat }} (信息于{{
            user.updateTime | dateFormat
          }}更新)</el-descriptions-item
        >
        <el-descriptions-item label="用户昵称"
          >{{ user.nickname }} ({{
            user.gender | genderFormat
          }})</el-descriptions-item
        >
        <el-descriptions-item label="联系电话">{{
          user.telephone
        }}</el-descriptions-item>

        <el-descriptions-item v-if="user.cityCode !== ''" label="用户地址">
          {{ user.cityCode | cityFormat }}
        </el-descriptions-item>
        <el-descriptions-item v-else label="用户地址">
          <span>未知</span>
        </el-descriptions-item>
        <el-descriptions-item label="出生日期">
          {{ user.birthday | dateFormat }} ({{ user.age }}岁)
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ user.email || "未知" }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="btns">
        <el-button type="info" size="small" @click="$router.back()">
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserDetail",
  data() {
    return {
      user: {},
    };
  },
  computed: {
    userId() {
      return this.$route.params.userId;
    },
  },
  methods: {
    async getUserInfoById() {
      const { data: userRes } = await this.$axios.get(
        "user/info/" + this.userId
      );
      this.user = userRes.data;
    },
  },
  mounted() {
    this.getUserInfoById();
  },
};
</script>

<style lang="less">
.userDetail {
  width: 99%;
  height: auto;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .common {
    width: 70%;
    height: auto;
    .el-form {
      margin-top: 10px;
    }
    .btns {
      margin-top: 15px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
