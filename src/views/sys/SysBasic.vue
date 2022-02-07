<template>
  <div class="system-basic">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="部门管理" name="部门管理">
        <DepManager></DepManager>
      </el-tab-pane>
      <el-tab-pane label="职位管理" name="职位管理">
        <PosManage></PosManage>
      </el-tab-pane>
      <el-tab-pane label="职称管理" name="职称管理">
        <RankManage></RankManage>
      </el-tab-pane>
      <el-tab-pane label="奖惩规则" name="奖惩规则"></el-tab-pane>
      <el-tab-pane label="权限组" name="权限组">
        <PerManage></PerManage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DepManager from "../../components/sys/DepManage";
import PosManage from "../../components/sys/PosManage";
import RankManage from "../../components/sys/RankManage";
import PerManage from "../../components/sys/PerManage";

export default {
  name: "SysBasic",
  components: {
    DepManager,
    PosManage,
    RankManage,
    PerManage
  },
  data() {
    return {
      activeName: '部门管理'
    }
  },
}
</script>

<style scoped>
.system-basic {
}
</style>