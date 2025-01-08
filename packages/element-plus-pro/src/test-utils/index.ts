import { config } from '@vue/test-utils'
import ElementPlus from 'element-plus'

// 全局配置
config.global.plugins = [ElementPlus]

// 可选：添加常用的测试辅助函数
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)) 