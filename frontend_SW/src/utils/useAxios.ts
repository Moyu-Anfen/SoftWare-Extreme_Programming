import axios from "axios";
import { ref } from "vue";

export function sendRequest(url:string, method:string, data:any) {
	
	const config = {
		method: method,
		url: url,
		headers: {
			'Content-Type': 'application/json' // 请求头设置为JSON
		},
		data:data
	};
	
	async function useAxios(){
		try{
			const response = await axios(config)
			const res = response.data
			return res
		}catch(e){
			console.log(e)
		}
	}
	
	return useAxios();
}