import { ref } from 'vue'
import type { App, Ref } from 'vue'
import zhCn from './lang/zh-CN'
import en from './lang/en'

// 定义语言包类型
export interface Language {
  el: {
    transfer: {
      sourceList: string
      targetList: string
      filterPlaceholder: string
    }
  }
}

export type TranslatorOption = Record<string, string | number>
export type Translator = (path: string, option?: TranslatorOption) => string
export type LocaleContext = {
  locale: Ref<string>
  lang: Ref<Language>
  t: Translator
}

const defaultLocale = 'en'

const locales: Record<string, Language> = {
  'zh-CN': zhCn,
  'en': en
}

let locale = ref(defaultLocale)
let lang = ref(locales[defaultLocale])

export const useLocale = (): LocaleContext => {
  const t = (path: string, option?: TranslatorOption): string => {
    const paths = path.split('.')
    let current: any = lang.value
    
    for (const p of paths) {
      if (current?.[p] === undefined) {
        return ''
      }
      current = current[p]
    }
    
    return typeof current === 'string' ? current : ''
  }

  return {
    locale,
    lang,
    t
  }
}

export const setLocale = (newLocale: string): void => {
  if (locales[newLocale]) {
    locale.value = newLocale
    lang.value = locales[newLocale]
  }
}

export default {
  install(app: App, options: { locale?: string } = {}) {
    if (options.locale && locales[options.locale]) {
      setLocale(options.locale)
    }
  }
} 