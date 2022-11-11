<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="公告详情" />
    </div>
    <div class="noticeDetail">
      <span class="title">公告详细信息:</span>
      <div class="content">
        <span class="item">{{ notice.title }}</span>
        <div class="ql-container ql-snow preview">
          <div class="ql-editor" v-html="notice.content" />
        </div>
        <div class="appdixInfo">
          <span class="item">创建者(管理员)编号: {{ notice.publisherId }}</span>
          <span class="item"
            >阅读数/涉及用户数: {{ noticeRead.viewCount }}/{{
              noticeRead.userCount
            }}({{
              Math.round(
                (noticeRead.viewCount / noticeRead.userCount) * 10000
              ) / 100.0
            }}%)</span
          >
          <span class="item"
            >更新时间: {{ notice.updateTime | dateFormat }}</span
          >
          <span class="item"
            >创建时间: {{ notice.createTime | dateFormat }}</span
          >
        </div>
        <div class="btns">
          <el-popconfirm
            confirm-button-text="是滴"
            cancel-button-text="点错了"
            icon="el-icon-warning"
            icon-color="red"
            title="此操作将使该公告所有涉及用户全部已读,是否继续?"
            v-if="notice.state && noticeRead.userCount > noticeRead.viewCount"
            @confirm="setNoticeAllRead(notice.noticeId)"
          >
            <el-button size="mini" type="info" slot="reference"
              >设置已读</el-button
            >
          </el-popconfirm>
          <el-popconfirm
            confirm-button-text="是滴"
            cancel-button-text="点错了"
            icon="el-icon-warning"
            icon-color="red"
            title="重新发布此公告?原有公告记录信息将被覆盖"
            style="margin: 0 10px"
            v-if="notice.state"
            @confirm="publishNotice(notice.noticeId)"
          >
            <el-button size="mini" slot="reference" type="success"
              >重新发布</el-button
            >
          </el-popconfirm>
          <el-button type="info" size="mini" @click="$router.back()"
            >返回</el-button
          >
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import "../../assets/css/quill.snow.css";
export default {
  name: "NoticeDetail",
  data() {
    return {
      notice: {},
      noticeRead: {},
    };
  },
  computed: {
    noticeId() {
      return this.$route.params.noticeId;
    },
  },
  methods: {
    //根据Id查询公告信息
    async getNoticeInfoById() {
      const { data: noticeInfoRes } = await this.$axios.get(
        "notice/info/" + this.noticeId
      );
      this.notice = noticeInfoRes.data;
      this.getNoticeReadInfo();
    },

    //设置全部已读
    async setNoticeAllRead(noticeId) {
      const { data: allReadRes } = await this.$axios.put(
        "noticeReads/singleViewAll/" + noticeId
      );
      if (allReadRes.code === 200) this.getNoticeInfoById();
      this.$message({
        message: allReadRes.msg,
        type: `${allReadRes.code !== 200 ? "error" : "success"}`,
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
        this.getNoticeInfoById();
      }
      this.$message({
        message: publishNoticeRes.msg,
        type: `${publishNoticeRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },

    async getNoticeReadInfo() {
      const { data: noticeReadRes } = await this.$axios.get(
        "noticeReads/userCount/" + this.noticeId
      );
      this.noticeRead = noticeReadRes.data;
    },
  },
  mounted() {
    this.getNoticeInfoById();
  },
};
</script>

<style lang="less">
.noticeDetail {
  .title {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 1em;
  }
  .content {
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .item {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 0.9em;
      margin-top: 10px;
    }
    .preview {
      margin-top: 15px;
      width: 75%;
      height: auto;
      border: solid 1px #ccc;
      .ql-editor {
        min-height: 290px;
      }
    }
    .appdixInfo {
      margin-top: 10px;
      padding: 5px;
      width: 75%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }
  }
}
</style>
