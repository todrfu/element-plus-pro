import { defineConfig } from 'vitepress'
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'

export default defineConfig({
  title: 'Element Plus Pro',
  description: '基于 Element Plus 的扩展组件库',
  base: '/element-plus-pro/',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' }
          ]
        }
      ],
      '/components/': [
        {
          text: '数据传输',
          items: [
            { text: 'TransferTree 树形穿梭框', link: '/components/transfer-tree' }
          ]
        },
        {
          text: '表单组件',
          items: []
        },
        {
          text: '数据展示',
          items: []
        }
      ]
    }
  },
  markdown: {
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    }
  }
}) 