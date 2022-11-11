<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="管理节点" />
      <el-button type="primary" size="mini" @click="addRouteNodeVisiable = true"
        >添加节点</el-button
      >
    </div>
    <div class="manageRoute">
      <el-table
        :data="route.routeNodeList"
        fit
        border
        stripe
        :highlight-current-row="true"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="站点名称" align="center">
          <template v-slot="scope">
            <el-tooltip
              effect="light"
              :content="'节点编号:' + scope.row.routeNodeId.toString()"
              placement="top"
            >
              <span> {{ scope.row.currentStation?.stationName }} </span>
            </el-tooltip>
            <el-tag
              v-if="scope.row.sequence === route.startSequence"
              size="mini"
              type="primary"
              style="margin-left: 5px"
              >始发站</el-tag
            >
            <el-tag
              v-if="scope.row.sequence === route.endSequence"
              size="mini"
              type="info"
              style="margin-left: 5px"
              >终点站</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="相对次序" align="center">
          <template v-slot="scope">
            <el-tooltip effect="light" content="点击修改" placement="top">
              <el-link
                type="primary"
                class="checklink"
                @click="modifySequence(scope.row.routeNodeId)"
              >
                {{ scope.row.sequence }}
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="下一站" align="center">
          <template slot-scope="scope">
            {{ scope.row.nextStation?.stationName }}
          </template>
        </el-table-column>
        <el-table-column label="站间距离" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="点击修改" placement="top">
              <el-link
                type="primary"
                class="checklink"
                @click="modifyDistance(scope.row.routeNodeId)"
                >{{ scope.row.distance }}米</el-link
              >
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-if="scope.row.sequence !== route.startSequence"
              @click="
                modifyRouteStartSequenceOrEndSequence(
                  scope.row.sequence,
                  'start'
                )
              "
              >设置始发</el-button
            >
            <el-button
              type="info"
              size="mini"
              v-if="
                scope.row.sequence !== route.endSequence &&
                scope.row.sequence >= route.startSequence
              "
              @click="
                modifyRouteStartSequenceOrEndSequence(scope.row.sequence, 'end')
              "
              >设置终点</el-button
            >
            <el-popconfirm
              confirm-button-text="是滴"
              cancel-button-text="点错了"
              icon="el-icon-warning"
              icon-color="red"
              title="确定删除该节点?"
              @confirm="deleteRouteNodeById(scope.row.routeNodeId)"
              style="margin-left: 10px"
            >
              <el-button slot="reference" size="mini" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加节点的dialog -->
      <el-dialog
        :visible.sync="addRouteNodeVisiable"
        width="40%"
        :close-on-click-modal="false"
        @close="resetAddRouteNodeForm"
        custom-class="addRouteNodeDialog"
      >
        <div slot="title" class="icon_title">
          <i class="el-icon-plus"></i>
          <span> 添加节点</span>
        </div>
        <el-form
          :model="routeNodeForm"
          label-width="auto"
          ref="addRouteNodeFormRef"
          :rules="addRouteNodeFormRules"
        >
          <el-form-item label="站点信息:" prop="stationId">
            <el-autocomplete
              placeholder="公交名称"
              v-model="currentStationQueryInfo"
              :fetch-suggestions="searchStationSuggest"
              size="small"
              clearable
              autocomplete="on"
              value-key="stationInfo"
              :debounce="200"
              @change="routeNodeForm.routeId = ''"
              @select="handCurrentStationSelect"
              style="width: 100%"
            >
              <i class="el-icon-guide" slot="prefix" />
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="下一站:" prop="nextStationId">
            <el-autocomplete
              placeholder="公交名称"
              v-model="nextStationQueryInfo"
              :fetch-suggestions="searchStationSuggest"
              size="small"
              clearable
              autocomplete="on"
              value-key="stationInfo"
              :debounce="200"
              @change="routeNodeForm.nextStationId = ''"
              @select="handNextStationSelect"
              style="width: 100%"
            >
              <i class="el-icon-guide" slot="prefix" />
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="站间距离:" prop="distance">
            <el-input
              v-model.number="routeNodeForm.distance"
              type="number"
              min="100"
              max="5000"
              size="small"
              clearable
              placeholder="站间距离"
            >
              <i slot="suffix">米</i>
            </el-input>
          </el-form-item>
          <el-form-item label="相对次序:" prop="sequence">
            <el-input
              v-model.number="routeNodeForm.sequence"
              type="number"
              size="small"
              clearable
              placeholder="相对次序"
            >
              <i slot="suffix" class="el-icon-set-up">(默认/自行填入)</i>
            </el-input>
          </el-form-item>
          <span style="color: red"
            >当前线路可选的相对次序有:{{
              choose.length > 0 ? choose.join(",") + "以及" : ""
            }}大于等于{{ originalArr[originalArr.length - 1] + 1 || 0 }}</span
          >
        </el-form>
        <div slot="footer">
          <el-button size="small" @click="addRouteNodeVisiable = false"
            >取 消</el-button
          >
          <el-button type="primary" size="small" @click="addRouteNode"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "ManageRouteNode",
  data() {
    return {
      //节点列表
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
      //添加节点的diallog可见性
      addRouteNodeVisiable: false,
      //线路节点表单
      routeNodeForm: {
        routeId: "",
        stationId: "",
        nextStationId: "",
        distance: 500,
        sequence: "",
      },
      addRouteNodeFormRules: {
        stationId: [
          {
            required: true,
            message: "站点信息不可为空",
            trigger: ["blur", "change"],
          },
        ],
        nextStationId: [
          {
            required: true,
            message: "下一信息不可为空",
            trigger: ["blur", "change"],
          },
        ],
        distance: [
          {
            required: true,
            message: "站间距离不可为空",
            trigger: "blur",
          },
          {
            type: "number",
            min: 100,
            max: 5000,
            message: "站间距离应在100~5000米之间",
            trigger: ["blur", "change"],
          },
        ],
        sequence: [
          {
            required: true,
            message: "站点次序不可为空",
            trigger: "blur",
          },
          { validator: this.sequenceIsExist, trigger: ["blur", "change"] },
        ],
      },
      //当前站点搜索条件
      currentStationQueryInfo: "",
      //下一站点搜索条件
      nextStationQueryInfo: "",
    };
  },
  computed: {
    //线路编号
    routeId() {
      return this.$route.params.routeId;
    },

    //此时已经存在的次序
    originalArr() {
      var nodeList = this.route.routeNodeList;
      var originalArr = [];
      for (let q = 0; q < nodeList.length; q++) {
        originalArr.push(nodeList[q].sequence);
      }
      this.routeNodeForm.sequence = originalArr[originalArr.length - 1] + 1;
      return originalArr;
    },

    //可选的相对次序
    choose() {
      var nodeList = this.route.routeNodeList;
      var k = 0;
      var start = nodeList[0]?.sequence;
      var end = nodeList[nodeList.length - 1]?.sequence;
      var choose = [];
      for (
        let i = start;
        i <= end && k < nodeList.length - 1;
        i = nodeList[++k]?.sequence
      ) {
        for (let j = 0; j <= i; j++) {
          if (!choose.includes(j) && !this.originalArr.includes(j))
            choose.push(j);
        }
      }
      return choose;
    },
  },
  methods: {
    //获取当前线路的详细信息
    async getRouteDetailById() {
      const { data: routeDetailRes } = await this.$axios.get(
        "route/info/" + this.routeId
      );
      this.route = routeDetailRes.data;
    },

    //根据条件获取车站信息列表
    async searchStationSuggest(queryString, callback) {
      //定义一个空数组
      var list = [];
      const { data: stationListRes } = await this.$axios.get("station/search", {
        params: {
          stationName: queryString,
          cityCode: this.route.bus?.cityCode,
        },
      });
      //如果获取搜索条件成功，则将条件名推入下拉框数组中
      if (stationListRes.code === 200) {
        stationListRes.data.forEach((station) => {
          if (
            station.stationId !== this.routeNodeForm.nextStationId &&
            station.stationId !== this.routeNodeForm.stationId
          ) {
            list.push({
              value: station.stationId,
              stationInfo: station.stationName,
            });
          }
        });
      }
      callback(list);
    },

    //处理选中当前车站信息的方法
    handCurrentStationSelect(station) {
      this.routeNodeForm.stationId = station.value;
    },

    //处理选中下一车站信息的方法
    handNextStationSelect(station) {
      this.routeNodeForm.nextStationId = station.value;
    },

    //重置添加线路节点的方法
    resetAddRouteNodeForm() {
      this.currentStationQueryInfo = "";
      this.nextStationQueryInfo = "";
      this.$refs.addRouteNodeFormRef.resetFields();
    },

    //检测该次序是否可选
    sequenceIsExist(rule, value, callback) {
      if (this.route.routeNodeList.length > 0) {
        if (this.originalArr.includes(value)) {
          callback(
            new Error(
              `可选次序为` +
                (this.choose.length > 0 ? `${this.choose.join(",")}以及` : "") +
                `大于等于${
                  parseInt(this.originalArr[this.originalArr.length - 1] + 1) ||
                  0
                }`
            )
          );
        } else {
          callback();
        }
      }
    },

    //添加一个站点
    addRouteNode() {
      this.$refs.addRouteNodeFormRef.validate(async (valid) => {
        if (!valid) return;
        this.routeNodeForm.routeId = this.routeId;
        const { data: addNodeRes } = await this.$axios.post(
          "routeNode/create",
          this.routeNodeForm
        );
        this.addRouteNodeVisiable = false;
        this.getRouteDetailById();
        this.$message({
          message: addNodeRes.msg,
          type: `${addNodeRes.code !== 200 ? "error" : "success"}`,
          center: true,
        });
      });
    },

    //删除一个站点
    async deleteRouteNodeById(routeNodeId) {
      const { data: deleteRouteNodeRes } = await this.$axios.delete(
        "routeNode/remove/" + routeNodeId
      );
      this.getRouteDetailById();
      this.$message({
        message: deleteRouteNodeRes.msg,
        type: `${deleteRouteNodeRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },

    //修改站点之间的距离
    async modifyDistance(routeNodeId) {
      this.$prompt("请输入站间距离", "修改站间距离", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[1-9][0-9][0-9]$|^[1-4][0-9][0-9]\d$|5000/,
        inputErrorMessage: "输入的距离有误",
        center: true,
        inputType: "number",
        closeOnClickModal: false,
        inputPlaceholder: "请输入站间距离",
      })
        .then(async ({ value }) => {
          var formdata = new FormData();
          formdata.append("routeNodeId", routeNodeId);
          formdata.append("distance", value);
          const { data: modifyDistanceRes } = await this.$axios.put(
            "routeNode/modify/distance",
            formdata
          );
          if (modifyDistanceRes.code === 200) this.getRouteDetailById();
          this.$message({
            center: true,
            message: modifyDistanceRes.msg,
            type: `${modifyDistanceRes.code !== 200 ? "error" : "success"}`,
            showClose: true,
          });
        })
        .catch(() => {});
    },

    //修改节点相对次序
    async modifySequence(routeNodeId) {
      this.$prompt("请输入节点相对次序", "修改相对次序", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: (value) => {
          if (this.route.routeNodeList.length > 0) {
            if (this.originalArr.includes(parseInt(value))) {
              return (
                `可选次序为` +
                (this.choose.length > 0 ? `${this.choose.join(",")}以及` : "") +
                `大于等于${
                  parseInt(this.originalArr[this.originalArr.length - 1] + 1) ||
                  0
                }`
              );
            }
          } else {
            return true;
          }
        },
        inputErrorMessage: "相对次序无效",
        center: true,
        inputType: "number",
        closeOnClickModal: false,
        inputPlaceholder: "请输入节点相对次序",
      })
        .then(async ({ value }) => {
          var formdata = new FormData();
          formdata.append("routeNodeId", routeNodeId);
          formdata.append("sequence", value);
          const { data: modifySequenceRes } = await this.$axios.put(
            "routeNode/modify/sequence",
            formdata
          );
          if (modifySequenceRes.code === 200) this.getRouteDetailById();
          this.$message({
            center: true,
            message: modifySequenceRes.msg,
            type: `${modifySequenceRes.code !== 200 ? "error" : "success"}`,
            showClose: true,
          });
        })
        .catch(() => {});
    },

    //设置始发站或终点站
    async modifyRouteStartSequenceOrEndSequence(sequence, type) {
      var path = type === "start" ? "startSequence" : "endSequence";
      var formdata = new FormData();
      formdata.append(path, sequence);
      const { data: result } = await this.$axios.put(
        "route/modify/" + path + "/" + this.routeId,
        formdata
      );
      if (result.code === 200) this.route[`${path}`] = sequence;
      this.$message({
        center: true,
        message: result.msg,
        type: `${result.code !== 200 ? "error" : "success"}`,
        showClose: true,
      });
    },
  },
  mounted() {
    this.getRouteDetailById();
  },
};
</script>

<style lang="less">
.addRouteNodeDialog {
  border-radius: 10px !important;
  .icon_title {
    font-weight: bold;
    margin-top: 20px;
  }
}
</style>
