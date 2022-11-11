<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="创建公告" />
    </div>
    <div class="createNotice">
      <div class="common">
        <div class="title">
          <span>请输入公告信息:</span>
        </div>
        <el-form ref="form" :model="notice" :rules="noticeRules">
          <el-form-item label="公告标题:" prop="title">
            <el-input
              v-model="notice.title"
              size="small"
              maxlength="100"
              clearable
              placeholder="请输入公告标题"
              style="width: 30%"
            />
          </el-form-item>
          <el-form-item label="公告内容:" prop="content">
            <!-- 输入公告内容 -->
            <div class="content">
              <vue-editor
                v-model="notice.content"
                :editorToolbar="customToolbar"
              />
              <div class="ql-container ql-snow preview">
                <div class="ql-editor" v-html="notice.content" />
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button type="info" size="small" @click="$refs.form.resetFields()">
            重置
          </el-button>
          <el-button type="primary" size="small" @click="createNotice">
            创建
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { VueEditor } from "vue2-editor";
import "../../assets/css/quill.snow.css";
export default {
  name: "CreateNotice",
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
      //公告表单
      notice: {
        title: "",
        content: "",
        publisherId: "",
      },
      //创建公告表单验证规则
      noticeRules: {
        title: [
          {
            required: true,
            message: "公告标题不可为空",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,100}$/,
            message: "长度在 1 到 100 个数字,中文或字母",
            trigger: blur,
          },
        ],
        content: [
          {
            required: true,
            message: "请输入公告内容",
            trigger: blur,
          },
        ],
      },
    };
  },
  methods: {
    //创建公告
    createNotice() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.notice.publisherId = this.$store.state.currentAdminInfo?.adminId;
        const { data: createNoticeRes } = await this.$axios.post(
          "notice/create",
          this.notice
        );
        this.$refs.form.resetFields();
        this.$message({
          message: createNoticeRes.msg,
          type: `${createNoticeRes.code !== 200 ? "error" : "success"}`,
          center: true,
        });
      });
    },
  },
};
</script>

<style lang="less">
.createNotice {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  .common {
    width: 100%;
    height: auto;
    .el-form {
      margin-top: 10px;
      .content {
        width: 100%;
        height: auto;
        padding: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        .quillWrapper {
          width: 48%;
        }
        .preview {
          width: 48%;
          height: auto;
          border: solid 1px #ccc;
          .ql-editor {
            min-height: 290px;
          }
        }
      }
    }
    .title {
      display: flex;
      justify-content: flex-start;
      font-weight: bold;
      font-size: 1em;
    }
    .btns {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
