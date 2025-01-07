import type { App } from 'vue'
import { TransferTree } from './components'

// 导出组件
export { TransferTree }

// 导出类型
export type {
  TreeNode,
  TransferTreeProps
} from './components'

// 导出 Vue 插件
export default {
  install: (app: App) => {
    app.component('TransferTree', TransferTree)
  }
} 