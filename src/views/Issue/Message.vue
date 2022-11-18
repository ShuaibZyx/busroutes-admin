<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="留言消息" />
      <el-popconfirm
        confirm-button-text="确定"
        cancel-button-text="点错了"
        icon="el-icon-warning"
        icon-color="red"
        title="用户问题已经解决?"
        style="margin-right: 10px"
        @confirm="closeIssueById"
        v-if="issueInfo.state === 1"
      >
        <el-button slot="reference" type="text">关闭留言</el-button>
      </el-popconfirm>
    </div>
    <div class="message">
      <div class="issueInfo">
        <el-collapse>
          <el-collapse-item name="1">
            <template slot="title">
              <div class="collapseHeader">
                <span style="margin-left: 10px"
                  >留言: {{ issueInfo.title }}</span
                >
                <el-tooltip
                  effect="light"
                  :content="'用户编号:' + issueInfo.userInfo?.userId.toString()"
                  placement="top"
                >
                  <span
                    >留言于{{ issueInfo.createTime | dateFormat }}由
                    {{ issueInfo.userInfo?.nickname }}
                    创建</span
                  >
                </el-tooltip>
              </div>
            </template>
            <div class="content">
              <span>留言具体描述: {{ issueInfo.description }}</span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="recordBox">
        <div class="record">
          <div class="title">
            <span>{{ issueInfo.userInfo?.nickname }}</span>
            <el-divider />
          </div>
          <div
            :class="{
              item_left: message.senderRole === 'user',
              item_right: message.senderRole === 'admin',
            }"
            v-for="message in issueInfo.messageList"
            :key="message.messageId"
          >
            <div class="role">
              <el-avatar size="medium">
                <el-image
                  :src="
                    message.senderRole === 'user'
                      ? issueInfo.userInfo?.avatarFile?.fileUrl ||
                        require('../../assets/icons/man.png')
                      : require('../../assets/icons/women.png')
                  "
                />
              </el-avatar>
            </div>
            <div class="ql-container ql-snow dialog">
              <div class="ql-editor" v-html="message.content" />
            </div>
          </div>
        </div>
        <div class="">
          <!-- 输入消息内容 -->
          <div class="content" v-if="issueInfo.state === 1">
            <vue-editor
              v-model="message.content"
              :editorToolbar="customToolbar"
            />
            <!-- 预览消息 -->
            <div
              v-if="previewMessageVisiable"
              class="ql-container ql-snow preview"
            >
              <div class="ql-editor" v-html="message.content" />
            </div>
          </div>
        </div>
      </div>
      <div class="operation" v-if="issueInfo.state === 1">
        <el-switch v-model="previewMessageVisiable" active-text="预览消息" />
        <el-button type="primary" size="mini" @click="sendMessage"
          >发送</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import { VueEditor } from "vue2-editor";
