<template>
  <el-card shadow="never" v-if="$route.path === '/busroute'">
    <div slot="header" class="cardHeader">
      <span>线路列表</span>
      <el-button
        type="primary"
        size="small"
        @click="$router.push('/busroute/create')"
        >创建线路</el-button
      >
    </div>
    <div class="routeList">
      <el-table
        :data="routeList"
        fit
        border
        stripe
        :highlight-current-row="true"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="线路公交" align="center">
          <template v-slot="scope">
            <el-tooltip
              effect="light"
              :content="'线路编号:' + scope.row.routeId.toString()"
              placement="top"
            >
              <span>{{ scope.row.bus.busName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="花费" align="center" width="100">
          <template v-slot="scope"> {{ scope.row.cost }}元 </template>
        </el-table-column>
        <el-table-column label="所在城市" align="center">
          <template v-slot="scope">
            {{ scope.row.bus?.cityCode | cityFormat }}
          </template>
        </el-table-column>
        <el-table-column label="运行时间" align="center">
          <template v-slot="scope">
            {{ scope.row.timeRange }}
          </template>
        </el-table-column>
        <el-table-column label="发车间隔" align="center" width="100">
          <template v-slot="scope"> {{ scope.row.busInterval }}分钟 </template>
        </el-table-column>
        <el-table-column label="夜间行车" align="center" width="100">
          <template v-slot="scope">
            {{ scope.row.isNight ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="环线行驶" align="center" width="100">
          <template v-slot="scope">
            {{ scope.row.isCircle ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="120">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="$router.push(`/busroute/edit/${scope.row.routeId}`)"
              >更新信息</el-button
            >
            <el-popconfirm
              confirm-button-text="是滴"
              cancel-button-text="点错了"
              icon="el-icon-warning"
              icon-color="red"
              title="确定删除该线路?"
              style="margin-left: 10px"
              @confirm="deleteRouteById(scope.row.routeId)"
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
  </el-card>
  <router-view v-else />
</template>

<script>
export default {
  name: "RouteList",
  data() {
    return {
      //线路信息列表
      routeList: [],
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
      this.getRouteListPage();
    },
  },
  methods: {
    //分页获取线路信息列表
    async getRouteListPage() {
      this.getRouteCount();
      const { data: routeListRes } = await this.$axios.get("route/list", {
        params: {
          currentPage: this.page.pageNumber,
          pageSize: this.page.pageSize,
        },
      });
      this.routeList = routeListRes.data;
    },

    //获取线路总数量
    async getRouteCount() {
      const { data: routeCountRes } = await this.$axios.get("route/count");
      this.page.total = parseInt(routeCountRes.data);
    },

    //处理页面大小发生变化的方法
    handleSizeChange(newSize) {
      this.page.pageSize = newSize;
      this.page.pageNumber = parseInt(this.page.total / newSize);
      this.getRouteListPage();
    },

    //处理当前页码发生变化的方法
    handleCurrentChange(newPage) {
      this.page.pageNumber = newPage;
      this.getRouteListPage();
    },

    //通过Id删除线路
    async deleteRouteById(routeId) {
      const { data: deleteRouteRes } = await this.$axios.delete(
        "route/remove/" + routeId
      );
      this.getRouteListPage();
      this.$message({
        message: deleteRouteRes.msg,
        type: `${deleteRouteRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },
  },
  mounted() {
    this.getRouteListPage();
  },
};
</script>

<style lang="less">
.routeList {
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
