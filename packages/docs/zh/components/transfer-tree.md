# 树形穿梭框组件

## 基础用法

:::preview 基础用法 || 展示组件的基本使用方法

demo-preview=./demos/transfer-tree/basic.vue

:::

### Attributes

| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| width | 容器总宽度 | string | — | 800px |
| height | 容器总高度 | string | — | 500px |
| dataSource | 左侧树数据源 | array | — | [ ] |
| nodeKey | el-tree的key（必须唯一） | string | — | id |
| defaultProps | el-tree 配置项 | Object | — | \{ label: "label", children: "children" \} |
| default-checked-keys | 左侧树默认选中穿梭节点 | array | — | [ ] |
| default-expanded-keys | 树默认展开节点 | array | — | [ ] |
| accordion | 是否每次只打开一个树节点 | boolean | — | false |
| render-after-expand | 是否在第一次展开某个树节点后才渲染其子节点 | boolean | — | true |
| expand-on-click-node | 是否在点击节点的时候展开或者收缩节点 | boolean | — | true |
| father-choose | 是否严格的遵循父子不互相关联的做法, 父节点是否可被选择穿梭 | boolean | — | false |
| isRadio | 左侧数据源是否为单选 | boolean | — | false |
| openAll| 树节点是否默认展开 | boolean | — | true |
| filterable | 是否可搜索 | boolean | — | false |
| filter-placeholder | 搜索框占位符 | string | — | 请输入搜索内容 |
| filter-method | 自定义搜索方法 | function | — | — |
| titles | 自定义标题 | array | — | ['源数据', '目标列表'] |
| button-texts | 自定义按钮文案 | array | — | [ ] |
| listSortFifo | 右侧列表排序方式：默认值：true，右侧列表中结点根据左侧树选中结点先后顺序排序；可选值：false，右侧列表中结点根据左侧树结构排序 | boolean | — | true |

### Slot

| name | 说明 |
|------|--------|
| left-footer | 左侧列表底部的内容 |
| right-footer | 右侧列表底部的内容 |

### Methods

| 方法名 | 说明 | 参数 |
| ---- | ---- | ---- |
| clearQuery | 清空某个面板的搜索关键词 | 'left' / 'right' / 'all'，指定需要清空的搜索框 |
| getTreeChecked | 获取左侧树全部选中状态 | 'leftKeys', 'leftHarfKeys', 'leftNodes', 'leftHalfNodes' |

### Events

| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| change | 选项在两栏之间转移时触发 | 当前值、数据移动的方向（'left' / 'right'）、发生移动的数据 key 数组 |
| left-check-change | 左侧列表元素被用户选中 / 取消选中时触发 | 当前被选中的元素的 key 数组、选中状态发生变化的元素的 key 数组 |
| right-check-change | 右侧列表元素被用户选中 / 取消选中时触发 | 当前被选中的元素的 key 数组、选中状态发生变化的元素的 key 数组 |

:::tip
基于 `element-tree-transfer-pro` 组件，`vue2`版本使用文档请参考: [element-tree-transfer-pro](https://github.com/Herozzq/element-tree-transfer-pro)
:::
