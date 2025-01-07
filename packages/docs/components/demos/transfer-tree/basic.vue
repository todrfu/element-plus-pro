<script setup>
import { ref } from 'vue'
import { TransferTree } from '@todrfu/element-plus-pro'

const data = ref([
  {
    id: '1',
    label: '节点1',
    children: [
      { id: '1-1', label: '节点1-1' },
      { id: '1-2', label: '节点1-2' }
    ]
  },
  {
    id: '2',
    label: '节点2',
    children: [
      { id: '2-1', label: '节点2-1' },
      { id: '2-2', label: '节点2-2' }
    ]
  }
])
</script>

<template>
  <TransferTree
    filterable
    :data-source="data"
    :titles="['源列表', '目标列表']"
  />
</template>