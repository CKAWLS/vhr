<template>
  <div>
    <el-row>
      <el-col
          v-for="(hr, index) in HrList"
          :key="index"
          :span="8"
          :offset="index > 0 ? 3 : 0"
          class="hr-col"
      >
        <el-card :body-style="{ padding: '0px' }">
          <el-avatar class="hr-avatar" :size="200" fit="fill" :src="hr.userface"/>
          <div style="padding: 14px">
            姓名:<span>{{ hr.name }}</span><br>
            电话:<span>{{ hr.phone }}</span><br>
            地址:<span>{{ hr.address }}</span><br>
            是否启用:
            <el-switch
                v-model="hr.enabled"
                size="large"
                active-text="启用"
                inactive-text="禁用"
                style="margin-left: 8px"
            />
            <br>
            角色:
            <el-tag
                v-for="(role,index) in hr.roles"
                :key="index"
                class="mx-1"
                closable
                type="success"
                style="margin-right: 3px">
              {{ role.nameZh }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getRequest} from "../../network/post/postRequest";
import {onMounted, reactive, toRefs} from "vue";

export default {
  name: "HrManage",
  setup() {
    const data = reactive({
      HrList: []
    });

    const initial = () => {
      getRequest('/system/basic/hr/').then(resp => {
        if (resp) {
          data.HrList = resp;
        }
      })
    }

    onMounted(() => {
      initial();
    })

    return {
      ...toRefs(data)
    }
  }
}
</script>

<style scoped>
.el-row {
  padding: 0 30px;
}

.hr-col {
  max-width: 300px;
  margin-bottom: 30px;
}

.hr-avatar {
  transform: translate(25%, 3%);
}
</style>