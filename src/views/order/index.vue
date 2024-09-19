<script setup lang="ts" name="order">
import { ref, onMounted, computed } from "vue";
import OrderItem from "@/views/order/components/order-item.vue";
import Empty from "@/components/empty/index.vue";
import { orderAPI } from "@/api";

import dayjs from "dayjs";
import { useCommonStore, useRedSpiderStore } from "@/store";
import { showFailToast, showLoadingToast } from "vant";

const userNode = ref({ count: 0 });
const list: any = ref([]);
const titleArray = computed(() =>
  useCommonStore().constantStatusEnum.filter(
    value => value.value !== 5 && value.value !== 6
  )
);

const active = ref(0);
const callCallback = async (status: number) => {
  await callOrder(status);
  active.value = 0;
};
const callOrder = async (status: number) => {
  const search: {
    status?: number; // 声明 status 为可选属性
    owner: string;
  } = {
    status,
    owner: useCommonStore().address
  };
  if (!search.status) {
    delete search.status;
  }
  const res: any = await orderAPI({
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
    search
  });
  if (!res.code) {
    list.value = res.data.list.map((value: any) => {
      value.createAt = dayjs(value.createAt * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      value.endTime = dayjs(value.endTime * 1000).format("YYYY-MM-DD HH:mm:ss");
      value.startTime = dayjs(value.startTime * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      value.updateAt = dayjs(value.updateAt * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return value;
    });
  }
};

const beforeChange = async (index: number) => {
  showLoadingToast({
    message: "加载中...",
    duration: 0
  });
  return await callOrder(titleArray.value[index].value).then(() => {
    return true;
  });
};
const refreshStatus = ref(false);
const onRefresh = async () => {
  await callOrder(titleArray.value[0].value);
  refreshStatus.value = false;
};
onMounted(async () => {
  showLoadingToast({
    message: "加载中...",
    duration: 0
  });
  await callOrder(titleArray.value[0].value);
  userNode.value = (await useRedSpiderStore().redSpiderContract.nodeAmount(
    useCommonStore().address
  )) as any;
  useRedSpiderStore().update_rate();
});
</script>

<template>
  <van-pull-refresh v-model="refreshStatus" @refresh="onRefresh">
    <div class="order">
      <div class="order-header">訂單總數：{{ Number(userNode.count) }}</div>
      <div class="order-main">
        <van-tabs
          style="height: 100%"
          v-model:active="active"
          sticky
          :before-change="beforeChange"
        >
          <van-tab v-for="item in titleArray" :key="item.value">
            <template #title>{{ item.message }}</template>
            <div class="order-item-list" v-if="list.length">
              <OrderItem
                v-for="(item, index) in list"
                :key="item"
                :data="item"
                :enumItem="(index as any)"
                @claim-end="callCallback(titleArray[0].value)"
                :number="active"
              />
            </div>
            <div v-else class="empty"><Empty /></div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </van-pull-refresh>
</template>

<style scoped lang="less">
.order {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.order-header {
  padding: 9px 16px;
  background: linear-gradient(90deg, #96dafc, #abf2fd 41%, #cabdff);
  font-size: 14px;
  font-weight: 400;
  color: #1d252f;
}

.order-main {
  flex: 1;
  overflow-y: auto; /* 使 .order-main 区域可滚动 */
  .order-item-list {
    display: flex;
    flex-direction: column;
    background: #1d0e4f;
    padding-bottom: 12px;
    min-height: 100vh;
  }
}

:deep(.van-tabs__content) {
  height: 100%;
}

:deep(.van-tab) {
  border-radius: 7px 0px 7px 0px;
  margin-right: 4px;
  color: #a7a8be;
  height: 28px;
  background: #282843;
}
:deep(.van-tab--active) {
  background: #d6ff4b;
  color: #190840;
}
:deep(.van-tabs__nav) {
  background: #1d0e4f;
  align-items: center;
}
:deep(.van-tabs--line .van-tabs__wrap) {
  height: 38px;
}
:deep(.van-tabs__line) {
  display: none;
}
:deep(.van-tabs__nav--line) {
  padding: 0px;
}
.empty {
  overflow-y: auto;
}
</style>
