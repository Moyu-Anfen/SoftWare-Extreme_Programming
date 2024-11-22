import JSEncrypt from "jsencrypt"
import axios from "axios"

export async function encrypt(message : any) {
	const key = await axios.get('http://localhost:6001/key')
	const data = message
	
	let encrypt = new JSEncrypt();
	encrypt.setPublicKey(key.data.publicKey)
	const encryptKey =  encrypt.encrypt(data);

	return encryptKey;
}
