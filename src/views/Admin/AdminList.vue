<template>
  <el-card shadow="never" v-if="$route.path === '/admin'">
    <div slot="header" class="cardHeader">
      <span>管理员列表</span>
      <el-button
        type="primary"
        size="mini"
        @click="$router.push('/admin/create')"
        >创建管理员</el-button
      >
    </div>
    <div class="adminList">
      <el-table
        :data="adminList"
        fit
        border
        stripe
        :highlight-current-row="true"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="账号" align="center">
          <template v-slot="scope">
            <el-tooltip
              effect="light"
              :content="'编号:' + scope.row.adminId.toString()"
              placement="top"
            >
              <span>{{ scope.row.account }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="telephone" label="电话" align="center" />
        <el-table-column label="权限" align="center">
          <template v-slot="scope">
            {{ scope.row.power | powerFormat }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="$router.push(`/admin/edit/${scope.row.adminId}`)"
              >更新</el-button
            >
            <el-popconfirm
              confirm-button-text="是滴"
              cancel-button-text="点错了"
              icon="el-icon-warning"
              icon-color="red"
              title="确定删除该管理员?"
              style="margin-left: 10px"
              @confirm="deleteAdminById(scope.row.adminId)"
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
  name: "AdminList",
  data() {
    return {
      //管理员列表数组
      adminList: [],
      //分页对象
      page: {
        pageNumber: 1,
        pageSize: 8,
        total: 0,
      },
    };
  },
  watch: {
    $route() {
      this.getAdminListPage();
    },
  },
  methods: {
    //分页获取管理员列表信息
    async getAdminListPage() {
      this.getAdminCount();
      const { data: adminListRes } = await this.$axios.get("admin/list", {
        params: {
          currentPage: this.page.pageNumber,
          pageSize: this.page.pageSize,
          currentAdminId: this.$store.state.currentAdminInfo.adminId,
        },
      });
      this.adminList = adminListRes.data;
    },

    //获取管理员总数量
    async getAdminCount() {
      const { data: adminCountRes } = await this.$axios.get("admin/count");
      this.page.total = parseInt(adminCountRes.data);
    },

    //处理页面大小发生变化的方法
    handleSizeChange(newSize) {
      this.page.pageSize = newSize;
      this.page.pageNumber = parseInt(this.page.total / newSize);
      this.getAdminListPage();
    },

    //处理当前页码发生变化的方法
    handleCurrentChange(newPage) {
      this.page.pageNumber = newPage;
      this.getAdminListPage();
    },

    //通过Id删除管理员
    async deleteAdminById(adminId) {
      const { data: deleteAdminRes } = await this.$axios.delete(
        "admin/remove/" + adminId
      );
      this.getAdminListPage();
      this.$message({
        message: deleteAdminRes.msg,
        type: `${deleteAdminRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },
  },
  mounted() {
    this.getAdminListPage();
  },
};
</script>

<style lang="less">
.adminList {
  .page {
    width: 100%;
    padding: 5px;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .operation {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .title {
      font-family: 黑体;
      font-size: 1.2em;
    }
  }
}
</style>
