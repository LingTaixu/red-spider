<template>
  <div class="empty">
    <img class="empty-img" src="../../assets/images/empty.png" />
    <div class="empty-text">暫無數據</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.empty {
  min-height: 600px;
  width: 100%;
  background: #1d0e4f;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
}
.empty-img {
  margin: 0 auto;
  width: 40%;
}
.empty-text {
  font-size: 14px;
  color: #b2b5b8;
  margin-top: 16px;
}
</style>
