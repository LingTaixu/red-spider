<template></template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCommonStore } from "@/store";
const paused = computed(() => useCommonStore().paused);
</script>

<style scoped lang="less">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
</style>
