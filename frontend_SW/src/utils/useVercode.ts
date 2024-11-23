import { sendRequest } from '../utils/useAxios';

export function useVercode(account:any){
	const url = 'http://extreme.moyu-home.cn/verify'
	const method = 'POST'
	const data = {
		account:account
	}
	sendRequest(url,method,data);
}