import type { ComponentPublicInstance } from 'vue'
import type { VueWrapper } from '@vue/test-utils'

declare module 'vitest' {
  export interface TestContext {
    wrapper?: VueWrapper<ComponentPublicInstance>
  }
}

export {} 