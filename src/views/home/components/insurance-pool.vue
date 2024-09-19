<script setup lang="ts" name="insurance-pool">
import { useCommonStore, useRedSpiderStore, useAvailableStore } from "@/store";
import { computed, ref } from "vue";
const initStart = computed(() => useCommonStore().homeStatus);
const InsurancePool = computed(() => useRedSpiderStore().InsurancePool);
const RSTBalanceOf = computed(() => useAvailableStore().RSTBalanceOf);

const toPayRST = () => {
  window.open(`${import.meta.env.VITE_APP_PAYRST}`, "");
};
const showPopover = ref(false);
const showPopover2 = ref(false);
const formatNumber = (inputNumber: number): number => {
  if (inputNumber < 1000) {
    // 当输入小于1000时，保留两位小数
    return parseFloat(inputNumber.toFixed(2));
  } else {
    // 当输入大于等于1000时，取整数部分
    return Math.floor(inputNumber);
  }
};
</script>

<template>
  <div>
    <!-- <van-loading class="pool-text" v-if="initStart" /> -->

    <div class="pool">
      <div class="pool-title">SAFE POOL</div>
      <div class="pool-box">
        <div class="pool-main-views-title">- 分紅池 -</div>
        <div class="pool-main-views-box">
          <van-loading class="loading-font-size-xs" v-if="initStart" />
          <div style="flex: 1; text-align: right" v-else class="van-ellipsis">
            <!-- {{ InsurancePool.amount }} RST -->
            <span class="van-ellipsis"
              >{{ formatNumber(Number(InsurancePool.amount)) }} RST</span
            >
          </div>
          <div style="flex: 0.1; text-align: center">≈</div>
          <van-loading class="loading-font-size-xs" v-if="initStart" />
          <div style="flex: 1; text-align: left" v-else>
            <span class="van-ellipsis">
              {{ formatNumber(Number(InsurancePool.priceTotal)) }} USDT</span
            >
          </div>
        </div>
        <div class="main-button">
          <div class="pay-rst" @click="toPayRST">
            <div>點擊購買RST</div>
            <van-icon name="arrow" />
          </div>

          <div class="tips">
            <van-popover placement="top" v-model:show="showPopover">
              <div class="van-popover-box">
                <div class="van-popover-title">可用額度</div>
                <div class="van-popover-number">
                  {{ formatNumber(Number(RSTBalanceOf)) }}USDT
                </div>
              </div>
              <template #reference>
                <div class="van-hairline--bottom">買賣額度</div>
              </template>
            </van-popover>

            <van-popover placement="top" v-model:show="showPopover2">
              <div class="van-popover-tips">
                根據“紅蜘蛛協定”訂單金額50%來獲取購買額度。
              </div>
              <template #reference>
                <van-icon class="icon" name="question-o" />
              </template>
            </van-popover>
          </div>
        </div>
        <img
          class="pool-main-bottom"
          src="./../../../assets/images/pool-main-bottom.png"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.pool {
  width: 318px;
  margin-top: 2px;
  position: relative;

  .pool-title {
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

  .pool-box {
    width: 319px;
    height: 135px;
    background: #e5f1f4;
    border-radius: 0px 0px 8px 8px;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    .pool-main-views-title {
      padding-top: 16px;
      font-size: 14px;
      font-weight: 400;
      color: #57767d;
      text-align: center;
    }

    .pool-main-views-box {
      width: 90%;
      font-size: 14px;
      font-weight: 800;
      color: #303942;
      display: flex;
      justify-content: center;
      padding: 0px 4px;
      margin-top: 8px;
      display: flex;
    }
    .main-button {
      position: relative;
      .pay-rst {
        width: 131px;
        height: 29px;
        background: #1d252f;
        border-radius: 4px 0px 4px 0px;
        margin-top: 16px;
        font-size: 15px;
        color: #d6ff4b;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
      }
      .tips {
        width: 80px;
        height: 16px;
        font-size: 11px;
        color: #57767d;
        position: absolute;
        right: -86px;
        bottom: 6px;
        text-align: center;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .icon {
          font-size: 16px;
        }
      }
    }

    .pool-main-bottom {
      position: absolute;
      bottom: 0;
    }
  }
}
.van-popover-box {
  padding: 12px;
  width: 140px;
  text-align: center;
  .van-popover-title {
    font-size: 12px;
    font-weight: 400;
    color: #57767d;
  }
  .van-popover-number {
    font-size: 12px;
    font-weight: 800;
    color: #303942;
  }
}

.van-popover-tips {
  padding: 12px;
  width: 78px;
  text-align: center;
  font-size: 12px;
  color: #303942;
}
</style>
