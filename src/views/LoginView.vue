<template>
  <el-form :model="loginForm" :rules="rules" class="login-container" ref="loginForm">
    <h3 class="login-title">系统登陆</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="loginForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码" @keydown.enter.native="login('loginForm')"></el-input>
    </el-form-item>
    <el-button type="primary" class="login-submit" @click="login('loginForm')">登录</el-button>
  </el-form>
</template>

<script>
import {baseKeyValuePost} from "../network/post/postRequest";
import {initMenu} from "../utils/menu";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "LoginView",
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
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //todo
          baseKeyValuePost('/doLogin', this.loginForm).then(success => {
            if(success){
              //console.log(JSON.stringify(success));
              //将用户存入session storage -> 页面刷新就消失
              window.sessionStorage.setItem("user", JSON.stringify(success.obj));
              this.$router.push('/home');
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
}
</script>

<style scoped>
.login-container {
  width: 350px;
  border: 1px solid #ddd8d8;
  border-radius: 10px;
  padding: 15px 30px 30px 20px;
  margin: 180px auto auto auto;
  box-shadow: 0 0 10px #cfcfcf;
  background: #fff;
}

.login-title{
  text-align: center;
  color: #302d2d;
}

.login-submit {
  width: 100%;
}

</style>