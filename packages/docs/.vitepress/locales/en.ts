export const enConfig = {
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Components', link: '/components/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        }
      ],
      '/components/': [
        {
          text: 'Data Transfer',
          items: [
            { text: 'TransferTree', link: '/components/transfer-tree' }
          ]
        }
      ]
    }
  }
} 