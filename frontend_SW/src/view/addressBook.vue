<template>
	<!-- 输入框 -->
	<div class="showInput" v-show="!addressBookStore.isShow && !addressBookStore.isShowChang">
		<inputBox />
	</div>
	<div class="showChange" v-show="!addressBookStore.isShow && addressBookStore.isShowChang">
		<changeBox />
	</div>
	<div class="main" v-show="addressBookStore.isShow && loginStore.isLogin">
		<div class="addressBook">
			<div class="search">
				<input type="text" placeholder="通过名字搜索" maxlength="6" v-model="addressBookStore.search">
				<button class="searchFor"><img src="../assets/img/search.svg" alt="" /></button>
			</div>
			<div class="uploadAndDownload">
				<button class="download" @click.stop="download(loginStore.account)">下载</button>
				<button class="upload" @click.stop="showModal= true">上传</button>
				 <div v-if="showModal" class="modal-overlay" @click="closeModal">
				    <div class="modal-content">
				    <h2>上传文件格式示例</h2>
				    <p><img src="http://static.moyu-home.cn/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20241123193054.png" alt="" style="min-height: 100%;width: 500px;" /></p>
				    <button @click.stop="triggerFileUpload()">我已知悉</button>
				    </div>
				</div>
				<input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" />
			</div>
		</div>
		<div class="tip">左右滑动以查看更多</div>
		<swiper>
			<swiper-slide v-for="page in slidePages" :key='page'>
				<div class="content">
					<div class="idCard" v-for="(item,index) in filteredList.slice(5*(page-1),5*(page))" key='index'>
						<div class="action">
							<!-- <div>{{JSON.parse(item.addition).name}}</div> -->
							<div :class="{'favorite':item.favorite == false,'favorite_active':item.favorite == true}"
								@click.stop="favorite(item.name,item.favorite)">
								<svg t="1732301452225" class="icon" viewBox="0 0 1168 1024" version="1.1"
									xmlns="http://www.w3.org/2000/svg" p-id="1678" fill="#939393">
									<path
										d="M838.903248 0.000978a328.971305 328.971305 0 0 0-255.779593 125.3457A322.023964 322.023964 0 0 0 327.539762 0.000978 334.255199 334.255199 0 0 0 0.036204 339.050822a435.334128 435.334128 0 0 0 95.892885 253.137646 2316.693821 2316.693821 0 0 0 447.271814 417.916849 72.115363 72.115363 0 0 0 85.227248 0 2398.496323 2398.496323 0 0 0 447.271813-418.014699 453.142806 453.142806 0 0 0 93.153088-253.137646A334.744448 334.744448 0 0 0 838.903248 0.000978z"
										p-id="1679">
									</path>
								</svg>
							</div>
							<div class="change" @click.stop="changeAddress(item.name)"><img
									src="../assets/img/change.svg" alt="" /></div>
							<div class="delete" @click.stop="deleteAddress(item.name)"><img
									src="../assets/img/delete.svg" alt="" /></div>
						</div>
						<div class="nameContent">
							<div class="circleContain"><img :src="item.avator" /></div>
							<div class="name">{{item.name}}</div>
						</div>
						<div class="detailContent">
							<div class="phone">电话：{{item.phoneNumber}}</div>
							<div class="address">地址：{{item.address}}</div>
							<div v-for="(value,key) in JSON.parse(item.addition)" key='index'>
								<div class="address">{{key}}：{{value}}</div>
							</div>
						</div>
					</div>
					<div class="idCardAdd" @click.stop="addAddress"><img src="../assets/img/add.svg" alt="" /></div>
				</div>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script lang="ts" setup name="addressBook">
	import axios from "axios";
	import { SwiperSlide, Swiper } from 'swiper/vue';
	import 'swiper/css'
	import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
	import { reactive, ref, computed, onBeforeMount, onUnmounted } from 'vue'
	import { useLoginStore } from '../store/login';
	import { useAddressBookStore } from '../store/addressBook';
	import { sendRequest } from '../utils/useAxios';
	import { pinyin } from 'pinyin-pro';
	import { useAddress } from '../utils/useAddress';
	import inputBox from '../components/inputBox.vue';
	import changeBox from '../components/changeBox.vue';

	const loginStore = useLoginStore()
	const addressBookStore = useAddressBookStore()


	// 通过 ref 获取隐藏的文件输入控件
	const fileInput = ref(null);
	const showModal = ref(false);


	//计算需要多少页面来显示
	const slidePages = computed(() => {
		const slideSize = 5;
		const amountPage = Math.ceil(testChart.length / 5) + 1
		return amountPage;
	})


	let testChart = reactive([])

	const addAddress = () => {
		addressBookStore.isShow = false
	}

	const download = async () => {
		window.location.href=`http://8.152.208.55:3001/export​?account=${encodeURIComponent(loginStore.account)}`
	}

	const filteredList = computed(() => {
		return testChart.filter((item) =>
			item.name.toLowerCase().includes(addressBookStore.search.toLowerCase())
		);
	});


	const deleteAddress = async (name) => {
		const data = {
			account: loginStore.account,
			name: name
		}
		console.log(data)
		const res = await useAddress('deleteAddressBook', data)
		window.location.reload();
		return res;
	}

	const changeAddress = async (name) => {
		addressBookStore.name = name;
		addressBookStore.isShow = false
		addressBookStore.isShowChang = true
	}

	const favorite = async (name, isFavorite) => {
		console.log(name, isFavorite)
		addressBookStore.name = name;
		let data = {
			account: loginStore.account,
			name: addressBookStore.name,
			favorite: isFavorite
		}
		await useAddress("favorite", data)
	}

	onBeforeMount(() => {
		let url = 'http://extreme.moyu-home.cn/getAddressBook'
		let method = 'post'
		let data = {
			account: loginStore.account
		}

		const interval = setInterval(async () => {
			const res = await sendRequest(url, method, data)
			Object.assign(testChart, res)
		}, 1000)

	})
	
	const closeModal = () => {
	  showModal.value = false;
	};

	// 处理文件选择事件
	const handleFileUpload = async (event) => {
		closeModal()
		const file = event.target.files[0];
		console.log(file)

		if (!file) {
			alert("没有选择文件");
			return;
		}

		// 创建 FormData
		const formData = new FormData();
		formData.append("file", file); // 添加文件
		formData.append("account", loginStore.account); // 添加用户名

		try {
			// 发送请求
			const response = await axios.post("http://8.152.208.55:3001/import", formData, {
				headers: {
					"Content-Type": "multipart/form-data", // 设置表单数据格式
				},
			});

			alert("文件上传成功");
			console.log(response.data);
		} catch (error) {
			alert("文件上传失败");
			console.error(error);
		}
	};

	// 触发文件选择窗口
	const triggerFileUpload = () => {
		// 自动触发文件选择窗口
		fileInput.value.click();
	};
