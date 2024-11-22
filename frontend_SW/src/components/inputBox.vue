<template>
	<div class="main">
		<div class="inputBox">
			<div class="text">添加联系人</div>
			<input type="text" placeholder="姓名" maxlength="6" v-model="addressBookStore.name" />
			<input type="number" placeholder="电话号码" maxlength="11" v-model="addressBookStore.phone" />
			<input type="text" placeholder="地址" maxlength="13" v-model="addressBookStore.address"/>
			<div class="confirm">
				<button @click.stop="cancel" >取消</button>
				<button @click.stop="addAddress" style="background-color: rgba(255, 192, 0, 1);">确定</button>
			</div>

		</div>
	</div>
</template>

<script lang="ts" setup name='inputBox'>
	import { useAddressBookStore } from '../store/addressBook';
	import { useLoginStore } from '../store/login';
	import { useAddress } from '../utils/useAddress';
	const loginStore = useLoginStore()
	const addressBookStore = useAddressBookStore()

	const  addAddress = async () => {
		if(addressBookStore.name == '' || addressBookStore.phone == '' || addressBookStore.address == '' ){
			alert("请勿留空！")
		}else{
			const data = {
				account:loginStore.account,
				name:addressBookStore.name,
				phone:addressBookStore.phone,
				address:addressBookStore.address
			}
			const res = await useAddress('addAddressBook',data)
			addressBookStore.isShow = true
			return res;
		}
	} 
	
	const  cancel = () => {
		addressBookStore.isShow = true
	} 
	
</script>

<style scoped>
	.main{
		width: 100%;
		height: 100%;
	}
	
	.text{
		font-size: 20px;
		color: black;
		font-weight: 700;
		font-family: Micorsoft YaHei;
	}
	.confirm{
		display: flex;
		flex-direction: row;
		gap: 30px;
	}
	
	.inputBox{
		display: flex;
		flex-direction: column;
		background-color: #fff;
		justify-content: center;
		align-items: center;
		text-align: center;
		height: 60vh;
		width: 30vw;
		box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
	}
	
	button{
		color: #fff;
		font-size: 16px;
		margin-top: 50px;
		border: none;
		background-color: #00B0F0;
		box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.3);
		height: 6vh;
		width: 10vw;
	}
	
	input{
		height: 56px;
		width: 70%;
		margin-top: 24px;
		margin-left: auto;
		margin-right: auto;
		border: none;
		box-shadow: 0.5px 0.5px 2px 2px rgba(0, 0, 0, 0.1);
		text-indent: 48px;
		outline: none;
		font-weight: 300;
	}
</style>