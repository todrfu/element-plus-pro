import DefaultTheme from 'vitepress/theme'
import { ElementPlusContainer } from '@vitepress-demo-preview/component'
import '@vitepress-demo-preview/component/dist/style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { TransferTree } from '@todrfu/element-plus-pro'
import '@todrfu/element-plus-pro/dist/style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus)
    app.component('TransferTree', TransferTree)
    app.component('demo-preview', ElementPlusContainer)
  }
} 