</script>

<style lang="scss" scoped>
	.swiper {
		margin-top: 200px;
		height: 65vh;
		width: 90vw;
	}

	.swiper-slide {}

	.tip {
		position: absolute;
		top: 200px;
		color: #7F7F7F;
		left: 45.5%;
	}

	.content {
		// background-color: black;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		border-radius: 30px;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 80px;
		height: 100%;
		width: 100%;
	}

	.idCard {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		text-align: center;
		width: 26vw;
		height: 26vh;
		background-color: #fff;
		color: black;
		border-radius: 10px;
		box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
		list-style-type: none;
		user-select: none;
	}

	.nameContent {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
		margin-left: 50px;
		margin-top: 10px;
	}

	.name {
		font-size: 20px;
		font-family: Micorsoft YaHei;
		margin-left: 40px;
		padding-bottom: 5px;
		border-bottom: 4px solid #3685F2;
	}

	.circleContain {
		// background-color: black;
		height: 50px;
		width: 50px;
		border-radius: 50%;
		// background-image: url(https://api.multiavatar.com/123.svg);
	}

	.detailContent {
		width: 100%;
	}

	.phone {
		text-align: start;
		margin-left: 55px;
		margin-top: 15px;
		height: 3vh;
		width: 70%;
		// background-color: red;
	}

	.address {
		text-align: start;
		margin-left: 55px;
		height: 3vh;
		width: 70%;
		// background-color: blue;
	}

	.idCardAdd {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		width: 26vw;
		height: 26vh;
		// background-color: #fff;
		// border-radius: 10px;
		// box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
		list-style-type: none;
		user-select: none;

		img {
			height: 150px;
			max-width: 100vw;
		}
	}

	.search {
		position: fixed;
		top: 100px;
		left: 20%;
		right: auto;
		display: flex;
		flex-direction: row;
		height: 10vh;
		width: 60vw;
		background-color: #fff;
		border-radius: 15px;
		box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
		text-indent: 50px;
	}

	.searchFor {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		top: 100px;
		height: 10vh;
		width: 7vw;
		border: none;
		background-color: #7F7F7F;
		border-radius: 15px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);

		img {
			height: 45px;
			max-width: 100vw;
		}
	}

	.action {
		display: flex;
		flex-direction: row;
		justify-content: end;
		width: 100%;
	}

	.delete {
		display: flex;
		justify-content: end;
		width: 5%;

		img {
			margin-top: 5px;
			margin-right: 10px;
			height: 20px;
		}
	}

	.change {
		display: flex;
		justify-content: end;
		width: 5%;

		img {
			margin-top: 5px;
			margin-right: 10px;
			height: 20px;
		}
	}

	.favorite {
		display: flex;
		justify-content: end;
		width: 6%;
		fill: red;

		svg {
			margin-top: 5px;
			margin-right: 10px;
			height: 20px;
			// fill: #3685F2;
		}
	}

	.favorite_active {
		display: flex;
		justify-content: end;
		width: 6%;
		fill: red;

		svg {
			margin-top: 5px;
			margin-right: 10px;
			height: 20px;
			fill: #ff0000;
		}
	}

	.uploadAndDownload{
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: center;
		gap: 50px;
	}
	
	.modal-overlay {
	  position: fixed;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  background-color: rgba(0, 0, 0, 0.5);
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  z-index: 1000; /* 确保悬浮窗在最上层 */
	}
	
	/* 模态框内容 */
	.modal-content {
	  background-color: white;
	  padding: 20px;
	  border-radius: 8px;
	  width: 800px;
	  text-align: center;
	  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}


	button{
		color: #fff;
		font-size: 16px;
		border: none;
		background-color: #00B0F0;
		box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.3);
		height: 6vh;
		width: 10vw;
	}
	
	.download:hover{
		color: #fff;
		font-size: 16px;
		border: none;
		background-color: #00bbff;
		box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.3);
		height: 6vh;
		width: 10vw;
	}
	
	.upload:hover{
		color: #fff;
		font-size: 16px;
		border: none;
		background-color: #00bbff;
		box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.3);
		height: 6vh;
		width: 10vw;
	}

	input {
		top: 100px;
		height: 9.7vh;
		width: 53vw;
		border: none;
		border-radius: 15px;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
		font-size: 30px;
		text-indent: 20px;
	}
</style>