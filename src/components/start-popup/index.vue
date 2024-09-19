<!-- eslint-disable no-unreachable -->
<script setup lang="ts" name="start">
import { useCommonStore, useRedSpiderStore, useWalletStore } from "@/store";
import { Address } from "@/web3-hash/Contract/type";
import { ref, watch, computed } from "vue";
import ChainFactory from "@/web3-hash/Contract/ChainFactory";
import { useRouter } from "vue-router";
import { debounce } from "lodash";
import { hashPush } from "@/api/index";
import { showFailToast } from "vant";
import { headerSliceAddress } from "@/utils/web3";
import { isAddress } from "web3-validator";
import NoInvite from "@/components/no-invite/index.vue";

const noInviteShow = ref(false);
const { update_Parent } = useWalletStore();
const router = useRouter();
const parent = computed(() => useWalletStore().parent);
const parentClone = ref(parent.value);
const status = ref(false);
const thisButtonStatus = ref(false);
const copies = ref(1);
const emit = defineEmits(["closed"]);
const show = ref(false);
const HUSDBalance = computed(() => useWalletStore().HUSDBalance);
const props = defineProps({
  showBottom: {
    type: Boolean,
    required: true,
    default: false
  }
});
const editStatus = ref(false);
//    memberCount: bigint;
//   lotAmount: bigint;
//   maxLot: bigint;
//   minDay: bigint;
//   maxDay: bigint;
const config = computed(() => useRedSpiderStore().admissionParam);
// 是否可以购买
const payStatus = ref(true);
const day = ref(0);
// select
const rewardTotal = ref(0);

const startHUSDTotal = ref(0);

const fee = ref(0);

const payAmount = ref(0);
// 初始化
watch(
  () => props.showBottom,
  async newValue => {
    show.value = newValue;
    if (newValue) {
      day.value = Number(config.value.maxDay);
      copies.value = Number(config.value.maxLot);
      startHUSDTotal.value =
        Number(copies.value) * Number(config.value.lotAmount);
      useWalletStore().update_HUSDBalance(
        await useRedSpiderStore().payTokenErc20.balanceOf(
          new Address(useCommonStore().address)
        )
      );
    }
  },
  { deep: true }
);

const reduceCopies = () => {
  if (!status.value) return;
  if (copies.value > 1) {
    copies.value--;
  }
};

const addCopies = () => {
  if (!status.value) return;
  copies.value = Number(copies.value) + 1;
};

const reduceDay = () => {
  if (!status.value) return;
  if (day.value > Number(config.value.minDay)) {
    day.value--;
  }
};

const addDay = () => {
  if (!status.value) return;
  day.value = Number(day.value) + 1;
};

// 加入
const start = debounce(
  async () => {
    if (parent.value === "0x0000000000000000000000000000000000000000") {
      noInviteShow.value = true;
      return;
    }
    thisButtonStatus.value = true;

    if (Number(HUSDBalance.value) < Number(startHUSDTotal.value)) {
      showFailToast({
        message: "餘額不足",
        duration: 1500
      });
      thisButtonStatus.value = false;
      return;
    }
    console.log(
      String(copies.value),
      useWalletStore().parent,
      String(day.value)
    );

    const hash = await useRedSpiderStore()
      .redSpiderContract.entranceContract(
        String(copies.value),
        useWalletStore().parent,
        String(day.value)
      )
      .catch((err: any) => {
        thisButtonStatus.value = false;
      });

    if (!hash) return;
    try {
      await hashPush({
        data: {
          hash
        },
        condition: {}
      });
    } catch (error) {
      console.log(error, "?");
    }
    await new ChainFactory().checkHash(
      hash as string,
      "交易",
      (status: number) => {
        if (status) {
          thisButtonStatus.value = false;
          router.push("/order");
        }
      }
    );
  },
  500,
  { leading: false, trailing: true }
);

// 加入
const startNoInvite = debounce(
  async (address: string) => {
    noInviteShow.value = false;
    thisButtonStatus.value = true;
    if (Number(HUSDBalance.value) < Number(startHUSDTotal.value)) {
      showFailToast({
        message: "餘額不足",
        duration: 1500
      });
      thisButtonStatus.value = false;
      return;
    }
    const hash = await useRedSpiderStore()
      .redSpiderContract.entranceContract(
        String(copies.value),
        address,
        String(day.value)
      )
      .catch((err: any) => {
        thisButtonStatus.value = false;
      });

    if (!hash) return;
    try {
      await hashPush({
        data: {
          hash
        },
        condition: {}
      });
    } catch (error) {
      console.log(error, "?");
    }
    await new ChainFactory().checkHash(
      hash as string,
      "交易",
      (status: number) => {
        if (status) {
          thisButtonStatus.value = false;
          router.push("/order");
        }
      }
    );
  },
  500,
  { leading: false, trailing: true }
);

