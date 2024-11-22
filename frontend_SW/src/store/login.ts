//引入pinia仓库
import {defineStore} from 'pinia'

export const useLoginStore = defineStore('login',{
	state(){
		return{
			account:'',
			timer:30,
			isLogin:false,
			fistLogin:false,
		}
	}
})