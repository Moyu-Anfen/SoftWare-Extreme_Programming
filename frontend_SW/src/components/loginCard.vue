<template>
	<div class="loginCard" v-if="!loginStore.isLogin">
		<div class="left">
			<div class="text1">
				WELCOME
			</div>
			<div class="text2">
				欢迎来到摸鱼通讯录
			</div>
			<div class="circleContain">
			</div>
			<div class="text3">
				Moyu 莫羽
			</div>
		</div>
		<div class="right">
			<div class="inputHolder">
				<img src="../assets/img/user.svg"
					style="height: 25px;max-width: auto;position: absolute;top: 40px;left: 105px;" alt="" />
				<input type="text" placeholder="邮箱" v-model="loginStore.account" />
			</div>
			<div class="inputHolder">
				<img src="../assets/img/password.svg"
					style="height: 25px;max-width: auto;position: absolute;top: 40px;left: 105px;" alt="" />
				<input type="password" placeholder="密码" v-model="password" />
			</div>
			<div class="inputHolder">
				<img src="../assets/img/verify.svg"
					style="height: 27px;max-width: auto;position: absolute;top: 41px;left: 105px;" alt="" />
				<div class="vercode">
					<input type="text" name="vercode" v-model="vercode" class="inputVercode" id="vercode" maxlength="6"
						placeholder="验证码" />
					<button class="vercodeButton" :disabled='codeDisabled'
						@click.stop="sendVercode">{{codeDisabled?`重新发送 ${countdown}`:'获取验证码'}}</button>
				</div>
			</div>
			<button class="loginButton" @click="login">登录 / 注册</button>
			<div class="footer">
				<div class="XD">
					DESIGNED BY 张开羽 832201111
				</div>
				<img src="../assets/img/book.png" alt="" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup name="loginCard">
	import { ref,onBeforeMount } from 'vue'
	import { useLoginStore } from '../store/login'
	import { useCountdown } from '../utils/useCountDown';
	import { useVercode } from '../utils/useVercode';
	import { sendRequest } from '../utils/useAxios';
	import { encrypt } from '../utils/useEncrypt';

	const { codeDisabled, countdown, startCountdown } = useCountdown(30);
	const loginStore = useLoginStore();
	const password = ref('')
	const vercode = ref('')

	const sendVercode = () =>{
		if(loginStore.account == ''){
			alert("请先填写邮箱！")
		}else{
			if(codeDisabled){
				console.log("验证码发送成功")
				useVercode(loginStore.account);
			}else{
			}
			startCountdown()
		}
	}
	
	const login = async () => {
		if(loginStore.account == '' || password.value == ''){
			alert("请勿填空值！")
		}else{
			let url = 'http://extreme.moyu-home.cn/login'
			let method = 'POST'
			let encryptPassword = await encrypt(password.value)
			console.log('encryptPassword：',encryptPassword)
			let data = {
				account: loginStore.account,
				password: encryptPassword,
				vercode: vercode.value
			}
			console.log(data)
			const res = await sendRequest(url, method, data)
			console.log(res.msg)
			console.log(res.code)
			if(res.msg != undefined){
				alert(res.msg)
			}else{
				
			}
			if(res.code == '200'){
				loginStore.isLogin = true
				loginStore.fistLogin = false
				let time = new Date().getTime();
				localStorage.setItem('account',loginStore.account)
				localStorage.setItem('time',time.toString())
			}
		}
	}
	
	onBeforeMount(()=>{
		let checkTime = localStorage.getItem('time')
		let now = new Date().getTime();
		if(now - parseInt(checkTime) < (10 * 60 * 1000)){
			loginStore.isLogin = true;
		}else{
			if(loginStore.fistLogin == false){
				
			}else{
				alert("登录失效！")
				loginStore.isLogin = false;
			}
		}
		loginStore.account = localStorage.getItem('account')
	})
</script>

<style scoped>
	.loginCard {
		display: flex;
		flex-direction: row;
		height: 70vh;
		width: 60vw;
		background-color: #fff;
		border-radius: 15px;
		box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
	}

	.left {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background-color: rgb(0, 176, 240);
		border-top-left-radius: 15px;
		border-bottom-left-radius: 15px;
		box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.3);
		z-index: 1;
	}

	.right {
		flex: 1.5;
		padding-top: 10%;
		background-color: white;
		border-top-right-radius: 15px;
		border-bottom-right-radius: 15px;
		box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
	}

	.text1 {
		color: #fff;
		text-shadow: 1px 1px 2px #000000;
		margin-top: 30%;
		font-family: Micorsoft YaHei;
		font-size: 46px;
		font-weight: 700;
	}

	.text2 {
		color: #fff;
		margin-top: 3%;
		text-shadow: 0.5px 0.5px 2px #000000;
		font-family: Micorsoft YaHei;
		font-size: 18px;
		font-weight: 700;
	}

	.circleContain {
		margin-top: 8%;
		background-image: url(../assets/img/avatar.jpg);
		background-size: cover;
		height: 170px;
		width: 170px;
		border-radius: 50%;
	}

	.text3 {
		color: #fff;
		margin-top: 4%;
		text-shadow: 0.5px 0.5px 1px #000000;
		font-family: Micorsoft YaHei;
		font-size: 16px;
		font-weight: 700;
	}

	.vercode {
		display: flex;
		flex-direction: row;
		margin-left: auto;
		margin-right: auto;
		width: 70%;
		text-align: center;
		align-items: center;
		justify-content: center;
	}

	.inputHolder {
		position: relative;
	}

	.inputVercode {
		flex: 2;
		margin-top: 24px;
		margin-left: auto;
		margin-right: auto;
		border: none;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		box-shadow: 0.5px 0.5px 2px 2px rgba(0, 0, 0, 0.1);
		outline: none;
		font-weight: 300;
	}

	.vercodeButton {
		flex: 1;
		margin-top: 24px;
		height: 61px;
		border: none;
		color: #fff;
		font-size: 100%;
		font-weight: 400;
		background-color: rgba(0, 176, 240, 1);
		border-radius: 45px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		line-height: 56px;
	}

	.vercodeButton:hover {
		background-color: rgba(0, 176, 240, 0.8);
	}

	.loginLogo {
		fill: red;
	}

	.footer {
		position: relative;
	}

	.XD {
		position: absolute;
		top: 95px;
		left: 20px;
		color: #7F7F7F;
		font-family: Micorsoft YaHei;
		font-size: 8px;
	}

	.loginButton {
		margin-top: 32px;
		background-color: rgba(255, 192, 0, 1);
		height: 56px;
		width: 70%;
		margin-left: auto;
		margin-right: auto;
		border: none;
		border-radius: 45px;
		box-shadow: 0px 0px 56px 0px rgba(0, 0, 0, 0.1);
		color: #fff;
		text-align: center;
		line-height: 56px;
		font-weight: 300;
		font-size: 20px;
	}

	.loginButton:hover {
		background-color: rgba(255, 192, 0, 0.8);
	}

	.footer img {
		position: absolute;
		left: 520px;
	}


	input {
		height: 56px;
		width: 70%;
		margin-top: 24px;
		margin-left: auto;
		margin-right: auto;
		border: none;
		border-radius: 80px;
		box-shadow: 0.5px 0.5px 2px 2px rgba(0, 0, 0, 0.1);
		text-indent: 48px;
		outline: none;
		font-weight: 300;
	}

	img {

		height: 150px;
		max-width: auto;
	}
</style>