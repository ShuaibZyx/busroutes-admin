<template>
  <el-card shadow="never" v-if="$route.path === '/user'">
    <div slot="header" class="cardHeader">
      <span class="title">用户列表</span>
      <el-button
        type="primary"
        size="small"
        @click="$router.push('/user/create')"
        >创建用户</el-button
      >
    </div>
    <div class="userList">
      <el-table
        :data="userList"
        fit
        border
        stripe
        :highlight-current-row="true"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="账号" align="center">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="'编号:' + scope.row.userId.toString()"
              placement="top"
            >
              <span>{{ scope.row.account }}</span>
            </el-tooltip>
            <el-link
              type="primary"
              class="checklink"
              @click="$router.push('/user/detail/' + scope.row.userId)"
              >查看详情</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="telephone" label="电话" align="center">
          <template v-slot="scope">
            {{ scope.row.userInfo?.telephone || "暂无" }} ({{
              scope.row.userInfo?.nickname || "暂无"
            }})
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot="scope">
            {{ scope.row.available | userAvailableFormat }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="270">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="$router.push(`/user/edit/${scope.row.userId}`)"
              >更新</el-button
            >
            <el-button
              v-if="!scope.row.available"
              size="mini"
              type="success"
              :disabled="switchUserId === scope.row.userId"
              @click="modifyUserAvailable(scope.row.userId, true)"
              >启用</el-button
            >
            <el-button
              v-else
              size="mini"
              type="warning"
              :disabled="switchUserId === scope.row.userId"
              @click="modifyUserAvailable(scope.row.userId, false)"
              >禁用</el-button
            >
            <el-popconfirm
              confirm-button-text="是滴"
              cancel-button-text="点错了"
              icon="el-icon-warning"
              icon-color="red"
              title="确定删除该用户?"
              @confirm="deleteUserById(scope.row.userId)"
              style="margin-left: 10px"
            >
              <el-button slot="reference" size="mini" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.pageNumber"
          :page-sizes="[8, 12, 18]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          :hide-on-single-page="true"
        >
        </el-pagination>
      </div>
    </div>
  </el-card>
  <router-view v-else />
</template>

<script>
export default {
  name: "userList",
  data() {
    return {
      //用户信息列表
      userList: [],
      //分页对象
      page: {
        pageNumber: 1,
        pageSize: 8,
        total: 0,
      },
      switchUserId: "",
    };
  },
  watch: {
    $route() {
      this.getUserListPage();
    },
  },
  methods: {
    //分页获取用户列表信息
    async getUserListPage() {
      this.getUserCount();
      const { data: userListRes } = await this.$axios.get("user/list", {
        params: {
          currentPage: this.page.pageNumber,
          pageSize: this.page.pageSize,
        },
      });
      this.userList = userListRes.data;
    },

    //获取用户总数量
    async getUserCount() {
      const { data: userCountRes } = await this.$axios.get("user/count");
      this.page.total = parseInt(userCountRes.data);
    },

    //处理页面大小发生变化的方法
    handleSizeChange(newSize) {
      this.page.pageSize = newSize;
      this.page.pageNumber = parseInt(this.page.total / newSize);
      this.getUserListPage();
    },

    //处理当前页码发生变化的方法
    handleCurrentChange(newPage) {
      this.page.pageNumber = newPage;
      this.getUserListPage();
    },

    //通过Id删除用户
    async deleteUserById(userId) {
      const { data: deleteUserRes } = await this.$axios.delete(
        "user/remove/" + userId
      );
      this.getUserListPage();
      this.$message({
        message: deleteUserRes.msg,
        type: `${deleteUserRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },

    //修改用户的账号状态
    async modifyUserAvailable(userId, available) {
      this.switchUserId = userId;
      var formdata = new FormData();
      formdata.append("available", available);
      const { data: modifyAvailableRes } = await this.$axios.put(
        "user/modify/available/" + userId,
        formdata
      );
      if (modifyAvailableRes.code === 200) {
        for (let i = 0; i < this.userList.length; i++) {
          if (this.userList[i].userId === userId)
            this.userList[i].available = available;
        }
      }
      this.$message({
        message: modifyAvailableRes.msg,
        type: `${modifyAvailableRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
      setInterval(() => {
        this.switchUserId = "";
      }, 3000);
    },
  },
  mounted() {
    this.getUserListPage();
  },
};
</script>

<style lang="less">
.userList {
  .page {
    width: 100%;
    padding: 5px;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
