<template>
  <el-card shadow="never" v-if="$route.path === '/notice'">
    <div slot="header" class="cardHeader">
      <span class="title">公告列表</span>
      <el-button
        type="primary"
        size="small"
        @click="$router.push('/notice/create')"
        >创建公告</el-button
      >
    </div>
    <div class="noticeList">
      <el-table
        :data="noticeList"
        fit
        border
        stripe
        :highlight-current-row="true"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="公告标题" align="center">
          <template v-slot="scope">
            <el-tooltip
              effect="light"
              :content="'编号:' + scope.row.noticeId.toString()"
              placement="top"
            >
              <span>{{ scope.row.title }}</span>
            </el-tooltip>
            <el-link
              type="primary"
              @click="$router.push('/notice/detail/' + scope.row.noticeId)"
              >查看详情</el-link
            >
          </template>
        </el-table-column>
        <el-table-column label="公告状态" align="center">
          <template v-slot="scope">
            <el-link
              :type="scope.row.state ? 'primary' : 'info'"
              :underline="false"
              >{{ scope.row.state | noticeStateFormat }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="350">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="!scope.row.state"
              type="success"
              @click="publishNotice(scope.row.noticeId)"
              >发布</el-button
            >
            <el-button
              size="mini"
              type="primary"
              :disabled="
                $store.state.currentAdminInfo.adminId !== scope.row.publisherId
              "
              @click="$router.push(`/notice/edit/${scope.row.noticeId}`)"
              >更新</el-button
            >
            <el-popconfirm
              confirm-button-text="是滴"
              cancel-button-text="点错了"
              icon="el-icon-warning"
              icon-color="red"
              title="确定删除该公告?"
              style="margin-left: 10px"
              @confirm="deleteNoticeById(scope.row.noticeId)"
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
  name: "NoticeList",
  data() {
    return {
      //公告信息列表
      noticeList: [],
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
      this.getNoticeListPage();
    },
  },
  methods: {
    //分页获取公告信息列表
    async getNoticeListPage() {
      this.getNoticeCount();
      const { data: noticeListRes } = await this.$axios.get("notice/list", {
        params: {
          currentPage: this.page.pageNumber,
          pageSize: this.page.pageSize,
        },
      });
      this.noticeList = noticeListRes.data;
    },

    //获取公告总数量
    async getNoticeCount() {
      const { data: noticeCountRes } = await this.$axios.get("notice/count");
      this.page.total = parseInt(noticeCountRes.data);
    },

    //处理页面大小发生变化的方法
    handleSizeChange(newSize) {
      this.page.pageSize = newSize;
      this.page.pageNumber = parseInt(this.page.total / newSize);
      this.getNoticeListPage();
    },

    //处理当前页码发生变化的方法
    handleCurrentChange(newPage) {
      this.page.pageNumber = newPage;
      this.getNoticeListPage();
    },

    //通过Id删除公告
    async deleteNoticeById(noticeId) {
      const { data: deleteNoticeRes } = await this.$axios.delete(
        "notice/remove/" + noticeId
      );
      this.getNoticeListPage();
      this.$message({
        message: deleteNoticeRes.msg,
        type: `${deleteNoticeRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },

    //发布公告的方法
    async publishNotice(noticeId) {
      var formdata = new FormData();
      formdata.append("noticeId", noticeId);
      const { data: publishNoticeRes } = await this.$axios.post(
        "noticeReads/publish",
        formdata
      );
      if (publishNoticeRes.code === 200) {
        for (let i = 0; i < this.noticeList.length; i++) {
          if (this.noticeList[i].noticeId === noticeId)
            this.noticeList[i].state = true;
        }
      }
      this.$message({
        message: publishNoticeRes.msg,
        type: `${publishNoticeRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },
  },
  mounted() {
    this.getNoticeListPage();
  },
};
</script>

<style lang="less">
.noticeList {
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
