<template>
  <div class="department-area">
    <el-input v-model="filterText" placeholder="请输入部门名进行搜索"/>
    <el-tree
        ref="treeRef"
        class="filter-tree"
        :data="allDepartment"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span class="dep-operate">
            <el-button class="dep-btn" type="primary" size="mini" @click="showAddDepView(data)">添加部门</el-button>
            <el-button class="dep-btn" type="danger" size="mini" @click="remove(node, data)">删除部门</el-button>
          </span>
        </span>
      </template>
    </el-tree>

    <el-dialog v-model="addDepDialogVisible" title="新增部门" width="400px">
      <el-form :model="newDepData">
        <el-form-item label="部门名称">
          <el-input size="mini" v-model="newDepData.name" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          是否启用:<el-switch
              v-model="newDepData.enable"
              size="large"
              active-text="启用"
              inactive-text="禁用"
              style="margin-left: 8px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addDepartment">确认</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {onMounted, reactive, toRefs} from 'vue'
import {getRequest, jsonPost, deleteRequest} from "../../network/post/postRequest";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "DepManager",
  setup() {
    const data = reactive({
      filterText: '',
      allDepartment: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      addDepDialogVisible: false,
      newDepData: {
        parentId: '',
        name:'',
        enable: false,
      }
    });

    function initDepList(){
      getRequest('/system/basic/dep/').then(resp => {
        if (resp) {
          data.allDepartment = resp;
        }
      })
    }

    onMounted(() => {
      initDepList();
    });

    return {
      ...toRefs(data),
      initDepList
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.includes(value)
    },
    showAddDepView(data) {
      this.addDepDialogVisible = true
      this.newDepData.parentId = data.id
    },
    remove(node, data) {
      console.log(data);
      ElMessageBox.confirm(
          '你确定要删除['+data.name+']吗？',
          'Warning',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'danger',
          }
      )
          .then(() => {
            deleteRequest("/system/basic/dep/delete/" + data.id).then(resp => {
              if (resp) {
                this.initDepList();
              }
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '操作取消',
            })
          })
    },
    addDepartment(){
      console.log(this.newDepData);
      jsonPost('/system/basic/dep/add',this.newDepData).then(resp => {
        if (resp){
          this.addDepDialogVisible = false;
          this.initDepList();
          this.newDepData.enable = false;
          this.newDepData.name = '';
        }
      })
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val);
    }
  }
}
</script>

<style scoped>
.department-area {
  width: 700px;
}

.custom-tree-node {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.dep-btn {
  padding: 1px;
}

.dep-operate > button {
  min-height: 22px !important;
}
</style>