<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="创建公交" />
    </div>
    <div class="createBus">
      <div class="common">
        <div class="title">
          <span>请输入公交信息:</span>
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
          <el-button type="info" size="small" @click="$refs.form.resetFields()">
            重置
          </el-button>
          <el-button type="primary" size="small" @click="createBus">
            创建
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import citys from "../../assets/js/citys";
export default {
  name: "CreateBus",
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
  methods: {
    //创建公交
    createBus() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.bus.cityCode = this.bus.cityCode?.join("-");
        const { data: createBusRes } = await this.$axios.post(
          "bus/create",
          this.bus
        );
        this.$refs.form.resetFields();
        this.$message({
          message: createBusRes.msg,
          type: `${createBusRes.code !== 200 ? "error" : "success"}`,
          center: true,
        });
      });
    },
  },
};
</script>

<style lang="less">
.createBus {
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
