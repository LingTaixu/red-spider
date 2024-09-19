<script setup lang="ts" name="rule">
import { useCommonStore, useRedSpiderStore, useWalletStore } from "@/store";
import { useRouter } from "vue-router";
import { computed } from "vue";
const show = computed(() => useCommonStore().orderStatusShow);
const claimAmount = computed(() => useRedSpiderStore().claimAmount);

const router = useRouter();
// 去往首页 初始化数据后启航
const toHomeInit = () => {
  router.push({
    path: "/home",
    query: {
      open: 1,
      parent: useWalletStore().parent
    }
  });
  useCommonStore().update_orderStatusShow(false);
};

const close = () => {
  useCommonStore().update_orderStatusShow(false);
};
</script>

<template>
  <van-overlay v-model:show="show" class-name="overlay">
    <div class="rule-box">
      <div class="rule-box-title">領取收益</div>
      <div class="rule-box-text">
        參與中的訂單金額必須達到{{ claimAmount }}USDT才能領取
      </div>
      <div class="rule-box-button">
        <div @click="close" class="box-close">再想想</div>
        <div @click="toHomeInit" class="rule-box-button-next">立即參與</div>
      </div>
    </div>
  </van-overlay>
</template>

<style scoped lang="less">
.overlay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.rule-box-close {
  position: absolute;
  z-index: 999999;
  top: 0;
  left: 0;
  right: 0;
  bottom: -50%;
  margin: auto;
  width: 28px;
}
.rule-box {
  position: relative;
  width: 311px;
  height: 128.5px;
  background: #d9daf3;
  border-radius: 20px 0px 20px 0px;
  -webkit-scrollbar {
    display: none;
  }
  .rule-box-title {
    width: 311px;
    height: 36px;
    background: linear-gradient(153deg, #8c6aeb 17%, #c670e2);
    border-radius: 20px 0px 0px 0px;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    text-align: center;
    line-height: 36px;
  }

  .rule-box-text {
    color: #303942;
    line-height: 21px;
    font-weight: 400;
    font-size: 14px;
    padding: 24px 22px 27px 36px;
  }
  .rule-box-button {
    position: absolute;
    bottom: -50%;
    display: flex;
    width: 311px;
    justify-content: space-between;
    .rule-box-button-next {
      width: 200px;
      height: 40px;
      background: #d6ff4b;
      border-radius: 20px;
      font-size: 16px;
      color: #190840;
      line-height: 40px;
      text-align: center;
    }
    .box-close {
      width: 95px;
      height: 40px;
      border: 0.5px solid #d9daf3;
      border-radius: 20.5px;
      font-size: 14px;
      color: #d9daf3;
      line-height: 40px;
      text-align: center;
    }
  }
}
</style>
