<script setup lang="ts" name="bottom-button">
import { useCommonStore, useRedSpiderStore } from "@/store";
import { Address } from "@/web3-hash/Contract/type";
import ChainFactory from "@/web3-hash/Contract/ChainFactory";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { showLoadingToast } from "vant";
import { debounce } from "lodash";
const router = useRouter();
const emit = defineEmits(["start"]);
const { update_authorityUSDT } = useRedSpiderStore();
const payTokenErc20 = computed(() => useRedSpiderStore().payTokenErc20);
const initStart = computed(() => useCommonStore().homeStatus);
const allowanceStatus = computed(() => useRedSpiderStore().authorityFromHUSD);
const start = async () => {
  useCommonStore().update_closePopupStart(true);
  emit("start");
};

const toList = () => {
  router.push("/order");
};
const toAllowance = debounce(
  async () => {
    showLoadingToast({
      duration: 0,
      message: "授权中...",
      forbidClick: true
    });

    const hash = await payTokenErc20.value
      .approve(new Address(import.meta.env.VITE_CONTRACT_RED_SPIDER_ADDRESS))
      .catch(error => {
        return;
      });
    console.log(hash, "hash");

    await new ChainFactory().checkHash(hash, "授权", (status: number) => {
      update_authorityUSDT(Boolean(status));
    });
  },
  300,
  {
    leading: true,
    trailing: false
  }
);
</script>

<template>
  <div v-if="!allowanceStatus" class="bottom-button-main" @click="toAllowance">
    授權
  </div>

  <div v-else-if="initStart" class="bottom-button-main"><van-loading /></div>

  <div @click="start" v-else class="bottom-button-main">開啓</div>
  <div class="bottom-navigation">
    <RouterLink to="/level" class="bottom-navigation-button"
      >我的等級</RouterLink
    >
    <RouterLink to="/order" class="bottom-navigation-button"
      >我的訂單</RouterLink
    >
  </div>
</template>

<style scoped lang="less">
.bottom-button-main {
  width: 319px;
  height: 56px;
  background: #d6ff4b;
  border-radius: 16px 0px 16px 0px;
  box-shadow: 1.5px 1.5px 0px 0px rgba(0, 0, 0, 0.16);
  font-size: 20px;
  color: #304009;
  text-align: center; /* 水平居中 */
  line-height: 56px;
  margin-top: 40.5px;
  margin-bottom: 38.5px;
}

.bottom-navigation {
  display: flex;
  margin-bottom: 50px;
  width: 319px;
  justify-content: space-between;
  .bottom-navigation-button {
    width: 110px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    opacity: 0.8;
    background: #262433;
    border-radius: 12px 0px 12px 0px;
  }
}
</style>
