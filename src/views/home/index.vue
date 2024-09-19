<script setup lang="ts" name="home">
import { onMounted, computed, ref } from "vue";

import { RedSpiderFactory } from "@/web3-hash/redSpider/RedSpiderFactory";
import { AvailableFactory } from "@/web3-hash/available/AvailableFactory";
import { Address } from "@/web3-hash/Contract/type";
import {
  constantEnumAPI,
  getParentAPI,
  getNotifyAPI,
  getAirdropAPI,
  getRedEnvelopeAPI
} from "@/api";
import { checkChain, getAddress } from "@/web3-hash/abi";
import { useRoute, useRouter } from "vue-router";
// import NumberButton from "@/views/home/components/number-button.vue";
import InsurancePool from "@/views/home/components/insurance-pool.vue";
import BottomButton from "@/views/home/components/bottom-button.vue";
import StartPopup from "@/components/start-popup/index.vue";
import Notify from "@/components/notify/index.vue";
import FallingGif from "@/components/FallingGif/index.vue";
import AirdropWindow from "@/components/airdrop/index.vue";

import {
  useCommonStore,
  useAvailableStore,
  useRedSpiderStore,
  useWalletStore
} from "@/store";
const globalStatus = computed(() => useCommonStore().globalStatus);
const firstOpen = computed(() => useCommonStore().firstOpening);
const InsuranceConfig = computed(() => useRedSpiderStore().InsurancePool);
const paused = computed(() => useCommonStore().paused);

const startPopupViewStatus = ref(false);
const closeStartPopup = (start: boolean) => {
  startPopupViewStatus.value = start;
  useCommonStore().update_closePopupStart(false);
};

// ********

const route = useRoute();
const router = useRouter();
const {
  update_payToken,
  UPDATE_POOL,
  update_InsurancePool,
  update_authorityUSDT,
  update_redSpiderContract,
  update_rate,
  update_total
} = useRedSpiderStore();
const {
  update_globalStatus,
  update_homeStatus,
  update_constantStatusEnum,
  update_clickProject,
  update_paused
} = useCommonStore();
const { update_contract } = useAvailableStore();
const { update_Parent } = useWalletStore();
// 页面属性
const refreshStatus = ref(false);
const onRefresh = async () => {
  refreshStatus.value = true;
  await initContract(false);
};

// 合约
const redSpider = new RedSpiderFactory().make(
  new Address(import.meta.env.VITE_CONTRACT_RED_SPIDER_ADDRESS)
);

// 入场参数
const AdmissionParam = async (payToken: string) => {
  useRedSpiderStore().update_admissionParam(
    await useRedSpiderStore().redSpiderContract.getAdmissionParam(payToken)
  );
};
const notifyText = ref("");
// 通知
const viewNotify = async () => {
  const notifyLocal = JSON.parse(localStorage.getItem("notify") || "{}");
  const nowTime = new Date().getTime();
  const notifyRes = await getNotifyAPI();

  if (nowTime - notifyLocal.time < 86400000) {
    if (notifyRes.data.text !== notifyLocal.text) {
      notifyText.value = notifyRes.data.text;
      useCommonStore().update_notifyStatus(true);
      localStorage.setItem(
        "notify",
        JSON.stringify({
          time: new Date().getTime(),
          text: notifyRes.data.text
        })
      );
    }
    return;
  }
  if (notifyRes.data.text) {
    notifyText.value = notifyRes.data.text;
    useCommonStore().update_notifyStatus(true);
    localStorage.setItem(
      "notify",
      JSON.stringify({
        time: new Date().getTime(),
        text: notifyRes.data.text
      })
    );
  }
};

// 红包
const getRedEnvelope = async () => {
  const res: any = await getRedEnvelopeAPI({
    search: {
      address: useCommonStore().address
    }
  });
  if (res.code === 0) {
    useWalletStore().update_red_info(res.data.list);
  }
};

// 空頭
const getAirdrop = async () => {
  const airdropParams: any = await getAirdropAPI({
    search: {
      address: useCommonStore().address
    }
  });
  if (airdropParams.code === 0) {
    useWalletStore().update_airdrop_info(airdropParams.data.list);
  }
};

// 初始化数据
const initContract = async (start: boolean = true) => {
  try {
    update_homeStatus(true);
    update_globalStatus(start);
    update_redSpiderContract(redSpider as any);

    const systemConfig =
      await useRedSpiderStore().redSpiderContract.getSystemParam();

    if (systemConfig.paused) {
      update_paused(systemConfig.paused);
      update_globalStatus(false);
      return;
    }

    const checkChainRes = await checkChain();

    if (checkChainRes) await getAddress();

    const payToken = await redSpider.getPayTokenFunc();

    update_payToken(payToken);

    // 是否授权
    const allowance = await useRedSpiderStore().payTokenErc20.allowance(
      new Address(useCommonStore().address),
      new Address(import.meta.env.VITE_CONTRACT_RED_SPIDER_ADDRESS)
    );
    await getRedEnvelope();

    await getAirdrop();

    const status =
      typeof allowance === "bigint"
        ? allowance > BigInt(0)
        : BigInt(allowance) > BigInt(0);
    update_authorityUSDT(status);
    update_globalStatus(false);
    await initParent();

    update_InsurancePool(
      await useRedSpiderStore().redSpiderContract.getInsurancePoolFunc()
    );
    update_contract(
      new AvailableFactory().make(new Address(InsuranceConfig.value.token))
    );

    UPDATE_POOL(await redSpider.getPoolBalanceOf(payToken));
    update_constantStatusEnum(await constantEnumAPI());
    update_total(await redSpider.getTotal(payToken));

    // 红包和空投

    // 初始化弹窗参数
    startPopupViewStatus.value = false;

    await AdmissionParam(payToken);
    update_rate();
    refreshStatus.value = false;
    update_homeStatus(false);
  } catch (error) {
    refreshStatus.value = false;
    update_globalStatus(false);
    console.log(error);
  }
};

