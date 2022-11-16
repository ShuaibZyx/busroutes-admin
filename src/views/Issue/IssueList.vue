<template>
  <el-card shadow="never" v-if="$route.path === '/issue'">
    <div slot="header" class="cardHeader">
      <span>用户留言</span>
      <el-button type="text" 
        >未处理留言:{{
          issueList.filter((issue) => {
            return issue.state != 2;
          }).length
        }}条</el-button
      >
    </div>
    <div class="issueList">
      <el-collapse :accordion="true">
        <el-collapse-item
          v-for="(issue, index) in issueList"
          :key="issue.issueId"
          :name="issue.issueId"
        >
          <template slot="title">
            <i
              v-if="issue.state === 0"
              class="el-icon-question"
              style="font-size: 1.2em"
            />
            <i
              v-else-if="issue.state === 1"
              class="el-icon-s-comment"
              style="color: #409eff; font-size: 1.2em"
            />
            <i
              v-else
              class="el-icon-success"
              style="color: green; font-size: 1.2em"
            />
            <div class="collapseHeader">
              <span style="margin-left: 10px">{{
                index + 1 + ". " + issue.title
              }}</span>
              <span>留言于{{ issue.createTime | dateFormat }}创建</span>
              <div>
                <el-button
                  type="text"
                  v-if="
                    issue.state === 0 &&
                    (adminInfo.power === 1 || adminInfo.power === 3)
                  "
                  @click="takeIssueAdmin(issue)"
                  >接取</el-button
                >
                <el-button
                  type="text"
                  v-if="
                    issue.state === 1 && issue.adminId === adminInfo.adminId
                  "
                  @click="$router.push('/issue/message/' + issue.issueId)"
                  >处理</el-button
                >
                <el-button
                  v-if="
                    issue.adminId === adminInfo.adminId || adminInfo.power === 3
                  "
                  type="text"
                  @click="$router.push('/issue/message/' + issue.issueId)"
                  >查看</el-button
                >
                <el-popconfirm
                  confirm-button-text="是滴"
                  cancel-button-text="点错了"
                  icon="el-icon-warning"
                  icon-color="red"
                  title="永久删除该留言?"
                  style="margin-left: 10px"
                  v-if="issue.state === 2 && adminInfo.power === 3"
                >
                  <el-button
                    type="text"
                    size="mini"
                    style="color: red; font-size: 0.9em"
                    slot="reference"
                  >
                    删除
                  </el-button>
                </el-popconfirm>
              </div>
            </div>
          </template>
          <div class="content">
            <span v-if="issue.state === 1"
              >该问题已于<span style="color: skyblue">
                {{ issue.updateTime | dateFormat }} </span
              >由编号为<span style="color: skyblue"> {{ issue.adminId }} </span
              >业务员接取</span
            >
            <span v-if="issue.state === 2"
              >该问题已于<span style="color: green">
                {{ issue.updateTime | dateFormat }} </span
              >由编号为<span style="color: green"> {{ issue.adminId }} </span
              >业务员解决</span
            >
            <span>留言具体信息: {{ issue.description }}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
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
  name: "IssueList",
  data() {
    return {
      //留言列表
      issueList: [],
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
      this.getIssueListPage();
    },
  },
  computed: {
    adminInfo() {
      return this.$store.state.currentAdminInfo;
    },
  },
  methods: {
    //分页获取所有留言
    async getIssueListPage() {
      this.getIssueCount();
      const { data: issueListRes } = await this.$axios.get("issue/list", {
        params: {
          currentPage: this.page.pageNumber,
          pageSize: this.page.pageSize,
        },
      });
      this.issueList = issueListRes.data;
    },

    //获取留言总数量
    async getIssueCount() {
      const { data: issueCountRes } = await this.$axios.get("issue/count");
      this.page.total = parseInt(issueCountRes.data);
    },

    //处理页面大小发生变化的方法
    handleSizeChange(newSize) {
      this.page.pageSize = newSize;
      this.page.pageNumber = parseInt(this.page.total / newSize);
      this.getIssueListPage();
    },

    //处理当前页码发生变化的方法
    handleCurrentChange(newPage) {
      this.page.pageNumber = newPage;
      this.getIssueListPage();
    },

    //接取留言问题
    async takeIssueAdmin(issue) {
      var formdata = new FormData();
      formdata.append("adminId", this.adminInfo.adminId);
      const { data: takeRes } = await this.$axios.put(
        "issue/take/" + issue.issueId,
        formdata
      );
      issue.state = 1;
      this.$message({
        message: takeRes.msg,
        type: `${takeRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },
  },
  mounted() {
    this.getIssueListPage();
  },
};
</script>

<style lang="less">
.issueList {
  width: 98%;
  padding: 10px;
  .page {
    width: 100%;
    padding: 5px;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .el-collapse-item__header {
    height: 60px;
    .collapseHeader {
      width: 95%;
      font-size: 1.2em;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .el-collapse-item__content {
    font-size: 0.9em;
    .content {
      padding: 1%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }
}
</style>
