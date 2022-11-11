<template>
  <el-card shadow="never" v-if="$route.path === '/station'">
    <div slot="header" class="cardHeader">
      <span class="title">站点列表</span>
      <el-button
        type="primary"
        size="small"
        @click="$router.push('/station/create')"
        >创建站点</el-button
      >
    </div>
    <div class="stationList">
      <div class="operation"></div>
      <el-table
        :data="stationList"
        fit
        border
        stripe
        :highlight-current-row="true"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="站点名称" align="center">
          <template v-slot="scope">
            <el-tooltip
              effect="light"
              :content="'编号:' + scope.row.stationId.toString()"
              placement="top"
            >
              <span>{{ scope.row.stationName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="站点状态" align="center">
          <template v-slot="scope">
            {{ scope.row.state | stationStateFormat }}
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
              @click="$router.push(`/station/edit/${scope.row.stationId}`)"
              >更新</el-button
            >
            <el-button
              v-if="scope.row.state"
              type="warning"
              size="mini"
              :disabled="switchStationId === scope.row.stationId"
              @click="modifyStationState(scope.row.stationId, false)"
            >
              禁用
            </el-button>
            <el-button
              v-else
              type="success"
              size="mini"
              :disabled="switchStationId === scope.row.stationId"
              @click="modifyStationState(scope.row.stationId, true)"
            >
              启用
            </el-button>
            <el-popconfirm
              confirm-button-text="是滴"
              cancel-button-text="点错了"
              icon="el-icon-warning"
              icon-color="red"
              title="确定删除该站点?"
              style="margin-left: 10px"
              @confirm="deleteStationById(scope.row.stationId)"
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
  name: "StationList",
  data() {
    return {
      //站点信息列表
      stationList: [],
      //分页对象
      page: {
        pageNumber: 1,
        pageSize: 8,
        total: 0,
      },
      //当前切换的站点信息编号
      switchStationId: "",
    };
  },
  watch: {
    $route() {
      this.getStationListPage();
    },
  },
  methods: {
    //分页获取站点信息列表
    async getStationListPage() {
      this.getStationCount();
      const { data: stationListRes } = await this.$axios.get("station/list", {
        params: {
          currentPage: this.page.pageNumber,
          pageSize: this.page.pageSize,
        },
      });
      this.stationList = stationListRes.data;
    },

    //获取站点总数量
    async getStationCount() {
      const { data: stationCountRes } = await this.$axios.get("station/count");
      this.page.total = parseInt(stationCountRes.data);
    },

    //处理页面大小发生变化的方法
    handleSizeChange(newSize) {
      this.page.pageSize = newSize;
      this.page.pageNumber = parseInt(this.page.total / newSize);
      this.getStationListPage();
    },

    //处理当前页码发生变化的方法
    handleCurrentChange(newPage) {
      this.page.pageNumber = newPage;
      this.getStationListPage();
    },

    //通过Id删除站点
    async deleteStationById(stationId) {
      const { data: deleteStationRes } = await this.$axios.delete(
        "station/remove/" + stationId
      );
      this.getStationListPage();
      this.$message({
        message: deleteStationRes.msg,
        type: `${deleteStationRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },

    //修改站点信息状态
    async modifyStationState(stationId, state) {
      this.switchStationId = stationId;
      var formdata = new FormData();
      formdata.append("state", state);
      const { data: modifyStateRes } = await this.$axios.put(
        "station/modify/state/" + stationId,
        formdata
      );
      if (modifyStateRes.code === 200) {
        for (let i = 0; i < this.stationList.length; i++) {
          if (this.stationList[i].stationId === stationId)
            this.stationList[i].state = state;
        }
      }
      this.$message({
        message: modifyStateRes.msg,
        type: `${modifyStateRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
      setInterval(() => {
        this.switchStationId = "";
      }, 3000);
    },
  },
  mounted() {
    this.getStationListPage();
  },
};
</script>

<style lang="less">
.stationList {
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
