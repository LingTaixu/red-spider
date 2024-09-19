<script setup lang="ts" name="orderItem">
import { computed } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCommonStore, useRedSpiderStore } from "@/store";
import ChainFactory from "@/web3-hash/Contract/ChainFactory";
import { closeDialog, showLoadingToast } from "vant";
import { hashPush } from "@/api/index";
import { watch } from "vue";

const { redSpiderContract } = useRedSpiderStore();
const router = useRouter();
const emit = defineEmits(["claimEnd"]);
const rate = computed(() => useRedSpiderStore().rate);

const props = defineProps({
  number: {
    type: Number,
    required: true,
    default: 0
  },
  data: {
    type: Object,
    required: true
  }
});
interface EnumItem {
  [key: string]: any;
}
const enumItem: EnumItem = {
  amount: "參與數量：",
  claimAmount: "領取數量：",
  startTime: "參與時間：",
  endTime: "領取時間："
};
const newData = ref({
  amount: `${props.data.amount} `,
  claimAmount: `${props.data.claimAmount} `,
  startTime: props.data.startTime,
  endTime: props.data.endTime
});

const checkOrderDetail = () => {
  router.push({
    path: "/order-detail",
    query: {
      ...props.data,
      status: props.data.status.value
    }
  });
};
const buttonLoadingStatus = ref(false);
watch(
  () => buttonLoadingStatus.value,
  newValue => {
    console.log(newValue, "newValue");
  }
);
const isClaim = computed(
  () => new Date(props.data.endTime).getTime() < new Date().getTime()
);

const checkClaim = async () => {
  buttonLoadingStatus.value = true;
  const res: any = await redSpiderContract.getClaimStatus(props.data.orderId);

  if (res.status === "5") {
    useCommonStore().update_orderStatusShow(true);
    useRedSpiderStore().update_claimAmount(res.needAmount);
    buttonLoadingStatus.value = false;
    return;
  } else if (res.status === "2") {
    await orderClaim();
    return;
  } else if (res.status === "3") {
    await liquidateOrder();
  }
};

const liquidateOrder = async () => {
  await redSpiderContract
    .liquidateContract(props.data.orderId)
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
            emit("claimEnd");
          }
        }
      );
    })
    .catch(() => {
      buttonLoadingStatus.value = false;
    });
};
// 开始领取
const orderClaim = async () => {
  await redSpiderContract
    .claimContract(props.data.orderId)
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
          if (status && res.logs) {
            buttonLoadingStatus.value = false;
            emit("claimEnd");
          }
        }
      );
    })
    .catch(() => {
      buttonLoadingStatus.value = false;
    });
};
</script>

<template>
  <div class="item van-haptics-feedback" @click="checkOrderDetail">
    <header>
      <div class="order-text">訂單編號：{{ data.orderId }}</div>
      <div class="order-detail" v-if="number !== 0">訂單詳情</div>
      <div v-else class="order-text-status">
        {{ data.status.message }}
      </div>
      <van-button
        :loading="buttonLoadingStatus"
        class="order-claim"
        v-if="(isClaim && data.status.value === 2) || data.status.value === 3"
        @click.stop="checkClaim"
        >{{ data.status.value === 2 ? "領取收益" : "領取賠付" }}</van-button
      >
    </header>
    <div class="item-main">
      <template v-for="(value, key) in newData" :key="key">
        <div v-if="enumItem[key]" class="item-list">
          <div class="list-text">{{ enumItem[key] }}</div>
          <div class="list-data">{{ value }}</div>
        </div>
      </template>
    </div>
    <van-toast :duration="0" v-model:show="buttonLoadingStatus" type="loading">
      <template #message>領取中...</template>
    </van-toast>
  </div>
</template>

<style scoped lang="less">
.item {
  display: flex;
  flex-direction: column;
  padding: 0px 16px;

  header {
    height: 40px;
    background: linear-gradient(90deg, #8f78ff, #843cae);
    border-radius: 16px 0px 0px 0px;
    box-sizing: content-box;
    line-height: 40px;
    padding: 0px 12px;
    margin-top: 8px;
    font-weight: 700;
    text-align: left;
    color: #401408;
    font-size: 16px;
    display: flex;
    align-items: center;
    .order-text {
      flex: 1;
    }
    .order-text-status {
      font-weight: 400;
      font-size: 14px;
      min-width: 80px;
      height: 28px;
      border: 0.5px solid #d6ff4b;
      border-radius: 14.5px;
      line-height: 28px;
      text-align: center;
      font-weight: 400;
      color: #d6ff4b;
    }
    .order-detail {
      border: 1px solid #fd7a58;
      border-radius: 15px;
      font-weight: 400;
      color: #d6ff4b;
      font-size: 14px;
      text-align: center;
      line-height: 20px;
      padding: 4px 12px;
    }
    .order-claim {
      background: #d6ff4b;
      border-radius: 14px;
      border: none;
      margin-left: 12px;
      color: #190840;
      font-size: 14px;
      text-align: center;
      font-weight: 400;
      height: 28px;
      min-width: 80px;
    }
  }
  .item-main {
    font-size: 14px;
    background-color: #fff;
    padding: 12px;
    border-radius: 0px 0px 16px 0px;
    .item-list {
      display: flex;
      margin-bottom: 6px;
      .list-text {
        font-weight: 400;
        text-align: left;
        color: #666666;
        margin-right: 12px;
      }
      .list-data {
        text-align: left;
        color: #401408;
        font-weight: 600;
      }
    }
  }
}
</style>
