import { sendRequest } from '../utils/useAxios';

export function useVercode(account:any){
	const url = 'http://localhost:6001/verify'
	const method = 'POST'
	const data = {
		account:account
	}
	sendRequest(url,method,data);
}