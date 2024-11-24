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
			addition_1_key:'',
			addition_2_key:'',
			addition_1_value:'',
			addition_2_value:'',
			additionCount:0,
			addition:{}
		}
	}
})