const calcFunc = debounce(
  async () => {
    status.value = false;
    const res: any =
      await useRedSpiderStore().redSpiderContract.calcClaimAmount(
        Number(copies.value),
        Number(day.value)
      );
    startHUSDTotal.value = res.amount;
    rewardTotal.value = res.claimAmount;
    payAmount.value = res.payAmount;
    fee.value = res.fee;
    payStatus.value = res.entranceStatus;
    status.value = true;
  },
  600,
  { leading: true, trailing: true }
);

const copiesFormatter = (value: any) => {
  if (!value) {
    return 1;
  }
  if (value > config.value.maxLot) return config.value.maxLot;
  return value;
};
const dayFormatter = (value: any) => {
  if (!value) {
    return 1;
  }
  if (value > config.value.maxDay) return config.value.maxDay;
  if (value < config.value.minDay) return config.value.minDay;
  return value;
};

const successClick = () => {
  if (!isAddress(parentClone.value)) {
    showFailToast("請輸入正確的地址");
    return;
  }
  console.log(parentClone.value, useCommonStore().address);

  if (
    parentClone.value.toLowerCase() == useCommonStore().address.toLowerCase()
  ) {
    showFailToast("不能綁定自己");
    return;
  }
  update_Parent(parentClone.value);
  editStatus.value = false;
};
</script>

<template>
  <van-popup
    v-model:show="show"
    round
    position="bottom"
    :style="{ height: '95%', color: '#000', borderRadius: '24px 0 0 0' }"
    @closed="emit('closed', false)"
  >
    <div class="popup">
      <header>
        <div class="popup-header-none"></div>
        <div class="popup-header-text">立即參與</div>
        <img
          src="../../assets/images/popup_close_icon.png"
          @click="emit('closed', false)"
        />
      </header>
      <div class="van-hairline--bottom"></div>
      <div class="popup-balance">
        <div style="flex: 0.5">餘額</div>
        <div
          v-if="HUSDBalance"
          style="flex: 1"
          class="van-ellipsis popup-balance-text"
        >
          {{ HUSDBalance }}
        </div>
        <van-loading v-else size="14px" />
        <div>USDT</div>
      </div>

      <!-- form -->
      <div>
        <div class="form-title">
          <div class="form-title-pay-number">支付份數</div>
          <div class="form-title-pay-max">
            （最大支付數量{{ config.maxLot }}份）
          </div>
          <div class="form-title-pay-calc">{{ config.lotAmount }}U/份</div>
        </div>
      </div>

      <div class="popup-form-number">
        <div class="popup-form-number-reduce" @click="reduceCopies">-</div>
        <van-field
          class="popup-form-number-input"
          type="digit"
          v-model="copies"
          input-align="center"
          @update:model-value="calcFunc"
          :formatter="copiesFormatter"
          :disabled="!status"
        />
        <div class="popup-form-number-add" @click="addCopies">+</div>
      </div>

      <div>
        <div class="form-title">
          <div class="form-title-pay-number">選擇天數</div>
          <div class="form-title-pay-max">（最大{{ config.maxDay }}天）</div>
        </div>
      </div>

      <div class="popup-form-number">
        <div class="popup-form-number-reduce" @click="reduceDay">-</div>
        <van-field
          class="popup-form-number-input"
          type="digit"
          v-model="day"
          input-align="center"
          @update:model-value="calcFunc"
          :formatter="dayFormatter"
          :disabled="!status"
        />
        <div class="popup-form-number-add" @click="addDay">+</div>
      </div>

      <div class="popup-amount-view">
        <div class="popup-amount-view-back">
          <div class="popup-amount-view-back-text">本金：</div>
          <div class="popup-amount-view-back-data">
            <div v-if="status" class="popup-amount-view-back-data-main-token">
              {{ startHUSDTotal }} <span>USDT</span>
            </div>
            <van-loading
              v-else
              size="14px"
              class="popup-amount-view-back-data-main-token"
            >
              計算中...
            </van-loading>
          </div>
        </div>

        <div class="popup-amount-view-back">
          <div class="popup-amount-view-back-text">收益：</div>
          <div v-if="status" class="popup-amount-view-back-data">
            {{ rewardTotal }} USDT
          </div>
          <van-loading v-else size="14px" class="popup-amount-view-back-data"
            >計算中...</van-loading
          >
        </div>

        <div class="popup-amount-view-back">
          <div class="popup-amount-view-back-text">手續費：</div>
          <div v-if="status" class="popup-amount-view-back-data">
            {{ fee }} USDT
          </div>
          <van-loading v-else size="14px" class="popup-amount-view-back-data"
            >計算中...</van-loading
          >
        </div>

        <div class="popup-amount-view-back">
          <div class="popup-amount-view-back-text">支付金額：</div>
          <div v-if="status" class="popup-amount-view-back-data">
            {{ payAmount }} USDT
          </div>
          <van-loading v-else size="14px" class="popup-amount-view-back-data"
            >計算中...</van-loading
          >
        </div>
        <div class="popup-amount-view-back">
          <div class="popup-amount-view-back-text lang">蛛網地址：</div>
          <div class="popup-amount-view-back-data">
            {{ headerSliceAddress(parent) }}
            <!-- <van-icon
              name="edit"
              @click="bindInviteModule = true"
              v-if="parent === '0x0000000000000000000000000000000000000000'"
            /> -->
          </div>
        </div>
      </div>

      <van-button
        v-if="status && payStatus"
        :disabled="thisButtonStatus"
        class="popup-button"
        @click="start"
        >確認支付</van-button
      >
      <van-loading v-else-if="payStatus" size="14px" class="popup-button" />
      <van-button
        v-if="payStatus === false"
        :disabled="thisButtonStatus"
        class="popup-button-no-pay"
        >訂單數量已達到上限</van-button
      >

      <van-toast
        v-model:show="thisButtonStatus"
        style="padding: 0"
        type="loading"
        :duration="0"
      />
      <NoInvite
        :show="noInviteShow"
        @close="noInviteShow = false"
        @to-bind="startNoInvite"
      />
    </div>
  </van-popup>
