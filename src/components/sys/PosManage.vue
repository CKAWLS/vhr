<template>
  <div class="posManage">
    <div class="manageTop">
      <el-input v-model="pos.name" placeholder="+ 添加职位..." style="width: 400px"/>
      <el-button type="primary" style="margin-left: 10px" @click="addPosition(name)">+ 添加</el-button>
    </div>
    <div class="manageTable">
      <el-table :data="positions" border @selection-change="handleSelectionChange" style="width: 80%">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="编号" width="55"/>
        <el-table-column prop="name" label="职位名称" width="180"/>
        <el-table-column prop="createDate" label="创建时间" width="300"/>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" type="primary" @click="showEditDialog(scope.$index, scope.row)">Edit</el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
        v-model="dialogVisible"
        title="Edit Position"
        width="30%"
    >
      <el-tag class="mx-1" size="large">职位名称</el-tag>
      <el-input size="small" style="width: 180px; margin-left: 8px" v-model="updatePos.name"></el-input>
      <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="handleEdit"
        >Confirm</el-button
        >
      </span>
      </template>
    </el-dialog>
    <el-button class="delete-many-button" type="danger" :disabled="multipleSelection.length == 0" @click="deleteMany">
      批量删除
    </el-button>
  </div>
</template>

<script>
import {getRequest, jsonPost, deleteRequest, putRequest} from "../../network/post/postRequest";
import {onMounted, ref, reactive, toRefs} from "vue";
import {ElMessageBox, ElMessage} from "element-plus";

export default {
  name: "PosManage",
  props: {},
  setup() {
    const data = reactive({
      positions: [],
      pos: {
        name: ''
      }
    });

    function initPositions() {
      getRequest('/system/basic/pos/').then(resp => {
        data.positions = resp.obj;
      })
    }

    const addPosition = (name) => {
      if (data.pos.name) {
        jsonPost('/system/basic/pos/', data.pos).then(resp => {
          if (resp) {
            initPositions()
            data.pos.name = ''
          }
        })
      } else {
        ElMessageBox({message: "职位不可以为空", type: "error"})
      }
    }

    const handleDelete = (index, param) => {
      ElMessageBox.confirm(
          '确认要删除【' + param.name + '】职位吗',
          'Warning',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            deleteRequest('/system/basic/pos/' + param.id).then(resp => {
              if (resp) {
                initPositions()
                ElMessage({
                  type: 'success',
                  message: 'Delete completed',
                })
              }
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: 'Delete canceled',
            })
          })
    }

    onMounted(() => {
      initPositions();
    })

    return {
      ...toRefs(data),
      addPosition,
      handleDelete,
      initPositions
    }
  },
  data() {
    return {
      dialogVisible: false,
      updatePos: {
        name: ''
      },
      multipleSelection: ''
    }
  },
  methods: {
    showEditDialog(index, data) {
      Object.assign(this.updatePos, data)
      this.dialogVisible = true
    },
    handleEdit() {
      putRequest('/system/basic/pos/', this.updatePos).then(resp => {
        if (resp) {
          this.initPositions();
          this.updatePos.name = '';
          this.dialogVisible = false;
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteMany() {
      ElMessageBox.confirm(
          'Are you sure to delete these positions??',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'danger',
          }
      )
          .then(() => {
            let ids = '?'
            this.multipleSelection.forEach(item => {
              ids += 'ids=' + item.id + '&';
            })
            deleteRequest("/system/basic/pos/" + ids.slice(0, ids.length - 1)).then(resp => {
              if (resp) {
                this.initPositions();
              }
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: 'Delete canceled',
            })
          })
    }
  }
}
</script>

<style scoped>
.manageTop {
  margin-bottom: 20px;
}

.manageTable {

}

.delete-many-button {
  margin-top: 8px;
}
</style>