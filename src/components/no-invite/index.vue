<script setup lang="ts">
import { useCommonStore } from "@/store";
import { showFailToast } from "vant";
import { ref } from "vue";
import { isAddress } from "web3-validator";
const emit = defineEmits(["close", "toBind"]);

const noInvite = ref(false);
const address = ref("");
const close = () => {
  emit("close", false);
};
const bindAddress = async () => {
  if (address.value !== "" && !isAddress(address.value)) {
    showFailToast("請輸入正確的地址");
    return;
  }

  if (
    address.value !== "" &&
    address.value.toLowerCase() == useCommonStore().address.toLowerCase()
  ) {
    showFailToast("不能綁定自己");
    return;
  }
  emit("toBind", address.value || "0x0000000000000000000000000000000000000000");
};
</script>

<template>
  <van-overlay v-model:show="noInvite" class-name="overlay">
    <div class="rule-box">
      <div class="rule-box-title">請輸入蛛網地址</div>
      <van-field v-model="address" class="input" />
      <div class="rule-box-button">
        <div @click="close" class="box-close">取消</div>
        <div @click="bindAddress" class="rule-box-button-next">繼續交易</div>
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
    text-align: center;
  }
  .input {
    // background: #d9daf3;
    margin-top: 22px;
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

:deep(#van-field-1-input::placeholder) {
  color: #000; /* 你想要的颜色值 */
}
:deep(.van-cell:after) {
  border: none;
}
</style>
