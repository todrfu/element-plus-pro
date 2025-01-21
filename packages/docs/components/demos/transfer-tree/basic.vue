<script setup>
import { ref } from 'vue'
import { TransferTree } from '@otdrfu/element-plus-pro'

const data = ref([
  {
    id: '1',
    label: 'Node 1',
    children: [
      { id: '1-1', label: 'Node 1-1' },
      { id: '1-2', label: 'Node 1-2' }
    ]
  },
  {
    id: '2',
    label: 'Node 2',
    children: [
      { id: '2-1', label: 'Node 2-1' },
      { id: '2-2', label: 'Node 2-2' }
    ]
  }
])
</script>

<template>
  <TransferTree
    filterable
    :data-source="data"
  />
</template>
