<template>
	<div class="main">
		<!-- 登录页 -->
		<login/>
		<!-- 通讯录 -->
		<addressBook/>
		<!-- 版权声明和备案号 -->
		<div class="copyright">
			Copyright © 2024 莫羽 All rights reserved | 闽ICP备2023013938号 | 闽ICP备2023013938号
		</div>
	</div>
</template>

<script setup  lang="ts" name="app">
	import login from './view/login.vue'
	import addressBook from './view/addressBook.vue';
	// import test from './components/test.vue'
	// import { useLoginStore } from '@/store';
	// const loginStore = useLoginStore();
	
</script>

<style lang="scss" scoped>
	.main{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
		height: 100vh;
		max-width: 100vw;
		background-color: #8EC5FC;
		background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 33%);
	}
	
	
	.copyright{
		position: absolute;
		bottom: 5px;
		font-family: Micorsoft YaHei;
		font-size: 12px;
		color: rgba(113, 113, 113, 1);
	}
</style>