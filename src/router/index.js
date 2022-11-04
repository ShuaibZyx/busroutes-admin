import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);


const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  routes: [
    
  ],
});

// 挂载路由前置守卫
/* router.beforeEach((to, from, next) => {
  //首先判断用户是否已经登录
  const token = JSON.parse(window.sessionStorage.getItem("token"));
  if (to.path !== "/login") {
    if (token) {
      //已经登录
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
}); */

export default router;
