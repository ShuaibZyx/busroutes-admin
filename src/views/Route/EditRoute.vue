<template>
  <el-card shadow="never" v-if="$route.path === '/busroute/edit/' + routeId">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="更新线路" />
    </div>
    <div class="editRoute">
      <div class="common">
        <div class="title">
          <span>更新线路基本信息:</span>
          <div>
            <el-button type="info" size="small" @click="resetForm()">
              重置
            </el-button>
            <el-button type="primary" size="small" @click="editRoute">
              更新
            </el-button>
          </div>
        </div>
        <el-form
          ref="form"
          :model="route"
          :rules="routeRules"
          label-width="auto"
        >
          <el-form-item label="公交名称:" prop="busId">
            <el-autocomplete
              placeholder="公交名称"
              v-model="queryInfo"
              :fetch-suggestions="searchBusSuggest"
              class="input-with-select"
              size="small"
              clearable
              autocomplete="on"
              value-key="busInfo"
              :debounce="200"
              @change="route.busId = ''"
              @select="handOwnerSelect"
              style="width: 100%"
            >
              <i class="el-icon-truck" slot="prefix" />
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="起始节点次序" prop="startSequence">
            <el-select
              v-model="route.startSequence"
              filterable
              size="small"
              clearable
              placeholder="起始节点次序"
              style="width: 100%"
            >
              <el-option
                v-for="item in route.routeNodeList"
                :key="item.routeNodeId"
                :label="
                  item.currentStation.stationName + '(' + item.sequence + ')'
                "
                :value="item.sequence"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终止节点次序" prop="endSequence">
            <el-select
              v-model="route.endSequence"
              filterable
              size="small"
              clearable
              placeholder="终止节点次序"
              style="width: 100%"
            >
              <el-option
                v-for="item in route.routeNodeList.filter(
                  (routeNode) => routeNode.sequence >= route.startSequence
                )"
                :key="item.routeNodeId"
                :label="
                  item.currentStation.stationName + '(' + item.sequence + ')'
                "
                :value="item.sequence"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="乘车花费:" prop="cost">
            <el-input
              v-model.number="route.cost"
              type="number"
              max="10"
              size="small"
              clearable
              placeholder="乘车花费"
            >
              <i slot="suffix">元</i>
            </el-input>
          </el-form-item>
          <el-form-item label="运行时间:" prop="timeRange">
            <el-time-picker
              is-range
              v-model="route.timeRange"
              range-separator="至"
              start-placeholder="发车时间"
              end-placeholder="收车时间"
              placeholder="请选择时间范围"
              value-format="HH:mm:ss"
              clearable
              size="small"
              align="center"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="发车间隔:" prop="busInterval">
            <el-input
              v-model.number="route.busInterval"
              type="number"
              min="5"
              max="20"
              size="small"
              clearable
              placeholder="发车间隔(分钟)"
            >
              <i slot="suffix">分钟</i>
            </el-input>
          </el-form-item>
          <el-form-item label="线路类型:">
            <el-checkbox v-model="route.isNight">夜间行车</el-checkbox>
            <el-checkbox v-model="route.isCircle">环线行驶</el-checkbox>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button
            type="primary"
            size="small"
            @click="$router.push('/busroute/edit/nodeList/' + routeId)"
            >管理线路节点</el-button
          >
        </div>
      </div>
    </div>
  </el-card>

  <router-view v-else />
</template>

<script>
import citys from "../../assets/js/citys";
export default {
  name: "EditRoute",
  data() {
    return {
      //线路表单
      route: {
        busId: "",
        bus: {},
        cost: 1,
        timeRange: [],
        busInterval: 5,
        isNight: false,
        isCircle: false,
        startSequence: 0,
        endSequence: 0,
        routeNodeList: [],
      },
      //更新线路表单验证规则
      routeRules: {
        busId: [
          {
            required: true,
            message: "线路公交信息不可为空",
            trigger: ["blur", "change"],
          },
        ],
        cost: [
          {
            required: true,
            message: "线路价格不可为空",
            trigger: "blur",
          },
          {
            type: "number",
            min: 1,
            max: 10,
            message: "乘车花费应在1~10元之间",
            trigger: ["blur", "change"],
          },
        ],
        timeRange: [
          {
            required: true,
            message: "运行时间不可为空",
            trigger: "blur",
          },
        ],
        busInterval: [
          {
            required: true,
            message: "发车间隔不可为空",
            trigger: ["blur", "change"],
          },
          {
            type: "number",
            min: 5,
            max: 20,
            message: "发车间隔应在5~20分钟之间",
            trigger: ["blur", "change"],
          },
        ],
      },
      queryInfo: "",
      citys,
    };
  },
  computed: {
    routeId() {
      return this.$route.params.routeId;
    },
  },
  watch: {
    $route() {
      this.getRouteDetailById();
    },
  },
  methods: {
    //获取当前线路的详细信息
    async getRouteDetailById() {
      const { data: routeDetailRes } = await this.$axios.get(
        "route/info/" + this.routeId
      );
      this.queryInfo = `${routeDetailRes.data.bus?.busName}(${this.cityFormat(
        routeDetailRes.data.bus?.cityCode
      )})`;
      routeDetailRes.data.timeRange = routeDetailRes.data.timeRange.split("-");
      this.route = routeDetailRes.data;
    },

    //更新线路
    editRoute() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.route.timeRange = this.route.timeRange.join("-");
        const { data: editRouteRes } = await this.$axios.post(
          "route/modify/baseInfo",
          this.route
        );
        this.resetForm();
        this.$message({
          message: editRouteRes.msg,
          type: `${editRouteRes.code !== 200 ? "error" : "success"}`,
          center: true,
        });
      });
    },

    //重置表单
    resetForm() {
      this.$refs.form.resetFields();
      this.getRouteDetailById();
    },

    //根据条件获得公交车信息列表
    async searchBusSuggest(queryString, callback) {
      //定义一个空数组
      var list = [];
      const { data: busListRes } = await this.$axios.get("bus/search", {
        params: {
          busName: queryString,
        },
      });
      //如果获取搜索条件成功，则将条件名推入下拉框数组中
      if (busListRes.code === 200) {
        busListRes.data.forEach((bus) => {
          list.push({
            value: bus.busId,
            busInfo: `${bus.busName}(${this.cityFormat(bus.cityCode)})`,
          });
        });
      }
      callback(list);
    },

    //处理选中公交的方法
    handOwnerSelect(bus) {
      this.route.busId = bus.value;
    },

    //城市字符串格式转换
    cityFormat(cityString) {
      var cityArr = cityString === undefined ? [] : cityString.split("-");
      //将所需要的城市编码信息列出来
      const location = cityArr;
      const locationProvince = location[0];
      const locationCity = location[1];
      const locationArea = location[2];
      //更新数组保存查询到的数组，减少查询次数
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
    },
  },
  mounted() {
    this.getRouteDetailById();
  },
};
</script>

<style lang="less">
.editRoute {
  display: flex;
  flex-direction: column;
  align-items: center;
  .common {
    width: 50%;
    height: auto;
    padding: 10px;
    .el-form {
      margin-top: 10px;
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      font-size: 1em;
    }
    .btns {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
