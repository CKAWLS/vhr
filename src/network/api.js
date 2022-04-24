import axios from "axios";
import {ElMessage} from "element-plus";
import router from "../router";

//封装的网络请求基类
export function baseRequest(config) {
  const instance = axios.create({
    // 设置axios请求跨域的url匹配项
    baseURL: '/',
    timeout: 5000
  })

  //请求开始前的拦截器
  instance.interceptors.request.use(config => {
    //...操作
    return config
  }, error => {
  })

  //请求结束的拦截器
  instance.interceptors.response.use(res => {
    //...操作
    if (res.status && res.status == 200 && res.data.code == 500) {
      ElMessage({message: res.data.msg, type: "error"});
      return;
    }

    if (res.data.msg) {
      ElMessage({message: res.data.msg, type: "success"})
    }
    return res.data;
  }, error => {
    if (error.response.status == 504 || error.response.status == 404) {
      ElMessage({message: "服务器被吃了( ╯□╰ )", type: "error"});
    } else if (error.response.status == 403) {
      ElMessage({message: "权限不足，请联系管理员", type: "error"});
    } else if (error.response.status == 401) {
      ElMessage({message: "尚未登录，请登录", type: "error"});
      router.replace('/').then(r => "请求失败");
    } else {
      if (error.response.data.msg) {
        ElMessage({message: error.response.data.msg, type: "error"});
      } else {
        ElMessage({message: "未知错误", type: "error"});
      }
    }
    return;
  })

  return instance(config)
}