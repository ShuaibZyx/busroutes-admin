import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";

Vue.use(VueRouter);
//通用组件
const Home = () => import("../components/Home.vue");
const Login = () => import("../components/Login.vue");
const Index = () => import("../views/Index.vue");
const Profile = () => import("../views/Profile.vue");
//管理员组件
const AdminList = () => import("../views/Admin/AdminList.vue");
const CreateAdmin = () => import("../views/Admin/CreateAdmin.vue");
const EditAdmin = () => import("../views/Admin/EditAdmin.vue");
//用户组件
const UserList = () => import("../views/User/UserList.vue");
const CreateUser = () => import("../views/User/CreateUser.vue");
const UserDetail = () => import("../views/User/UserDetail.vue");
const EditUser = () => import("../views/User/EditUser.vue");
//公交组件
const BusList = () => import("../views/Bus/BusList.vue");
const CreateBus = () => import("../views/Bus/CreateBus.vue");
const EditBus = () => import("../views/Bus/EditBus.vue");
//车站组件
const StationList = () => import("../views/Station/StationList.vue");
const CreateStation = () => import("../views/Station/CreateStation.vue");
const EditStation = () => import("../views/Station/EditStation.vue");
//公告组件
const NoticeList = () => import("../views/Notice/NoticeList.vue");
const CreateNotice = () => import("../views/Notice/CreateNotice.vue");
const NoticeDetail = () => import("../views/Notice/NoticeDetail.vue");
const EditNotice = () => import("../views/Notice/EditNotice.vue");
//线路组件
const RouteList = () => import("../views/Route/RouteList.vue");
const CreateRoute = () => import("../views/Route/CreateRoute.vue");
const EditRoute = () => import("../views/Route/EditRoute.vue");
const ManageRouteNode = () => import("../views/Route/ManageRouteNode.vue");
//留言组件
const IssueList = () => import("../views/Issue/IssueList.vue");
const Message = () => import("../views/Issue/Message.vue");

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  routes: [
    { path: "/login", component: Login },
    { path: "/", redirect: "/home" },
    {
      path: "/home",
      component: Home,
      redirect: "/index",
      meta: { title: "主页" },
      children: [
        {
          path: "/index",
          component: Index,
          meta: { title: "总览" },
        },
        {
          path: "/profile/:adminId",
          component: Profile,
          meta: { title: "我的信息" },
        },
        {
          path: "/admin",
          component: AdminList,
          meta: { title: "管理员" },
          children: [
            {
              path: "/admin/create",
              component: CreateAdmin,
              meta: { title: "创建管理员" },
            },
            {
              path: "/admin/edit/:adminId",
              component: EditAdmin,
              meta: { title: "更新管理员信息" },
            },
          ],
        },
        {
          path: "/user",
          component: UserList,
          meta: { title: "用户" },
          children: [
            {
              path: "/user/create",
              component: CreateUser,
              meta: { title: "创建用户" },
            },
            {
              path: "/user/detail/:userId",
              component: UserDetail,
              meta: { title: "用户详情" },
            },
            {
              path: "/user/edit/:userId",
              component: EditUser,
              meta: { title: "更新用户信息" },
            },
          ],
        },
        {
          path: "/bus",
          component: BusList,
          meta: { title: "公交" },
          children: [
            {
              path: "/bus/create",
              component: CreateBus,
              meta: { title: "创建公交" },
            },
            {
              path: "/bus/edit/:busId",
              component: EditBus,
              meta: { title: "更新公交信息" },
            },
          ],
        },
        {
          path: "/station",
          component: StationList,
          meta: { title: "站点" },
          children: [
            {
              path: "/station/create",
              component: CreateStation,
              meta: { title: "创建站点" },
            },
            {
              path: "/station/edit/:stationId",
              component: EditStation,
              meta: { title: "更新站点信息" },
            },
          ],
        },
        {
          path: "/notice",
          component: NoticeList,
          meta: { title: "公告" },
          children: [
            {
              path: "/notice/create",
              component: CreateNotice,
              meta: { title: "创建公告" },
            },
            {
              path: "/notice/detail/:noticeId",
              component: NoticeDetail,
              meta: { title: "公告详情" },
            },
            {
              path: "/notice/edit/:noticeId",
              component: EditNotice,
              meta: { title: "更新公告" },
            },
          ],
        },
        {
          path: "/busroute",
          component: RouteList,
          meta: { title: "线路" },
          children: [
            {
              path: "/busroute/create",
              component: CreateRoute,
              meta: { title: "创建线路" },
            },
            {
              path: "/busroute/edit/:routeId",
              component: EditRoute,
              meta: { title: "更新线路" },
              children: [
                {
                  path: "/busroute/edit/nodeList/:routeId",
                  component: ManageRouteNode,
                  meta: { title: "管理节点" },
                },
              ],
            },
          ],
        },
        {
          path: "/issue",
          component: IssueList,
          meta: { title: "留言" },
          children: [
            {
              path: "/issue/message/:issueId",
              component: Message,
              meta: { title: "消息" },
            },
          ],
        },
      ],
    },
  ],
});

// 挂载路由前置守卫
router.beforeEach((to, from, next) => {
  //首先判断用户是否已经登录
  const token = JSON.parse(window.sessionStorage.getItem("token"));
  if (to.path !== "/login") {
    if (token) {
      //登录成功
      if (to.path.includes("admin")) {
        if (store.state.currentAdminInfo.power === 3) {
          next();
        } else router.push(`${from.path}`);
      } else if (to.path.includes("issue")) {
        if (
          store.state.currentAdminInfo.power === 1 ||
          store.state.currentAdminInfo.power === 3
        ) {
          next();
        } else router.push(`${from.path}`);
      } else if (to.path.includes("notice")) {
        if (store.state.currentAdminInfo.power === 3) {
          next();
        } else router.push(`${from.path}`);
      } else {
        next();
      }
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
