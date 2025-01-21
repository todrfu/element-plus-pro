# Getting Started

## Installation

```bash
# npm
npm install @otdrfu/element-plus-pro

# yarn
yarn add @otdrfu/element-plus-pro

# pnpm
pnpm add @otdrfu/element-plus-pro
```

## Basic Usage

### Full Import

```js
import ElementPlusPro from 'element-plus-pro'
import 'element-plus-pro/dist/index.css'

const app = createApp(App)

// Register all components
app.use(ElementPlusPro)
```

### On-demand Import

```js
import { TransferTree, installLocale } from 'element-plus-pro'
import 'element-plus-pro/dist/index.css'

const app = createApp(App)

// Register single component
app.component('TransferTree', TransferTree)

// Internationalization
app.use(app => {
    installLocale(app, {
        locale: "zh-CN",
    });
});
```

```vue
<script setup>
import { TransferTree } from '@otdrfu/element-plus-pro'
</script>

<template>
  <TransferTree />
</template>
```
