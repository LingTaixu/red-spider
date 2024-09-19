<script setup lang="ts">
import { hashPush } from "@/api";
import { useCommonStore, useRedSpiderStore } from "@/store";
import { headerSliceAddress } from "@/utils/web3";
import ChainFactory from "@/web3-hash/Contract/ChainFactory";

import { ref } from "vue";
import { onMounted } from "vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const viewParams: any = computed(() => route.query);
const isClaim = ref(false);
console.log(viewParams.value, "viewParams");

const { redSpiderContract } = useRedSpiderStore();
const renderView: any = [
  { key: "參與數量", value: viewParams.value.amount },
  { key: "訂單編號", value: viewParams.value.orderId },
  { key: "參與時間", value: viewParams.value.startTime },
  { key: "領取時間", value: viewParams.value.endTime },
  { key: "領取憑證", value: viewParams.value.claimHash },
  {
    key: "參與憑證",
    value: viewParams.value.createdHash as string
  }
];
const toChrome = (hash: any) => {
  window.open(`${import.meta.env.VITE_APP_BROWSER}${hash}`, "");
};
const refreshStatus = ref(false);
const onRefresh = async () => {
  isClaim.value =
    new Date(viewParams.value.endTime).getTime() < new Date().getTime() &&
    Number(viewParams.value.status) !== 6;
  setTimeout(() => {
    refreshStatus.value = false;
  }, 200);
};
const buttonLoadingStatus = ref(false);
const checkClaim = async () => {
  buttonLoadingStatus.value = true;
  const res: any = await redSpiderContract.getClaimStatus(
    viewParams.value.orderId
  );
  console.log(res, "res");

  if (res.status === "5") {
    buttonLoadingStatus.value = false;
    useCommonStore().update_orderStatusShow(true);
    useRedSpiderStore().update_claimAmount(res.needAmount);
    return;
  } else if (res.status === "2") {
    await orderClaim();
    return;
  } else if (res.status === "3") {
    await liquidateOrder();
  }
};

const orderClaim = async () => {
  await redSpiderContract
    .claimContract(viewParams.value.orderId)
    .then(async (hash: any) => {
      try {
        await hashPush({
          data: {
            hash
          },
          condition: {}
        });
      } catch (error) {
        console.log(error);
      }
      new ChainFactory().checkHash(
        hash,
        "領取訂單",
        (status: any, res: any) => {
          buttonLoadingStatus.value = false;
          if (status && res.logs) {
            // resolveEvent(redId);
          }
        }
      );
    })
    .catch(() => {
      buttonLoadingStatus.value = false;
    });
};
const liquidateOrder = async () => {
  await redSpiderContract
    .liquidateContract(viewParams.value.orderId)
    .then(async (hash: any) => {
      try {
        await hashPush({
          data: {
            hash
          },
          condition: {}
        });
      } catch (error) {
        console.log(error);
      }
      new ChainFactory().checkHash(
        hash,
        "領取賠付訂單",
        (status: any, res: any) => {
          if (status && res.logs) {
            buttonLoadingStatus.value = false;
            // emit("claimEnd");
          }
        }
      );
    })
    .catch(() => {
      buttonLoadingStatus.value = false;
    });
};
onMounted(() => {
  isClaim.value =
    new Date(viewParams.value.endTime).getTime() < new Date().getTime() &&
    Number(viewParams.value.status) !== 6;
});
</script>
<template>
  <van-pull-refresh v-model="refreshStatus" class="box" @refresh="onRefresh">
    <div class="main">
      <header>
        <div class="header-title">領取數量</div>
        <div class="header-title-claim">
          {{ viewParams.claimAmount }}
          {{ viewParams.status === "4" ? "RST" : "USDT" }}
        </div>
      </header>
      <div
        class="detail-list"
        v-for="item in renderView"
        :key="(item.value as string)"
        :class="{ 'border-bottom': true }"
      >
        <div class="detail-list-label">
          {{ item.key }}
        </div>

        <!-- key为hash时候千万领取 -->
        <div
          class="detail-list-data"
          v-if="item.key !== '領取憑證' && item.key !== '參與憑證'"
        >
          {{ item.value }}
        </div>

        <div
          class="detail-list-data"
          v-else-if="item.key === '參與憑證'"
          @click="toChrome(item.value)"
        >
          {{ headerSliceAddress(item.value) }}

          <img
            v-if="item.value?.length > 1"
            class="detail-list-data-icon"
            src="../../assets/images/detail-to.png"
          />
        </div>

        <div class="detail-list-data" v-else @click="toChrome(item.value)">
          {{ item.value?.length > 1 ? headerSliceAddress(item.value) : "" }}
          <img
            v-if="item.value?.length > 1"
            class="detail-list-data-icon"
            src="../../assets/images/detail-to.png"
          />
        </div>
      </div>
      <div
        v-if="isClaim && viewParams.status === '2'"
        @click="checkClaim"
        class="claim"
      >
        領取收益
      </div>
      <div v-if="viewParams.status === '3'" @click="checkClaim" class="claim">
        領取賠付
      </div>
    </div>
    <van-toast :duration="0" v-model:show="buttonLoadingStatus" type="loading">
      <template #message>領取中...</template>
    </van-toast>
  </van-pull-refresh>
</template>

<style scoped lang="less">
.box {
  height: 100%;
}
.main {
  background: #1d0e4f;
  padding: 28px 16px;
  box-sizing: border-box;
  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 28px;
    width: 343px;
    height: 75.5px;
    justify-content: center;
    background: linear-gradient(
        90deg,
        rgba(85, 198, 255, 0.9),
        rgba(153, 241, 255, 0.9) 41%,
        rgba(202, 189, 255, 0.9)
      ),
      url("./../../assets/images/detail-title.png") no-repeat;
    background-size: cover;

    border-radius: 16px 0px 16px 0px;
    .header-title {
      font-weight: 400;
      color: #999999;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .header-title-claim {
      font-size: 18px;
      color: #303942;
    }
  }
  .detail-list {
    padding: 10px 0px;
    display: flex;

    .detail-list-label {
      font-weight: 400;
      text-align: left;
      color: #8e87a7;
      font-size: 14px;
      margin-right: 32px;
    }

    .detail-list-data {
      flex: 1;
      font-size: 14px;
      display: flex;
      color: #ffffff;
      .detail-list-data-icon {
        width: 16px;
        height: 16px;
        margin-left: 12px;
      }
    }
  }
}
.border-bottom {
  border-bottom: 0.5px solid #342761; /* 设置下边框的样式 */
}
.claim {
  width: 319px;
  height: 56px;
  background: #d6ff4b;
  border-radius: 16px 0px 16px 0px;
  box-shadow: 1.5px 1.5px 0px 0px rgba(0, 0, 0, 0.16);
  font-size: 20px;
  color: #304009;
  line-height: 56px;
  text-align: center;
  margin: 44px auto;
}
</style>
