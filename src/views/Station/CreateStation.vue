<template>
  <div class="createStation">
    <el-page-header @back="$router.back()" content="创建站点" />
    <div class="common">
      <div class="title">
        <span>请输入站点信息:</span>
      </div>
      <el-form
        ref="form"
        :model="station"
        :rules="stationRules"
        label-width="auto"
      >
        <el-form-item label="站点名称:" prop="stationName">
          <el-input
            v-model="station.stationName"
            size="small"
            maxlength="30"
            clearable
            placeholder="请输入站点名称"
          />
        </el-form-item>
        <el-form-item label="所在城市:" prop="cityCode">
          <el-cascader
            style="width: 100%"
            v-model="station.cityCode"
            :options="citys"
            size="small"
            filterable
            clearable
            :props="{ expandTrigger: 'hover' }"
          />
        </el-form-item>
        <el-form-item label="站点状态:" prop="state">
          <el-select
            v-model="station.state"
            filterable
            size="small"
            clearable
            placeholder="站点类型"
            style="width: 100%"
          >
            <el-option
              v-for="item in stationState"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="info" size="small" @click="$refs.form.resetFields()">
          重置
        </el-button>
        <el-button type="primary" size="small" @click="createStation">
          创建
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import citys from "../../assets/js/citys";
export default {
  name: "CreateStation",
  data() {
    return {
      //站点表单
      station: {
        stationName: "",
        state: 1,
        cityCode: "",
      },
      //创建站点表单验证规则
      stationRules: {
        stationName: [
          {
            required: true,
            message: "站点名称不可为空",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,30}$/,
            message: "长度在 1 到 30 个数字,中文或字母",
            trigger: ["blur", "change"],
          },
        ],
        cityCode: [
          { required: true, message: "请选择站点所在城市", trigger: "blur" },
        ],
        state: [
          {
            required: true,
            message: "请选择站点状态",
            trigger: ["blur", "change"],
          },
        ],
      },
      //可供选择的站点状态
      stationState: [
        { label: "可用", value: 1 },
        { label: "停用", value: 0 },
      ],
      //城市列表
      citys,
    };
  },
  methods: {
    //创建站点
    createStation() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.station.cityCode = this.station.cityCode?.join("-");
        const { data: createStationRes } = await this.$axios.post(
          "station/create",
          this.station
        );
        this.$refs.form.resetFields();
        this.$message({
          message: createStationRes.msg,
          type: `${createStationRes.code !== 200 ? "error" : "success"}`,
          center: true,
        });
      });
    },
  },
};
</script>

<style lang="less">
.createStation {
  width: 99%;
  height: auto;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .common {
    width: 50%;
    height: auto;
    .el-form {
      margin-top: 10px;
    }
    .title {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 1em;
      margin-top: 10px;
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
