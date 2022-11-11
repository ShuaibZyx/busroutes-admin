import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
var sessionState = JSON.parse(window.sessionStorage.getItem("state"));

export default new Vuex.Store({
  getters: {},
  actions: {},
  modules: {},
  mutations: {
    //设置折叠状态
    setIscollapse(state, value) {
      state.iscollapse = value;
    },
    //设置当前管理员信息
    setCurrentAdminInfo(state, value) {
      state.currentAdminInfo = value;
    },
  },
  state: sessionState
    ? sessionState
    : {
        //是否折叠菜单栏
        iscollapse: false,
        //当前管理员信息
        currentAdminInfo: {},
        //通用后端地址
        baseUrl: "http://localhost:8081/",
        //文件上传的类型限制
        uploadFileTypeLimits: {
          box: ".c, .cpp, .cs, .css, .excel, .exe, .html, .java, .jif, .jpeg, .jpg, .png, .js, .md, .mp3, .mp4, .php, .png, .ppt , .pptx, .ps, .ps1, .py, .rar, .sql, .txt, .vue, .webp, .xml, .zip, .pdf, .doc, .docx, .xls, .xlsx",
          image: " .jif, .jpeg, .jpg, .webp, .png",
        },
      },
});
