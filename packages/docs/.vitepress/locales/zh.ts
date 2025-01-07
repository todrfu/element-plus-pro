export const zhConfig = {
  themeConfig: {
    nav: [
      { text: '指南', link: '/zh/guide/' },
      { text: '组件', link: '/zh/components/' }
    ],
    sidebar: {
      '/zh/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/zh/guide/' },
            { text: '快速开始', link: '/zh/guide/getting-started' }
          ]
        }
      ],
      '/zh/components/': [
        {
          text: '数据传输',
          items: [
            { text: '树形穿梭框', link: '/zh/components/transfer-tree' }
          ]
        }
      ]
    }
  }
} 