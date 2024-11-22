import { createApp } from 'vue'
import App from './App.vue'
//引入pinia
import {createPinia} from 'pinia'
//引入路由
import router from './router'
//引入全局样式
import '@/style/global.css'
 
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')