</template>

<style scoped lang="less">
.popup {
  display: flex;
  padding: 20px 16px;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 16px;
    .popup-header-none {
      height: 22px;
      width: 22px;
    }
    .popup-header-text {
      text-align: left;
      color: #090e12;
      font-size: 18px;
    }
    img {
      height: 22px;
      width: 22px;
    }
  }

  .popup-balance {
    margin: 20px 0px;
    width: 343px;
    height: 46.5px;
    align-items: center;
    background: #f6f3ff;
    border-radius: 8px 0px 8px 0px;
    font-size: 14px;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .popup-balance-text {
      text-align: right;
      padding-left: 4px;
    }
  }

  .form-title {
    display: flex;
    align-items: center;
    margin-bottom: 9px;
    .form-title-pay-number {
      font-size: 14px;
      color: #090e12;
      font-weight: 700;
    }
    .form-title-pay-max {
      font-size: 12px;
      color: #999999;
      font-weight: 400;
      flex: 1;
    }

    .form-title-pay-calc {
      font-size: 10px;
      color: #401408;
      font-weight: 700;
    }
  }

  .popup-form-number {
    border: 0.5px solid #d7d7d7;
    border-radius: 8px;
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .popup-form-number-reduce,
    .popup-form-number-add {
      flex: 0.5;
      width: 100%;
      text-align: center;
      color: #090e12;
      font-size: 16px;
      padding: 14px;
    }
    .popup-form-number-input {
      text-align: center;
      flex: 0.6;
      font-size: 17px;
      line-height: 17px;
      padding: 14px;
      border-left: 0.5px solid #d7d7d7; /* 设置左边框样式 */
      border-right: 0.5px solid #d7d7d7; /* 设置右边框样式 */
      color: #090e12 !important;
    }
  }
  .popup-amount-view {
    font-weight: 400;
    color: #090e12;

    .popup-amount-view-back {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 16px;
      .popup-amount-view-back-data {
        flex: 1;
        text-align: right;
        font-size: 14px;
        font-weight: 600;
        color: #090e12;
      }
      .popup-amount-view-back-text {
        font-size: 16px;
        .success-icon {
          width: 16px;
          height: 16px;
        }
      }
      .lang {
        width: 120px;
      }
    }
  }

  .popup-button {
    width: 343px;
    height: 48px;
    background: linear-gradient(175deg, #8d73db 17%, #c670e2 99%);
    border-radius: 16px 0px 16px 0px;
    margin: auto 0;
    text-align: left;
    color: #ffffff;
    text-align: center;
    line-height: 46px;
    font-size: 16px;
  }
  .popup-button-no-pay {
    width: 343px;
    height: 48px;
    background: #b3b3b3;
    border-radius: 16px 0px 16px 0px;
    margin: auto 0;
    color: #ffffff;
    text-align: center;
    line-height: 46px;
    font-size: 16px;
    text-shadow: 0px 0.5px 2px #929292;
  }
  .popup-form-token-select {
    height: 44px;
    border: 1px solid #d7d7d7;
    border-radius: 8px;
    margin-top: 4px;
    padding: 0px 16px;
    display: flex;
    align-items: center;
    ::v-deep .van-field__control {
      text-align: right !important;
      color: #319fe8;
      font-size: 14px;
    }
  }
}
:deep(.van-field__control:disabled) {
  color: #090e12 !important;
  -webkit-text-fill-color: #090e12 !important;
}
</style>
