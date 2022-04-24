<template>
  <div>
    <div class="permission-head">
      <el-input v-model="role.name" placeholder="Please input the english name of the role">
        <template #prepend>ROLE_</template>
      </el-input>
      <el-input style="margin-left: 10px" v-model="role.nameZh"
                placeholder="Please input the chinese name of the role"/>
      <el-button type="primary" style="margin-left: 10px" @click="addRole()">+ 添加角色</el-button>
    </div>
    <div class="permission-body">
      <el-collapse v-model="activeNames" @change="clickRole(activeNames)" accordion>
        <el-collapse-item v-for="(item, index) in roleList" :title="item.nameZh" :name="item.id" :key="index">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span style="font-size: 14px; line-height: 40px">可操作的资源</span>
                <el-button class="button" style="margin-right: 5px; color: red" icon="el-icon-delete"
                           type="text" @click="deleteRole()"></el-button>
              </div>
            </template>
            <div>
              <el-tree
                  :props="defaultProps"
                  :data="menus"
                  node-key="id"
                  :default-checked-keys="selectedMenuIds"
                  :ref="el=>{tree[index] = el}"
                  show-checkbox
                  accordion
                  :key="index"
              />
              <div style="display: flex;justify-content: flex-end">
                <el-button size="small" type="danger" @click="cancelUpdate()">取消修改</el-button>
                <el-button size="small" type="primary" @click="doUpdate(item.id, index)">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs, onMounted, ref} from "vue";
import {getRequest, putRequest, jsonPost, deleteRequest} from "../../network/post/postRequest";
import {ElMessage} from "element-plus";

export default {
  name: "PerManage",
  setup() {
    const data = reactive({
      role: {
        name: '',
        nameZh: ''
      },
      activeNames: '',
      roleList: [
        {
          id: '',
          name: '',
          nameZh: ''
        }
      ],
      defaultProps: {
        label: 'name',
        children: 'children',
      },
      menus: [],
      selectedMenuIds: []
    });

    const tree = ref([])

    function getMenu() {
      getRequest('/system/basic/per/menu').then(resp => {
        if (resp) {
          data.menus = resp;
        }
      })
    }

    function initCheckBox(rid) {
      getRequest('/system/basic/per/' + rid).then(resp => {
        if (resp) {
          data.selectedMenuIds = resp
        }
      })
    }

    const clickRole = (rid) => {
      getMenu();
      initCheckBox(rid)
    }

    function initRole() {
      getRequest('/system/basic/per/').then(resp => {
        if (resp) {
          data.roleList = resp;
        }
      })
    }

    onMounted(() => {
      initRole()
    });

    return {
      ...toRefs(data),
      clickRole,
      initCheckBox,
      tree,
      initRole
    };
  },
  methods: {
    doUpdate(rid, index) {
      let mids = this.tree[index].getCheckedKeys(true);
      console.log(mids);
      let url = '/system/basic/per/?rid=' + rid;

      mids.forEach(item => {
        url += '&mids=' + item;
      })
      putRequest(url).then(resp => {
        if (resp) {
          this.initCheckBox(rid);
        }
      })
    },
    cancelUpdate() {
      this.activeNames = -1;
    },
    addRole() {
      if (this.role.name && this.role.nameZh) {
        jsonPost('/system/basic/joblevel/role', this.role).then((resp) => {
          if (resp) {
            this.initRole()
          }
        })
      }
      ElMessage({message: "请填写角色信息", type: "error"})
    },
    deleteRole() {
      deleteRequest('/system/basic/joblevel/delete/' + this.activeNames).then((resp)=>{
        if(resp){
          this.initRole();
        }
      })
    }
  }
}
</script>

<style>
.permission-head {
  width: 800px;
  display: flex;
}

.permission-body {
  margin-top: 15px;
  width: 800px;
}

.el-collapse-item__header {
  font-size: 16px;
  font-weight: 600;
}

.card-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>