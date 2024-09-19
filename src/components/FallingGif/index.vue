<template>
  <van-overlay :show="show">
    <div
      class="falling-gif"
      :style="{ top: position.y + 'px', left: position.x + 'px' }"
    >
      <img
        :id="imageId"
        src="./../../assets/images/fall.gif"
        alt="Falling Gif"
        @load="startAnimation"
        @click="openWindow"
      />
    </div>
  </van-overlay>

  <van-overlay v-model:show="windowShow" class-name="overlay">
    <div class="rule-box">
      <div class="rule-box-title">福袋</div>
      <div class="rule-box-text">恭喜您获得福袋，特爲您派送</div>
      <div class="rule-box-number">
        <span class="number">{{ claimInfo.amount }}</span>
        <span class="symbol">{{ claimInfo.symbol }}</span>
      </div>
      <div class="rule-box-button">
        <div @click="open" v-if="claimStatus" class="rule-box-button-next">
          點擊領取
        </div>
        <van-loading
          v-else
          size="14px"
          class="rule-box-button-next"
        ></van-loading>
      </div>
    </div>
  </van-overlay>
</template>

<script setup lang="ts">
import { useWalletStore } from "@/store";
import { watch } from "vue";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { claimRedEnvelope } from "@/api";
import { showNotify } from "vant";
import "vant/es/notify/index.css";
const show = ref(false);
const windowShow = ref(false);
const position = ref({ x: 0, y: 0 });
const fallSpeed = ref(1000); // 下落速度，可以根据需求调整
const imageId = "fallingGifImage"; // 图片的id
const redInfo = computed(() => useWalletStore().redFalling);
const emits = defineEmits(["claimDone"]);
const startAnimation = () => {
  const img: any = document.getElementById(imageId);

  if (!img) {
    console.error("Image not found");
    return;
  }

  // 设置图片宽度为100vw
  img.style.width = "100vw";

  // 获取窗口的高度和宽度
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  // 设置 GIF 初始位置居中显示
  position.value.x = (windowWidth - img.width) / 2;
  position.value.y = -img.height; // 将初始位置设置在屏幕之上

  // 启动动画
  animate();
};

const animate = () => {
  // 定义动画函数
  const animate = () => {
    const img: any = document.getElementById(imageId);

    if (!img) {
      console.error("Image not found");
      return;
    }

    // 更新位置
    position.value.y += fallSpeed.value; // 根据下落速度更新位置

    // 如果 GIF 超过屏幕底部，停留在屏幕正中
    if (position.value.y > window.innerHeight / 2 - img.height / 2) {
      position.value.y = window.innerHeight / 2 - img.height / 2;
    }

    // 更新位置
    requestAnimationFrame(animate);
  };

  // 启动动画
  animate();
};
const claimStatus = ref(true);
const claimInfo = ref({
  amount: "",
  redEnvelopeId: "",
  symbol: ""
});
watch(
  () => redInfo.value,
  () => {
    console.log(redInfo.value, "1");

    if (redInfo.value.length >= 1) {
      show.value = true;
    } else {
      show.value = false;
    }
  },
  { deep: true }
);

onMounted(() => {
  if (redInfo.value.length) {
    startAnimation();
  }
});

onUnmounted(() => {
  // 在组件销毁时执行的逻辑
  // 例如，清理资源或停止动画
});

const openWindow = () => {
  windowShow.value = true;
  claimInfo.value = redInfo.value[0];
  console.log(claimInfo.value);
};

const open = async () => {
  claimStatus.value = false;
  const res: any = await claimRedEnvelope({
    search: { redEnvelopeId: claimInfo.value.redEnvelopeId }
  });
  claimStatus.value = true;
  if (res.code === 0) {
    showNotify({
      message: "領取成功！",
      type: "success"
    });
  }
  emits("claimDone");
  windowShow.value = false;
  return;
};
</script>

<style scoped lang="less">
.falling-gif {
  position: fixed;
  transition: top 0.5s ease-in-out, left 0.5s ease-in-out; /* 添加动画过渡效果 */
}
img {
  z-index: 100000000;
}
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
  border-radius: 20px 20px 20px 20px;
  -webkit-scrollbar {
    display: none;
  }
  top: 30%;
  .rule-box-title {
    width: 311px;
    height: 36px;
    background: linear-gradient(153deg, #8c6aeb 17%, #c670e2);
    border-radius: 20px 20px 0px 0px;
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
