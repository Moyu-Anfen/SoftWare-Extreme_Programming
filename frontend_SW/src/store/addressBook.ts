//引入pinia仓库
import {defineStore} from 'pinia'

export const useAddressBookStore = defineStore('AddressBook',{
	state(){
		return{
			isShow:true,
			name:'',
			phone:'',
			address:'',
			search:'',
			isShowChang:false,
			isfavorite:'',
		}
	}
})