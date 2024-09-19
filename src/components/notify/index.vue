<script setup lang="ts" name="rule">
import { useCommonStore } from "@/store";
import { computed } from "vue";
const show = computed(() => useCommonStore().notifyStatus);
const props = defineProps({
  notifyText: {
    default: ""
  }
});
const close = () => {
  useCommonStore().update_notifyStatus(false);
};
</script>

<template>
  <van-overlay :show="show" @click="show = false">
    <div class="notify-box">
      <div class="notify-main">
        <div class="notify-header">公告</div>
        <div v-html="notifyText" class="notify"></div>
      </div>
      <img @click="close" src="./../../assets/images/notify-close.png" />
    </div>
  </van-overlay>
</template>

<style scoped lang="less">
.notify-box {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100vh; /* 为了垂直居中，设置容器高度为视口高度 */
  .notify-main {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .notify-header {
    height: 36px;
    background: #1d252f;
    border-radius: 20px 0px 0px 0px;
    font-size: 16px;
    color: #c3b9ff;
    line-height: 36px;
    text-align: center;
  }
  .notify {
    width: 311px;
    max-width: 311px;
    min-height: 50vh;
    max-height: 75vh;
    background: #d9daf3;
    border-radius: 0px 0px 20px 0px;
    padding: 24px 22.5px;
    overflow: scroll;
  }

  img {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 36px;
    height: 36px;
  }
}
</style>
