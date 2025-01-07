# 使用指南

## 安装

```bash
# npm
npm install @todrfu/element-plus-pro

# yarn
yarn add @todrfu/element-plus-pro

# pnpm
pnpm add @todrfu/element-plus-pro
```

## 基础用法

### 注册全部组件库

```js
import ElementPlusPro from 'element-plus-pro'
import 'element-plus-pro/dist/index.css'

const app = createApp(App)

// 注册全部组件
app.use(ElementPlusPro)
```

### 按需导入

```js
import { TransferTree, installLocale } from 'element-plus-pro'
import 'element-plus-pro/dist/index.css'

const app = createApp(App)

// 注册单个组件库
app.component('TransferTree', TransferTree)

// 多语言
app.use(app => {
    installLocale(app, {
        locale: "zh-CN",
    });
});

```

```vue
<script setup>
import { TransferTree } from '@todrfu/element-plus-pro'
</script>

<template>
  <TransferTree />
</template>
```
