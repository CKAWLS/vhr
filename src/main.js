import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import base from './assets/css/base.css'
import 'font-awesome/css/font-awesome.min.css'
import {initMenu} from "./utils/menu";
import {Delete} from "@element-plus/icons-vue";

const app = createApp(App);
app.use(store).use(router).use(ElementPlus).mount('#app')
app.component('Delete',Delete)
