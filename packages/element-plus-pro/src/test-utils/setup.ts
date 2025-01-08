import { config } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { beforeAll, afterAll, vi } from 'vitest'

// 全局配置
config.global.plugins = [ElementPlus]

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

// 测试工具函数
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)) 