const initParent = async () => {
  try {
    const { data } = await getParentAPI({
      search: { owner: useCommonStore().address },
      condition: {}
    });
    if (data?.parent === "0x0000000000000000000000000000000000000000") {
      if (route.query?.parent) {
        if (useCommonStore().address === route.query.parent) return;
        update_Parent(route.query.parent as string);
      } else {
        update_Parent(data?.parent);
      }
    } else {
      update_Parent(data?.parent as string);
    }
  } catch (error) {
    return error;
  }
};

onMounted(async () => {
  if (firstOpen.value) {
    await initContract();
    await viewNotify();
  }
  window.ethereum.on("accountsChanged", async (accounts: string) => {
    if (accounts && accounts.length) {
      await getAddress();
      await initContract();
      update_clickProject(false);
    }
  });
  if (route.query?.open) {
    startPopupViewStatus.value = true;
    router.replace({ name: "home", params: {} }); // 删除参数
  }
});
</script>

<template>
  <van-pull-refresh v-model="refreshStatus" @refresh="onRefresh">
    <main>
      <!-- <div class="main-rule" @click="viewRule">規則</div> -->
      <img class="main-title" src="./../../assets/images/index-title.png" />
      <!-- <NumberButton /> -->
      <InsurancePool />
      <BottomButton @start="startPopupViewStatus = true" />
      <StartPopup
        :show-bottom="startPopupViewStatus"
        @closed="closeStartPopup"
      />
      <div class="bottom-link">
        <a class="box" href="https://x.com/RedSpiderProto?s=09" target="_blank">
          <img src="./../../assets/images/x.png" />
        </a>
        <a
          class="box box-border"
          href="https://t.me/RedSpiderProtocol"
          target="_blank"
        >
          <img src="./../../assets/images/te.png" />
        </a>
        <a
          class="box"
          href="https://bscscan.com/address/0x9fF6B2BcFb82C41B8D9131EA4509d8A2Bf55D702"
          target="_blank"
        >
          <img src="./../../assets/images/bnb.png" />
        </a>
      </div>
    </main>
    <van-toast
      v-model:show="globalStatus"
      style="padding: 0"
      :duration="0"
      type="loading"
      :forbidClick="true"
    />
    <van-overlay :show="paused">
      <div class="wrapper" @click.stop>
        <img src="./../../assets/images/paused.png" class="block" />
        <div class="text">修復蛛網中...</div>
      </div>
    </van-overlay>
  </van-pull-refresh>
  <Notify :notifyText="notifyText" />

  <FallingGif @claim-done="getRedEnvelope" />

  <AirdropWindow @airdrop-claim-done="getAirdrop" />
</template>

<style scoped lang="less">
main {
  min-height: 100vh;
  background: url("../../assets/images/index_background.png") no-repeat center;
  background-size: cover;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  color: var(--van-white);
  position: relative;
  font-size: 16px;
  overflow-y: auto; /* 垂直滚动条 */

  .main-rule {
    background: #ffffff4d;
    border-radius: 21px 0px 0px 21px;
    padding: 4px 8px;
    position: relative;
    margin-left: auto;
    top: 20px;
    font-size: 16px;
  }
  .main-title {
    width: 199.5px;
    height: 41px;
    margin-top: 89px;
    margin-bottom: 90px;
  }
  .bottom-link {
    position: absolute;
    bottom: 0;
    width: 100vw;
    height: 52px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    .box {
      background: rgba(37, 32, 58, 0.7);
      box-sizing: border-box;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 27px;
        height: 27px;
      }
    }

    .box-border {
      position: relative;
    }

    .box-border::before,
    .box-border::after {
      content: "";
      position: absolute;
      width: 1px; /* 边框宽度 */
      height: 52px; /* 边框高度 */
      background: rgba(255, 255, 255, 0.2); /* 边框颜色和透明度 */
    }

    .box-border::before {
      left: 0;
    }

    .box-border::after {
      right: 0;
    }
  }
}
.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .block {
    width: 154px;
    height: 149.5px;
    margin-bottom: 26px;
  }
  .text {
    height: 21px;
    font-size: 15px;
    color: #d6ff4b;
  }
}
</style>
<!-- @/web3-hash/redSpider/RedSpiderFactory -->
