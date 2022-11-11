<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="更新站点信息" />
    </div>
    <div class="editStation">
      <div class="common">
        <div class="title">
          <span>请输入新的站点信息:</span>
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
              placeholder="站点状态"
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
          <el-button type="info" size="small" @click="resetStationInfo">
            重置
          </el-button>
          <el-button type="primary" size="small" @click="editStation">
            更新
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import citys from "../../assets/js/citys";
export default {
  name: "EditStation",
  data() {
    return {
      //站点表单
      station: {
        stationName: "",
        state: true,
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
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,15}$/,
            message: "长度在 1 到 15 个数字,中文或字母",
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
        { label: "可用", value: true },
        { label: "停用", value: false },
      ],
      //城市列表
      citys,
    };
  },
  computed: {
    stationId() {
      return this.$route.params.stationId;
    },
  },
  methods: {
    //获取站点信息
    async getStationInfoById() {
      const { data: stationInfoRes } = await this.$axios.get(
        "station/info/" + this.stationId
      );
      stationInfoRes.data.cityCode = stationInfoRes.data.cityCode.split("-");
      this.station = stationInfoRes.data;
    },

    //重置站点原有信息
    resetStationInfo() {
      this.$refs.form.resetFields();
      this.getStationInfoById();
    },

    //更新站点信息
    editStation() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.station.cityCode = this.station.cityCode?.join("-");
        const { data: editStationRes } = await this.$axios.post(
          "station/modify",
          this.station
        );
        this.resetStationInfo();
        this.$message({
          message: editStationRes.msg,
          type: `${editStationRes.code !== 200 ? "error" : "success"}`,
          center: true,
        });
      });
    },
  },
  mounted() {
    this.getStationInfoById();
  },
};
</script>

<style lang="less">
.editStation {
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
