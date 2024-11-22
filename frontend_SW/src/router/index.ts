//创建一个路由器
import {createRouter, createWebHashHistory} from "vue-router";

//引入页面
import login from '@/view/login.vue'
import addressBook from '@/view/addressBook.vue'

const router = createRouter({
	history:createWebHashHistory(),
	routes:[
		{	name:'摸鱼通讯录登录',
			path:'/login',
			component:login
		},
		{
			name:'摸鱼通讯录',
			path:'/addressBook',
			component:addressBook
		}
	]
})

export default router