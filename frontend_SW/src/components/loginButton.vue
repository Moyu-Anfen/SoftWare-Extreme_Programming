<template>
	<button class="loginButton">登录 / 注册</button>
</template>

<script lang="ts" setup name="loginButton">


</script>

<style scoped>
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
	
	.loginButton:hover{
		background-color: rgba(255, 192, 0, 0.8);
	}
</style>