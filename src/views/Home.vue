<template>
  <div>
    <el-container class="el-container">
      <el-header class="home-header">
        <div class="header-title">微人事</div>
        <el-dropdown class="header-dropdown"
                     @command="handleCommand"
                     trigger="click">
          <span class="el-dropdown-link">
            {{ user.name }}<img :src="user.userface" alt="">
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="userinfo">个人信息</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="250px">
          <el-menu
              active-text-color="#ffd04b"
              background-color="#545c64"
              class="home-menu"
              text-color="#fff"
              unique-opened
              router
              :default-active="$route.path"
          >
            <template v-for="(item, index) in routes" :key="index">
              <el-sub-menu :index="index + ''"
                           v-if="!item['meta']['hidden']">
                <template #title>
                  <i :class="item['iconCls']" style="color: #07c8f3;margin-right: 5px"></i>
                  <span>{{ item['name'] }}</span>
                </template>
                <el-menu-item :index="child.path"
                              v-for="(child, indexChild) in item['children']"
                              :key="indexChild+1">{{ child.name }}
                </el-menu-item>
              </el-sub-menu>
            </template>
          </el-menu>
        </el-aside>
        <el-main>
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{this.$router.currentRoute.value.name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {ElMessageBox, ElMessage} from 'element-plus'
import {getRequest} from "../network/post/postRequest";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import router from "../router";

export default {
  name: "Home.vue",
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    return {
      store,
      router,
      route
    }
  },
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem("user"))
    }
  },
  methods: {
    handleCommand(command) {
      if ("userinfo" === command) {

      } else if ("setting" === command) {

      } else if ("logout" === command) {
        ElMessageBox.confirm(
            '确定要退出登陆吗?',
            '提示',
            {
              distinguishCancelAndClose: true,
              confirmButtonText: '确认',
              cancelButtonText: '取消',
            }
        )
            .then(() => {
              getRequest('/logout', null);
              this.store.state.routes.forEach(item => this.router.removeRoute(item.name))
              this.router.removeRoute("404")
              this.store.commit('initRoutes', [])
              window.sessionStorage.removeItem('user')
              this.router.replace('/')
            })
            .catch((action) => {
              ElMessage({
                type: 'info',
                message: '已取消操作',
              })
            })
      }
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.el-container {
  height: 100vh;
}

.home-header {
  display: flex;
  align-items: center;
  height: 80px;
  background-color: lightskyblue;
  justify-content: space-between;
  padding: 0 25px;
}

.header-title {
  font-family: 新宋体;
  font-size: 30px;
  color: #FFF;
}

.header-dropdown {
  display: flex;
  justify-self: center;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: 新宋体;
  font-size: 16px;
}

.el-dropdown-link img {
  height: 48px;
  width: 48px;
  border-radius: 24px;
  margin-left: 8px;
}

.home-menu {
  height: 100%;
}

.breadcrumb {
  width: auto;
  height: 40px;
}
</style>