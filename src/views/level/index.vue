<script setup lang="ts" name="lighthouse">
import { useCommonStore, useRedSpiderStore, useWalletStore } from "@/store";
import { rewardAPI, ownerDetail } from "@/api";
import { onMounted, ref, computed } from "vue";
import dayjs from "dayjs";
import { sliceAddress } from "@/utils/web3";
import ChainFactory from "@/web3-hash/Contract/ChainFactory";
import { hashPush } from "@/api/index";
import Empty from "@/components/empty/index.vue";
import QRcode from "@/views/level/QRcode/index.vue";
import InviteOverlay from "@/components/invite-overlay/index.vue";
const reward = ref();
const levelBalance: any = ref(-1);
const name = ref();
const rewardArray: any = ref();
const userDetail = ref({ number: -1, amount: -1 });
const qrViewStatus = ref(false);
const bindInviteModule = ref(false);

const parent = computed(() => useWalletStore().parent);

const getReward = async () => {
  reward.value = await useRedSpiderStore().redSpiderContract.getRewards(
    useCommonStore().address
  );
};
const getLevelBalance = async () => {
  levelBalance.value =
    await useRedSpiderStore().redSpiderContract.LevelBalanceOf(
      useCommonStore().address
    );
};

const getRewardList = async () => {
  const rewardRes: any = await rewardAPI({
    condition: {},
    page: {
      all: 1,
      page: 1,
      pageSize: 100,
      total: 1
    },
    sort: {
      createAt: "desc"
    },
    search: { rewardAddress: useCommonStore().address }
  });
  if (rewardRes.code === 0) {
    rewardArray.value = rewardRes.data.list;
  }
};
const levelIcon = ref();
const getLighthouseUserDetail = async () => {
  const { data } = await ownerDetail({
    condition: {},
    search: {
      owner: useCommonStore().address
    }
  });
  if (data) {
    userDetail.value = data;
    levelIcon.value = `${import.meta.env.VITE_APP_UPLOAD}${
      data.ownerLevel.icon
    }`;
    name.value = data.ownerLevel.name;
  }
};

const receiveBalance = async () => {
  await useRedSpiderStore()
    .redSpiderContract.claimRewardContract()
    .then(async (hash: any) => {
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
      new ChainFactory().checkHash(
        hash,
        "鏈接收益領取",
        (status: any, res: any) => {
          if (status && res.logs) {
            // resolveEvent(redId);
            console.log(status);
          }
        }
      );
    });
};

const getTotalAmount = async () => {
  const totalAmount: any =
    await useRedSpiderStore().redSpiderContract.getRewards(
      useCommonStore().address
    );
  console.log(totalAmount, "totalAmount");

  if (totalAmount) {
    viewTotalAmount.value = totalAmount;
  }
};
const viewTotalAmount = ref(-1);
const status = ref(false);
onMounted(async () => {
  await getReward();
  await getLevelBalance();
  await getRewardList();
  await getLighthouseUserDetail();
  await getTotalAmount();
  status.value = true;
});

const toChrome = (hash: any) => {
  window.open(`${import.meta.env.VITE_APP_BROWSER}${hash}`, "");
};
const viewQR = () => {
  qrViewStatus.value = true;
};

const bindInvite = () => {
  bindInviteModule.value = true;
};

const closeInvite = () => {
  bindInviteModule.value = false;
};
</script>

<template>
  <div class="container">
    <header>
      <div class="header-text">
        <img src="../../assets/images/header-text.png" />
        <div v-if="status" class="header-level-name">{{ name }}</div>
        <van-loading v-else class="header-level-name" />
        <img src="../../assets/images/header-text.png" />
      </div>

      <div class="header-detail">
        <div class="header-detail-left">
          <div v-if="status">{{ userDetail.number }}個</div>
          <van-loading v-else />
          <div class="text-with-shadow">鏈接节点</div>
        </div>
        <van-image class="image-view" :src="levelIcon || ''">
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
        <div class="header-detail-right">
          <div v-if="status" class="van-ellipsis">
            {{ userDetail.amount }} USDT
          </div>
          <van-loading v-else />
          <div class="text-with-shadow">鏈接数量</div>
        </div>
      </div>
    </header>
    <div class="reward-number">
      <div class="reward-number-box">
        <div class="left">
          <div>我的餘額：</div>
          <div v-if="status">{{ levelBalance }} USDT</div>

          <van-loading class="left-loading" v-else />
        </div>
        <div v-if="status" @click="receiveBalance" class="right">點擊領取</div>
        <van-loading class="left-loading" v-else />
      </div>
      <div class="reward-history">
        <div class="history-text">獎勵記錄</div>
        <div class="history-amount">
          鏈接總盈利：
          <span v-if="status">{{ viewTotalAmount }} </span>
          <van-loading class="history-loading" v-else />
          USDT
        </div>
      </div>
    </div>

    <main v-if="status && rewardArray.length > 0">
      <div v-for="item in rewardArray" :key="item.hash" class="reward-item">
        <div class="left">
          <div class="number">
            {{ item.rewardType.message }}: <span>{{ item.amount }} USDT</span>
          </div>
          <div class="address">地址：{{ sliceAddress(item.owner) }}</div>
        </div>
        <div class="right">
          <div class="time">
            {{ dayjs(item.createAt * 1000).format("YYYY/MM/DD HH:mm") }}
          </div>
          <div class="hash" @click="toChrome(item.hash)">
            hash：{{ sliceAddress(item.hash) || "" }}
            <img src="../../assets/images/share-icon.png" />
          </div>
        </div>
      </div>
    </main>
    <main class="main-empty" v-else-if="status && rewardArray.length === 0">
      <Empty />
    </main>
    <main v-else>
      <van-loading size="24px" vertical>加载中...</van-loading>
    </main>
    <div @click="viewQR" class="qr">&nbsp;二維碼</div>
    <div
      @click="bindInvite"
      class="bind"
      v-if="parent === '0x0000000000000000000000000000000000000000'"
    >
      &nbsp;綁定
    </div>
    <QRcode
      v-if="qrViewStatus"
      :qr-show="qrViewStatus"
      @close="qrViewStatus = false"
    />

    <InviteOverlay :show="bindInviteModule" @close="closeInvite" />
  </div>
