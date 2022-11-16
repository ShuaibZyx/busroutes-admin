<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="更新公交信息" />
    </div>
    <div class="editBus">
      <div class="common">
        <div class="title">
          <span>请输入新的公交信息:</span>
        </div>
        <el-form ref="form" :model="bus" :rules="busRules" label-width="auto">
          <el-form-item label="公交名称:" prop="busName">
            <el-input
              v-model="bus.busName"
              size="small"
              maxlength="15"
              clearable
              placeholder="请输入公交名称"
            />
          </el-form-item>
          <el-form-item label="所在城市:" prop="cityCode">
            <el-cascader
              style="width: 100%"
              v-model="bus.cityCode"
              :options="citys"
              size="small"
              filterable
              clearable
              :props="{ expandTrigger: 'hover' }"
            />
          </el-form-item>
          <el-form-item label="公交类型:" prop="type">
            <el-select
              v-model="bus.type"
              filterable
              size="small"
              clearable
              placeholder="公交类型"
              style="width: 100%"
            >
              <el-option
                v-for="item in busType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button type="info" size="small" @click="resetBusInfo">
            重置
          </el-button>
          <el-button type="primary" size="small" @click="editBus">
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
  name: "EditBus",
  data() {
    return {
      //公交表单
      bus: {
        busName: "",
        type: 1,
        cityCode: "",
      },
      //创建公交表单验证规则
      busRules: {
        busName: [
          {
            required: true,
            message: "公交名称不可为空",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9-\u4e00-\u9fa5]{1,15}$/,
            message: "长度在 1 到 15 个数字,中文或字母",
            trigger: ["blur", "change"],
          },
        ],
        cityCode: [
          { required: true, message: "请选择公交所在城市", trigger: "blur" },
        ],
        type: [
          {
            required: true,
            message: "请选择公交类型",
            trigger: ["blur", "change"],
          },
        ],
      },
      //可供选择的权限角色列表
      busType: [
        { label: "单层公交", value: 1 },
        { label: "双层公交", value: 2 },
        { label: "铰接式公交", value: 3 },
      ],
      //城市列表
      citys,
    };
  },
  computed: {
    busId() {
      return this.$route.params.busId;
    },
  },
  methods: {
    //获取公交信息
    async getBusInfoById() {
      const { data: busInfoRes } = await this.$axios.get(
        "bus/info/" + this.busId
      );
      busInfoRes.data.cityCode = busInfoRes.data.cityCode.split("-");
      this.bus = busInfoRes.data;
    },

    //重置公交原有信息
    resetBusInfo() {
      this.$refs.form.resetFields();
      this.getBusInfoById();
    },

    //更新公交信息
    editBus() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.bus.cityCode = this.bus.cityCode?.join("-");
        const { data: editBusRes } = await this.$axios.post(
          "bus/modify",
          this.bus
        );
        this.resetBusInfo();
        this.$message({
          message: editBusRes.msg,
          type: `${editBusRes.code !== 200 ? "error" : "success"}`,
          center: true,
        });
      });
    },
  },
  mounted() {
    this.getBusInfoById();
  },
};
</script>

<style lang="less">
.editBus {
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
