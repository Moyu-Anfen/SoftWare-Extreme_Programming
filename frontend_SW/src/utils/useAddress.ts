import axios from "axios";

export async function useAddress(method:string,data:any){
	const config = {
		method: 'POST',
		url: `http://localhost:6001/${method}`,
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