</template>
<style scoped lang="less">
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  header {
    height: 180px;
    background: url("../../assets/images/level-header.png") no-repeat center;
    background-size: cover;
    .header-text {
      display: flex;
      justify-content: center;
      text-align: center;
      align-items: center;
      height: 20px;
      .header-level-name {
        font-size: 18px;
        font-weight: 500;
        color: #ffdcff;
        text-shadow: 0px 1.5px 0px #943e8e;
        padding: 0px 4px;
      }
      img {
        width: 8px;
        height: 10.5px;
      }
      padding: 16px 0px;
    }
    .header-detail {
      display: flex;
      justify-content: space-around;
      height: calc(180px - 32px - 20px);
      align-items: center;
      .image-view {
        width: 46px;
        height: 46px;
        margin-bottom: 10px;
      }
      .header-detail-left,
      .header-detail-right {
        width: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        div:nth-child(1) {
          /* 样式规则1 */
          height: 22.5px;
          font-size: 16px;
          color: #ffffff;
        }

        div:nth-child(2) {
          /* 样式规则2 */
          height: 20px;
          font-size: 14px;
          font-weight: 400;
          text-align: left;
          color: #ffdcff;
        }
      }
    }
  }
  .reward-number {
    padding: 12px 16px;
    background: #1d0e4f;
    .reward-number-box {
      width: 343px;
      height: 56px;
      background: #2b2c45;
      border: 1px solid #443758;
      border-radius: 20px 0 20px 0;
      display: flex;
      align-items: center;
      padding: 0px 16px;
      box-sizing: border-box;
      justify-content: space-between;
      .left {
        display: flex;
        color: #ffffff;
        font-size: 16px;
        .left-loading {
          width: 16px;
          height: 16px;
        }
      }
      .right {
        width: 80px;
        height: 28px;
        background: #d6ff4b;
        border-radius: 14px;
        text-align: center;
        line-height: 28px;
        color: #190840;
        font-size: 16px;
      }
    }
    .reward-history {
      display: flex;
      padding-top: 16px;
      justify-content: space-between;
      .history-text {
        font-size: 16px;
        color: #ffffff;
      }
      .history-amount {
        display: flex;
        font-size: 14px;
        color: #bbb8c9;
        .history-loading {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
  main {
    flex: 1;
    overflow-y: auto; /* 允许垂直滚动 */
    background: #1d0e4f;
    padding: 16px 16px;
    padding-top: 6px;
    .reward-item {
      box-sizing: border-box;
      padding: 12px;
      height: 64.5px;
      background: #8d73db;
      border-radius: 12px 0px 12px 0px;
      margin-bottom: 8px;
      display: flex;
      color: #ffffff;
      justify-content: space-between;
      .left {
        display: flex;
        justify-content: space-between;

        flex-direction: column;
        .number {
          font-size: 14px;
          span {
            color: #d6ff4a;
          }
        }
        .address {
          font-size: 12px;
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: right;

        .time {
          color: #53469b;
          font-size: 12px;
        }
        .hash {
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          display: flex;
          img {
            margin-left: 6px;
            width: 12px;
            height: 12px;
          }
        }
      }
    }
  }
  .qr {
    width: 48px;
    height: 20.5px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10.5px 0px 0px 10.5px;
    color: #d6ff4b;
    font-size: 12px;
    line-height: 20.5px;
    text-align: center;
    position: absolute;
    top: 16px;
    right: 0;
  }
  .bind {
    width: 48px;
    height: 20.5px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10.5px 0px 0px 10.5px;
    color: #d6ff4b;
    font-size: 12px;
    line-height: 20.5px;
    text-align: center;
    position: absolute;
    top: 54px;
    right: 0;
  }
}
:deep(.van-image__loading) {
  background: none;
}
.main-empty {
  overflow: hidden;
}
.text-with-shadow {
  text-shadow: 0px 1.5px 0px #943e8e;
}
</style>
