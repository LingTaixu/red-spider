<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { claimAirdropAPI } from "@/api";
import { useWalletStore } from "@/store";
import "vant/es/notify/index.css";
import { showNotify } from "vant";
const airdropArray = computed(() => useWalletStore().airdropInfo);
const emits = defineEmits(["airdropClaimDone"]);
const airdropWindow = ref(false);
const airdropInfo = ref({
  airdropLogId: "",
  amount: "",
  symbol: ""
});

watch(
  () => airdropArray.value,
  () => {
    console.log(airdropArray.value, "1");

    if (airdropArray.value.length >= 1) {
      airdropInfo.value = airdropArray.value[0];
      airdropWindow.value = true;
    } else {
      airdropWindow.value = false;
    }
  },
  { deep: true }
);

const claimStatus = ref(true);
const claimAirdrop = async () => {
  claimStatus.value = false;
  const res: any = await claimAirdropAPI({
    search: {
      airdropLogId: airdropInfo.value.airdropLogId
    }
  });
  if (res.code === 0) {
    showNotify({
      message: "領取成功！",
      type: "success"
    });
    emits("airdropClaimDone");
  }
};
</script>

<template>
  <van-overlay v-model:show="airdropWindow" class-name="overlay">
    <div class="rule-box">
      <div class="rule-box-title">福利空頭</div>
      <div class="rule-box-text">恭喜您達成成就，特爲您派送</div>
      <div class="rule-box-number">
        <span class="number">{{ airdropInfo.amount }}</span>
        <span class="symbol">{{ airdropInfo.symbol }}</span>
      </div>
      <div class="rule-box-button">
        <div
          @click="claimAirdrop"
          v-if="claimStatus"
          class="rule-box-button-next"
        >
          領取空頭
        </div>
        <van-loading
          v-else
          size="24px"
          class="rule-box-button-next"
        ></van-loading>
      </div>
    </div>
  </van-overlay>
</template>

<style scoped lang="less">
.overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.rule-box {
  position: relative;
  width: 311px;
  height: 175px;
  background: #d9daf3;
  border-radius: 20px 0px 20px 0px;
  -webkit-scrollbar {
    display: none;
  }
  top: 30%;
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
    padding: 36px 64.5px 0px 64.5px;
    height: 20px;
    color: #303942;
    line-height: 21px;
    font-weight: 400;
    font-size: 14px;
    text-align: center;
  }

  .rule-box-number {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 12px;
    .number {
      font-size: 28px;
      font-weight: 800;
      text-align: left;
      color: #f21350;
    }
    .symbol {
      line-height: 40px;
      margin-left: 6px;
    }
  }
  .input {
    // background: #d9daf3;
    margin-top: 22px;
  }

  .rule-box-button {
    position: absolute;
    bottom: -50%; /* 将 bottom 设为 50%，垂直方向上的中心位置 */
    transform: translateX(34%); /* 使用 transform 进行垂直居中的调整 */
    display: flex;
    width: 184px;
    height: 67.5px;
    justify-content: center;
    background: url("./../../assets/images/claim-button.png") no-repeat center;
    background-size: auto 100%;
    align-items: center;
    .rule-box-button-next {
      width: 80px;
      height: 28px;
      font-size: 20px;
      font-weight: 800;
      text-align: left;
      color: #ffffff;
      text-shadow: 0px 0.5px 2px #a91ae4;
    }
  }
}
</style>
