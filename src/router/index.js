import {createRouter, createWebHistory} from 'vue-router'
import {initMenu} from "../utils/menu";
import store from "../store";

const routes = [
  {
    path: '/',
    name: 'LoginView',
    component: () => import('../views/LoginView'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home'),
    meta: {
      hidden: false
    },
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

router.beforeEach((to, from, next) => {
  // 如果是去登陆页面直接放行
  if (to.path === "/") {
    next();
  } else {
    // 去其页面先获取路由
    if (window.sessionStorage.getItem("user")) {
      initMenu(router, store);
      next();
    } else {
      next('/?redirect=' + to.path);
    }
  }
})