import "../../assets/css/quill.snow.css";
export default {
  name: "Message",
  components: {
    VueEditor,
  },
  data() {
    return {
      //富文本编辑器配置项
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }], //标题
        ["bold", "italic", "underline"], //加粗\斜体\下划线
        ["italic"], //斜体----也可以拆开来写，用于换位置顺序
        [{ align: "" }, { align: "center" }, { align: "right" }], //对齐
        [{ indent: "-1" }, { indent: "+1" }],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], //有序无序列表
        [{ background: [] }, { color: [] }], //背景色
        ["image", "link"], //图片、链接
        ["strike"], //作废（文字中间一横）
        ["underline"],
        ["clean"], //清楚格式（所谓去掉背景色这些花里胡巧）
        ["code"], //代码
        ["code-block"], //代码块
        ["video"], //视频
        [{ size: ["small", false, "large", "huge"] }], //文字大小
      ],
      //当前的留言
      issueInfo: {},
      //发送的消息对象
      message: {
        issueId: "",
        content: "",
      },
      //预览消息框可见性
      previewMessageVisiable: false,
      //webSocket连接对象
      webSocket: null,
    };
  },
  computed: {
    //留言Id
    issueId() {
      return this.$route.params.issueId;
    },
    //wenSocket地址
    webSocketUrl() {
      return this.$store.state.webSocketUrl;
    },
    //当前管理员
    adminInfo() {
      return this.$store.state.currentAdminInfo;
    },
  },
  methods: {
    //获取留言信息
    async getIssueInfoById() {
      const { data: issueInfoRes } = await this.$axios.get(
        "issue/info/" + this.issueId
      );
      this.issueInfo = issueInfoRes.data;
    },

    //发送消息
    async sendMessage() {
      if (this.message.content.length === 0) {
        this.$message({
          message: "发送的消息不可为空",
          type: "warning",
          center: true,
          showClose: true,
        });
        return;
      }
      this.message.issueId = this.issueId;
      const { data: sendMeassageRes } = await this.$axios.post(
        "message/createAdminMessage",
        this.message
      );
      if (sendMeassageRes.code === 200) {
        this.getIssueInfoById();
        this.message.content = "";
        var messageObj = {
          receiver: this.issueInfo.createrId,
          message: this.message.content,
        };
        if (this.webSocket !== null)
          this.webSocket.send(JSON.stringify(messageObj));
        else this.openWebSocket();
      }
      this.$message({
        message: sendMeassageRes.msg,
        type: `${sendMeassageRes.code !== 200 ? "error" : "success"}`,
        center: true,
        showClose: true,
      });
    },

    //关闭留言
    async closeIssueById() {
      const { data: closeRes } = await this.$axios.put(
        "issue/close/" + this.issueId
      );
      if (closeRes.code === 200) this.$router.push("/issue");
      this.$message({
        message: closeRes.msg,
        type: `${closeRes.code !== 200 ? "error" : "success"}`,
        center: true,
        showClose: true,
      });
    },

    //连接websocket并开启会话
    openWebSocket() {
      if (!this.issueInfo.state === 1) return;
      this.webSocket = new WebSocket(
        (this.webSocketUrl + this.adminInfo.adminId).toString()
      );
      if (this.webSocket !== null) {
        //连接成功方法
        this.webSocket.onopen = () => {
          this.$message({
            message: "会话连接成功!",
            type: "success",
            center: true,
            duration: 1000,
            showClose: true,
          });
        };
        //接收到消息的回调方法
        this.webSocket.onmessage = () => {
          this.getIssueInfoById();
        };
        this.webSocket.onclose = () => {
          this.$message({
            message: "会话连接已关闭!",
            type: "warning",
            center: true,
            duration: 1000,
            showClose: true,
          });
        };
        //连接出错方法
        this.webSocket.onerror = () => {
          if (this.issueInfo.state === 1) {
            setInterval(() => {
              this.openWebSocket();
            }, 3000);
          }
          this.$message({
            message: "会话连接出现错误!",
            type: "danger",
            center: true,
            duration: 1000,
            showClose: true,
          });
        };
      }
    },
  },
  beforeDestroy() {
    if (this.webSocket !== null) this.webSocket.close();
  },
  mounted() {
    this.getIssueInfoById();
    if (this.webSocket === null) this.openWebSocket();
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = () => {
      if (this.webSocket !== null) this.webSocket.close();
    };
  },
};
</script>

<style lang="less">
.message {
  .issueInfo {
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
  .recordBox {
    min-height: 500px;
    padding: 5px;
    .record {
      padding: 20px;
      height: 500px;
      background-image: linear-gradient(-225deg, #fffeff 0%, #d7fffe 100%);
      border: rgb(218, 215, 215) 1px solid;
      border-radius: 10px;
      overflow-x: hidden;
      overflow-y: scroll;
      .ql-editor {
        font-size: 15px;
        min-height: 40px !important;
        line-height: 18px !important;
      }
      .title {
        font-size: large;
        color: #409eff;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
      }
      .item_left {
        height: auto;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 5px;
        margin: 10px 5px;
        min-height: 40px;
        .role {
          position: relative;
          top: 5px;
          height: 100%;
          width: 3%;
          .el-avatar {
            background-color: #eea2a4;
          }
        }
        .dialog {
          padding: 5px;
          margin-left: 12px;
          margin-right: 4%;
          padding-left: 15px;
          font-size: 0.9em;
          position: relative;
          min-width: 200px;
          line-height: 2;
          background: #f0c9cf;
          color: rgb(0, 0, 0);
          border: rgb(102, 102, 102) 1px solid;
          border-radius: 5px;
        }
        .dialog::before {
          content: "";
          position: absolute;
          border: 8px solid;
          border-color: transparent #f0c9cf transparent transparent;
          left: -16px;
          top: 20px;
        }
      }
      .item_right {
        height: auto;
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 5px;
        margin: 10px 5px;
        min-height: 40px;
        .role {
          position: relative;
          top: 5px;
          height: 100%;
          width: 3%;
          .el-avatar {
            background-color: #51c4d3;
          }
        }
        .dialog {
          padding: 5px;
          margin-right: 12px;
          margin-left: 4%;
          padding-left: 15px;
          font-size: 0.9em;
          position: relative;
          min-width: 200px;
          line-height: 2;
          background: #51c4d3;
          color: rgb(0, 0, 0);
          border: rgb(102, 102, 102) 1px solid;
          border-radius: 5px;
        }
        .dialog::after {
          content: "";
          position: absolute;
          border: 8px solid;
          border-color: transparent transparent transparent #51c4d3;
          right: -16px;
          top: 20px;
        }
      }
    }
    .content {
      height: auto;
      padding: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .quillWrapper {
        width: 100%;
        margin-right: 7px;
      }
      .preview {
        width: 100%;
        margin-top: 15px;
        margin-right: 7px;
        height: auto;
        border: solid 1px #ccc;
        .ql-editor {
          min-height: 290px;
        }
      }
    }
  }
  .operation {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
