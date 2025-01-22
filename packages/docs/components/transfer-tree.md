# TransferTree Component

## Basic Usage

:::preview Basic Usage || Demonstrates basic component usage

demo-preview=./demos/transfer-tree/basic.vue

:::

### Attributes

| Parameter | Description | Type | Options | Default |
|---------- |-------- |---------- |-------------  |-------- |
| width | Total container width | string | — | 800px |
| height | Total container height | string | — | 500px |
| dataSource | Left tree data source | array | — | [ ] |
| nodeKey | el-tree key (must be unique) | string | — | id |
| defaultProps | el-tree configuration | Object | — | \{ label: "label", children: "children" \} |
| default-checked-keys | Default selected nodes for left tree transfer | array | — | [ ] |
| default-expanded-keys | Default expanded tree nodes | array | — | [ ] |
| accordion | Whether to expand only one tree node at a time | boolean | — | false |
| render-after-expand | Whether to render child nodes only after first expansion | boolean | — | true |
| expand-on-click-node | Whether to expand/collapse node when clicking on it | boolean | — | true |
| father-choose | Whether to strictly follow parent-child independence, allowing parent nodes to be selected for transfer | boolean | — | false |
| isRadio | Whether left data source is single-select | boolean | — | false |
| openAll | Whether tree nodes are expanded by default | boolean | — | true |
| filterable | Whether searchable | boolean | — | false |
| filter-placeholder | Search box placeholder | string | — | Please enter search content |
| filter-method | Custom search method | function | — | — |
| titles | Custom titles | array | — | ['Source', 'Target'] |
| button-texts | Custom button texts | array | — | [ ] |
| listSortFifo | Right list sorting method: default true - nodes sorted by selection order; optional false - nodes sorted by left tree structure | boolean | — | true |

### Slot

| Name | Description |
|------|--------|
| left-footer | Content at the bottom of left list |
| right-footer | Content at the bottom of right list |

### Methods

| Method | Description | Parameters |
| ---- | ---- | ---- |
| clearQuery | Clear search keywords for a panel | 'left' / 'right' / 'all', specify which search box to clear |
| getTreeChecked | Get all checked states of left tree | 'leftKeys', 'leftHarfKeys', 'leftNodes', 'leftHalfNodes' |

### Events

| Event Name | Description | Callback Parameters |
|---------- |-------- |---------- |
| change | Triggered when options are transferred between panels | Current value, transfer direction ('left' / 'right'), array of transferred data keys |
| left-check-change | Triggered when left list elements are checked/unchecked by user | Array of currently checked element keys, array of keys whose check state changed |
| right-check-change | Triggered when right list elements are checked/unchecked by user | Array of currently checked element keys, array of keys whose check state changed |

:::tip
Based on `element-tree-transfer-pro` component. For Vue 2 version documentation, please refer to: [element-tree-transfer-pro](https://github.com/Herozzq/element-tree-transfer-pro)
:::
