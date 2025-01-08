<script setup>
import { ref } from "vue";
import { TransferTree } from "@todrfu/element-plus-pro";

const data = ref([
  {
    id: "1",
    label: "Node 1",
    children: [
      {
        id: "1-1",
        label: "Node 1-1",
      },
      {
        id: "1-2",
        label: "Node 1-2",
      },
    ],
  },
  {
    id: "2",
    label: "Node 2",
    children: [],
  },
]);
</script>

<template>
  <TransferTree filterable :defaultCheckedKeys="['1']" :data-source="data" />
</template>
