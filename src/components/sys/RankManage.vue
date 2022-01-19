<template>
  <div class="rankManage">
    <el-input v-model="professionalTitle.name" placeholder="+ 添加职称..." style="width: 300px;margin-right: 8px"/>
    <el-select v-model="professionalTitle.titleLevel" class="m-2" placeholder="选择级别" size="large">
      <el-option
          v-for="item in professionalTitleList"
          :key="item"
          :label="item"
          :value="item"
      >
      </el-option>
    </el-select>
    <el-button type="primary" style="margin-left: 10px" @click="addJobLevel()">+ 添加</el-button>
    <el-table :data="professionalTitles" border style="width: 100%;margin-top: 8px">
      <el-table-column prop="id" label="编号" width="55"/>
      <el-table-column prop="name" label="职称名称" width="180"/>
      <el-table-column prop="titleLevel" label="职称级别" width="180"/>
      <el-table-column prop="createDate" label="创建时间" width="200"/>
      <el-table-column prop="enabled" label="是否启用" width="150">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
          <el-tag type="danger" v-else>未启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" type="primary" @click="showEditDialog(scope.row)">Edit</el-button>
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        v-model="dialogVisible"
        title="Edit Position"
        width="30%"
    >
      <table>
        <tr>
          <td>
            <el-tag class="mx-1" size="large">职称名称</el-tag>
          </td>
          <td>
            <el-input size="small" style="width: 180px; margin-left: 8px" v-model="updateJobLevel.name"></el-input>
            <br>
          </td>
        </tr>
        <tr>
          <td>
            <el-tag class="mx-1" size="large">职称级别</el-tag>
          </td>
          <td>
            <el-select v-model="updateJobLevel.titleLevel" class="m-2" placeholder="选择级别" style="margin-left: 8px"
                       size="small">
              <el-option
                  v-for="item in professionalTitleList"
                  :key="item"
                  :label="item"
                  :value="item"
              >
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>
            <el-tag class="mx-1" size="large">是否启用</el-tag>
          </td>
          <td>
            <el-switch
                v-model="updateJobLevel.enabled"
                size="large"
                active-text="启用"
                inactive-text="禁用"
                style="margin-left: 8px"
            />
          </td>
        </tr>
      </table>
      <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="handleEdit"
        >Confirm</el-button
        >
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {getRequest, jsonPost, deleteRequest, putRequest} from "../../network/post/postRequest";
import {onMounted, reactive, toRefs} from "vue";
import {ElMessageBox} from "element-plus";

export default {
  name: "ProfessionalTitleManage",
  setup() {
    const data = reactive({
      professionalTitle: {
        name: '',
        titleLevel: ''
      },
      professionalTitleList: [
        '正高级',
        '副高级',
        '中级',
        '初级',
        '员级'
      ],
      professionalTitles: [],
      updateJobLevel: {
        id: '',
        name: '',
        titleLevel: '',
        enabled:''
      },
      dialogVisible: false
    });

    const initial = () => {
      getRequest('/system/basic/joblevel/').then(resp => {
        if (resp) {
          data.professionalTitles = resp;
        }
      })
    }

    const addJobLevel = () => {
      if (data.professionalTitle.name && data.professionalTitle.titleLevel) {
        jsonPost('/system/basic/joblevel/', data.professionalTitle).then(resp => {
          if (resp) {
            initial();
            data.professionalTitle.name = '';
            data.professionalTitle.level = '';
          }
        })
      } else {
        ElMessageBox({message: "请填写数据", type: "error"})
      }
    }

    const handleDelete = (index, data) => {
      console.log(index);
      deleteRequest('/system/basic/joblevel/' + data.id).then(resp => {
        if (resp) {
          initial();
        }
      })
    }

    const showEditDialog = (param) => {
      Object.assign(data.updateJobLevel, param)
      data.dialogVisible = true
    }

    const handleEdit = () => {
      console.log(data.updateJobLevel)
      putRequest('/system/basic/joblevel/', data.updateJobLevel).then(resp => {
        if (resp) {
          data.dialogVisible = false
          initial()
          data.updateJobLevel.name = ''
          data.updateJobLevel.titleLevel = ''
        }
      })
    }

    onMounted(initial)

    return {
      ...toRefs(data),
      addJobLevel,
      handleDelete,
      showEditDialog,
      handleEdit
    }
  }
}
</script>

<style scoped>

</style>