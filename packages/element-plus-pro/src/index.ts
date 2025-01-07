import type { App } from 'vue'
import { TransferTree } from './components'
import Locale from './locale'

export { useLocale, setLocale } from './locale'
export type { Language } from './locale'

export const installLocale = (app: App, options = {}) => {
  app.use(Locale, options)
}

export { TransferTree }
export type { TreeNode, TransferTreeProps } from './components'

export const installComponent = (app: App) => {
  app.component('TransferTree', TransferTree)
}

export default {
  install: (app: App, options: { locale?: string } = {}) => {
    installLocale(app, options)
    installComponent(app)
  }
} 