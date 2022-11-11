import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import axios from "axios";
import moment from "moment";
import Nprogress from "nprogress";
import VueCookies from "vue-cookies";
import { v4 as uuid } from "uuid";
import ElementUI from "element-ui";
import "./plugins/element.js";
import "./assets/css/global.less";
import citys from "./assets/js/citys";
import lodash from "lodash";

Vue.use(VueCookies);

Vue.config.productionTip = false;

//绑定axios到原型对象实例属性http上
Vue.prototype.$axios = axios;
//设置axios的默认地址和最长请求时间
axios.defaults.baseURL = "/api";
axios.defaults.timeout = 10000;
//绑定moment到原型对象实例属性moment上
Vue.prototype.$moment = moment;
//绑定uuid到原型对象实例属性uuid上
Vue.prototype.$uuid = uuid;
//深拷贝工具
Vue.prototype.$lodash = lodash;

// 在request拦截器中展示进度条,NProgress.start()
axios.interceptors.request.use(
  (config) => {
    const token = JSON.parse(window.sessionStorage.getItem("token"));
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (token) config.headers.token = token; //请求头加上token
    Nprogress.start();
    /* ElementUI.Loading.service({
      text: "努力加载中🥶...",
      background: "rgba(0, 0, 0, 0)",
    }); */
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);

// 在response拦截器中隐藏进度条,NProgress.done()
axios.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      ElementUI.Message({
        message: "当前登录已失效，请重新登录",
        center: true,
        type: "error",
      });
      window.sessionStorage.removeItem("token");
      router.push("login");
    }
    Nprogress.done();
    /*  Vue.nextTick(() => {
      // 以服务的方式调用的 Loading 需要异步关闭
      ElementUI.Loading.service().close();
    }); */
    return response;
  },
  (error) => {
    return Promise.error(error);
  }
);

//日期过滤器
Vue.filter("dateFormat", function (time) {
  return moment(time).format("YYYY-MM-DD");
});

//性别过滤器
Vue.filter("genderFormat", function (gender) {
  return gender === 0 ? "男" : "女";
});

//权限过滤器
Vue.filter("powerFormat", function (power) {
  return power === 3
    ? "主管"
    : power === 2
    ? "管理员"
    : power === 1
    ? "业务员"
    : "无权限";
});

//用户账号状态过滤器
Vue.filter("userAvailableFormat", function (available) {
  return available ? "可用" : "已禁用";
});

//公交车类型过滤器
Vue.filter("busTypeFormat", function (type) {
  return type === 3 ? "铰接式公交" : type === 2 ? "双层公交" : "单层公交";
});

//车站状态过滤器
Vue.filter("stationStateFormat", function (state) {
  return state ? "可用" : "停用";
});

//留言状态过滤器
Vue.filter("noticeStateFormat", function (state) {
  return state ? "已发布" : "未发布";
});

//城市名称过滤器
Vue.filter("cityFormat", function (cityString) {
  var cityArr = cityString === undefined ? [] : cityString.split("-");
  //将所需要的城市编码信息列出来
  const location = cityArr;
  const locationProvince = location[0];
  const locationCity = location[1];
  const locationArea = location[2];
  //创建数组保存查询到的数组，减少查询次数
  var provinceArr = [];
  var cityArr = [];
  //最后用于存放城市中文字符的字符串
  var tansformLocation = "";
  //第一次得到省和市级数组
  citys.forEach((item) => {
    if (item.value === locationProvince) {
      tansformLocation = tansformLocation + item.label;
      provinceArr = item.children;
    }
  });
  //第二次得到市和区域级数组
  provinceArr.forEach((item) => {
    if (item.value === locationCity) {
      tansformLocation = tansformLocation + "/" + item.label;
      cityArr = item.children;
    }
  });
  //第三次得到完整省市区字符串
  cityArr.forEach((item) => {
    if (item.value === locationArea) {
      tansformLocation = tansformLocation + "/" + item.label;
    }
  });
  //返回该字符串
  return tansformLocation;
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
