<template>
  <div class="busList" v-if="$route.path === '/bus'">
    <div class="operation">
      <span class="title">公交列表</span>
      <el-button
        type="primary"
        size="small"
        @click="$router.push('/bus/create')"
        >创建公交</el-button
      >
    </div>
    <el-table :data="busList" fit border stripe :highlight-current-row="true">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="公交名称" align="center">
        <template v-slot="scope">
          <el-tooltip
            effect="light"
            :content="'编号:' + scope.row.busId.toString()"
            placement="top"
          >
            <span>{{ scope.row.busName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="公交类型" align="center">
        <template v-slot="scope">
          {{ scope.row.type | busTypeFormat }}
        </template>
      </el-table-column>
      <el-table-column label="所在城市" align="center">
        <template v-slot="scope">
          {{ scope.row.cityCode | cityFormat }}
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
            style="margin-right: 10px"
            @click="$router.push(`/bus/edit/${scope.row.busId}`)"
            >更新</el-button
          >
          <el-popconfirm
            confirm-button-text="是滴"
            cancel-button-text="点错了"
            icon="el-icon-warning"
            icon-color="red"
            title="确定删除该公交?"
            @confirm="deleteBusById(scope.row.busId)"
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
    <router-view />
  </div>
  <router-view v-else />
</template>

<script>
export default {
  name: "BusList",
  data() {
    return {
      busList: [],
      page: {
        pageNumber: 1,
        pageSize: 8,
        total: 0,
      },
    };
  },
  watch: {
    $route() {
      this.getBusListPage();
    },
  },
  methods: {
    //分页获取公交信息列表
    async getBusListPage() {
      this.getBusCount();
      const { data: busListRes } = await this.$axios.get("bus/list", {
        params: {
          currentPage: this.page.pageNumber,
          pageSize: this.page.pageSize,
        },
      });
      this.busList = busListRes.data;
    },

    //获取公交总数量
    async getBusCount() {
      const { data: busCountRes } = await this.$axios.get("bus/count");
      this.page.total = parseInt(busCountRes.data);
    },

    //处理页面大小发生变化的方法
    handleSizeChange(newSize) {
      this.page.pageSize = newSize;
      this.page.pageNumber = parseInt(this.page.total / newSize);
      this.getBusListPage();
    },

    //处理当前页码发生变化的方法
    handleCurrentChange(newPage) {
      this.page.pageNumber = newPage;
      this.getBusListPage();
    },

    //通过Id删除公交
    async deleteBusById(busId) {
      const { data: deleteBusRes } = await this.$axios.delete(
        "bus/remove/" + busId
      );
      this.getBusListPage();
      this.$message({
        message: deleteBusRes.msg,
        type: `${deleteBusRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },
  },
  mounted() {
    this.getBusListPage();
  },
};
</script>

<style lang="less">
.busList {
  width: 99%;
  height: auto;
  padding: 5px;
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
