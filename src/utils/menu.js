import {getRequest} from "../network/post/postRequest";

//Todo 保存所有后台component字符串对应的映射
const routeMap = new Map();
//主页
routeMap.set("Home",() => import("../views/Home"));
//员工资料
routeMap.set("EmpBasic",() => import("../views/emp/EmpBasic"));
routeMap.set("EmpAdv",() => import("../views/emp/EmpAdv"));
//人事管理
routeMap.set("PerMv",() => import("../views/per/PerMv"));
routeMap.set("PerEc",() => import("../views/per/PerEc"));
routeMap.set("PerEmp",() => import("../views/per/PerEmp"));
routeMap.set("PerTrain",() => import("../views/per/PerTrain"));
routeMap.set("PerSalary",() => import("../views/per/PerSalary"));
//薪资管理
routeMap.set("SalSearch",() => import("../views/sal/SalSearch"));
routeMap.set("SalMonth",() => import("../views/sal/SalMonth"));
routeMap.set("SalSob",() => import("../views/sal/SalSob"));
routeMap.set("SalTable",() => import("../views/sal/SalTable"));
routeMap.set("SalSobCfg",() => import("../views/sal/SalSobCfg"));
//统计管理
routeMap.set("StaAll",() => import("../views/sta/StaAll"));
routeMap.set("StaPers",() => import("../views/sta/StaPers"));
routeMap.set("StaScore",() => import("../views/sta/StaScore"));
routeMap.set("StaRecord",() => import("../views/sta/StaRecord"));
//系统管理
routeMap.set("SysHr",() => import("../views/sys/SysHr"));
routeMap.set("SysBasic",() => import("../views/sys/SysBasic"));
routeMap.set("SysCfg",() => import("../views/sys/SysCfg"));
routeMap.set("SysData",() => import("../views/sys/SysData"));
routeMap.set("SysLog",() => import("../views/sys/SysLog"));
routeMap.set("SysInit",() => import("../views/sys/SysInit"));

export const initMenu = (router, store) => {
  //如果router中已经保存过了则不在发送请求
  if (store.state.routes.length > 0) {
    return;
  }
  getRequest('/system/config/menu').then((data) => {
    if (data) {
      let fmtRoutes = formatRoutes(data);
      //TODO 动态添加路由
      fmtRoutes.forEach((item, index) => {
        router.addRoute(item)
      })
      //添加404页面的路由
      router.addRoute({
        name: '404',
        path: '/:pathMatch(.*)',
        redirect: '/home'
      })
      store.dispatch('initRoutes', fmtRoutes);
    }
  })
}

export const formatRoutes = (routes) => {
  let fmRoutes = [];
  routes.forEach(route => {
    let {
      path,
      component,
      name,
      meta,
      iconCls,
      children
    } = route;
    // children可能为null
    if (children && children instanceof Array) {
      // 递归调用，格式化子路径
      children = formatRoutes(children);
    }

    let fmRoute = {
      path: path,
      name: name,
      iconCls: iconCls,
      meta: meta,
      children: children,
      //Todo 待优化
      component: routeMap.get(component)
    };
    fmRoutes.push(fmRoute);
  })
  return fmRoutes;
}