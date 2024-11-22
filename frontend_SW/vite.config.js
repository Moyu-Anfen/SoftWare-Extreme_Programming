import {
	defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
//解决使用@路径后无法编译
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	//解决使用@路径后无法编译
	resolve: {
		alias: {
			"@": path.resolve(__dirname, './src')
		}
	}
});