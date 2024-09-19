<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import Rule from "@/components/rule/index.vue";
</script>
<template>
  <router-view />
  <Rule />
</template>

<style lang="less">
@import "./assets/style/common.less";

.main {
  color: var(--van-text-color);
  height: 100%;
  background-color: var(--van-background) no-repeat center;
}
</style>
