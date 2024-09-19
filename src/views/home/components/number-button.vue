<script setup lang="ts" name="number-button">
import { useRedSpiderStore, useCommonStore } from "@/store";
import { computed } from "vue";
const total = computed(() => useRedSpiderStore().total);
const initStart = computed(() => useCommonStore().homeStatus);
</script>

<template>
  <div class="number">
    <div class="number-title">ACCUMULATED QUANTITY</div>
    <div class="number-main">
      <div class="number-main-views">
        <div class="number-main-views-title">- 纍計數量 -</div>
        <div class="number-main-views-box">
          <van-loading class="pool-text" v-if="initStart" />
          <div v-else class="number-main-views-number van-ellipsis">
            {{ total.total }}
          </div>
          <div>USDT</div>
        </div>
      </div>
    </div>
    <img
      class="number-bottom"
      src="./../../../assets/images/number-main-bottom.png"
    />
  </div>
</template>

<style scoped lang="less">
.number {
  width: 318px;
  margin-top: 11px;
  position: relative;

  .number-title {
    height: 28px;
    width: 100%;
    border-radius: 8px 8px 0px 0px;
    font-weight: 800;

    font-size: 12px;
    color: #e5f1f4;
    text-align: center;
    line-height: 28px;
    background: #1d252f
      url("./../../../assets/images/index-title-background.png") no-repeat left;
    background-size: auto 45%;
    background-position: 10px center; /* 调整水平位置来向右移动 */
  }

  .number-main {
    height: 150px;
    background: url("./../../../assets/images/number-main-background.png")
      no-repeat center;
    background-size: auto 100%;
    display: grid;
    place-items: center;
    .number-main-views {
      width: 295px;
      height: 96.5px;
      background: #e5f1f4;
      border-radius: 4px;
    }

    .number-main-views-title {
      padding-top: 16px;
      font-size: 14px;
      font-weight: 400;
      color: #57767d;
      text-align: center;
    }

    .number-main-views-box {
      font-size: 28px;
      font-weight: 800;
      color: #303942;
      display: flex;
      justify-content: center;
      padding: 0px 4px;
      margin-top: 4px;
      .number-main-views-number {
        text-shadow: 0px 1px 0px #623d72;
        text-align: right;
        padding: 0px 4px;
      }
    }
  }

  .number-bottom {
    position: absolute;
    bottom: -4.6px;
    left: 50%; /* 设置图像左侧距离父容器左侧的位置为50% */
    transform: translate(
      -50%,
      -50%
    ); /* 使用transform将图像的中心点定位到父容器的中心点 */
    width: 283px;
    height: 3px;
  }
}
</style>
