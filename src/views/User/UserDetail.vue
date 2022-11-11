<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="用户详情" />
    </div>
    <div class="userDetail">
      <div class="common">
        <el-descriptions
          title="用户详细信息"
          direction="vertical"
          :column="2"
          border
          style="margin-top: 20px"
        >
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-zoom-out" />
              用户编号
            </template>
            {{ user.userId }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-date" />
              创建时间
            </template>
            {{ user.createTime | dateFormat }}
            (信息于{{ user.updateTime | dateFormat }}更新)
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user" />
              用户昵称
            </template>
            {{ user.nickname }}
            ({{ user.gender | genderFormat }})
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-phone-outline" />
              联系电话
            </template>
            {{ user.telephone }}
          </el-descriptions-item>

          <el-descriptions-item v-if="user.cityCode !== ''">
            <template slot="label">
              <i class="el-icon-location-outline" />
              用户地址
            </template>
            {{ user.cityCode | cityFormat }}
          </el-descriptions-item>
          <el-descriptions-item v-else>
            <template slot="label">
              <i class="el-icon-location-outline" />
              用户地址
            </template>
            <span>未知</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-present" />
              出生日期
            </template>
            {{ user.birthday | dateFormat }} ({{ user.age }}岁)
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-message" />
              邮箱
            </template>
            {{ user.email || "未知" }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </el-card>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  .common {
    width: 70%;
  }
}
</style>
