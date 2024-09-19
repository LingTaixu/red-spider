<template>
  <van-overlay :show="QrShow">
    <div class="qr-box">
      <div id="download">
        <img class="qr-background" src="./../../../assets/images/QRcode.png" />
        <div class="qr-code-box">
          <img
            crossOrigin="anonymous"
            v-if="qrCodeURL"
            :src="qrCodeURL"
            alt="QR Code"
          />
          <div class="text">
            掃描二維碼參與活動！
            <div class="text-border"></div>
          </div>
        </div>
      </div>
      <div v-if="buttonStatus" @click="save" class="save-button">保存圖片</div>
      <div v-if="buttonStatus" @click="copy" class="save-button">複製鏈接</div>
      <div v-else class="save-button">
        <van-loading class="save-button" />
      </div>
      <van-icon @click="emit('close', false)" class="close-icon" name="cross" />
    </div>
  </van-overlay>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import QRCode, { QRCodeToDataURLOptions } from "qrcode";
import { useCommonStore } from "@/store";
import html2canvas from "html2canvas";
import { onMounted } from "vue";
import { showFailToast, showSuccessToast } from "vant";
import tp from "tp-js-sdk";
const buttonStatus = ref(true);
const qrCodeURL = ref<string | null>(null);
const isTokenPocket = ref(/TokenPocket/i.test(navigator.userAgent));
const tokenPocketBase64 = ref();
const props = defineProps({
  qrShow: {
    require: true,
    default: false,
    type: Boolean
  }
});
const QrShow = ref(props.qrShow);
const emit = defineEmits(["close"]);
const canvas = ref();
const generateAndSaveQRCode = async () => {
  const qrText = `${window.location.origin}/home?parent=${
    useCommonStore().address
  }`;

  // 使用 qrcode 库生成二维码
  const qrOptions = {
    errorCorrectionLevel: "H",
    type: "image/jpeg",
    rendererOpts: {
      quality: 1
    }
  };

  try {
    const qrDataURL = await QRCode.toDataURL(
      qrText as string,
      qrOptions as QRCodeToDataURLOptions
    );

    // 将生成的二维码显示在页面上
    qrCodeURL.value = qrDataURL;

    // 使用 HTML2Canvas 捕获页面截图

    const targetElement = document.getElementById("download") as any;

    canvas.value = await html2canvas(targetElement, { useCORS: true });
  } catch (error) {
    console.error("生成二维码失败", error);
  }
};
const base64ToBlob = (base64: string) => {
  const binaryString = window.atob(base64.split(",")[1]);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: "image/png" });
};

const downloadImage = (base64String: string, fileName: string) => {
  // 将 Base64 字符串转换为 Blob
  const blob = base64ToBlob(base64String);

  // 创建可下载的链接
  const url = URL.createObjectURL(blob);

  // 创建一个临时的下载链接
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;

  // 触发下载
  document.body.appendChild(a);
  a.click();

  // 清理
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  buttonStatus.value = true;
};

const save = async () => {
  buttonStatus.value = false;
  if (isTokenPocket.value) {
    setTimeout(async () => {
      canvas.value = await html2canvas(
        document.getElementById("download") as any
      );
      tokenPocketBase64.value = canvas.value.toDataURL();
      tp.saveImage({ url: tokenPocketBase64.value });
      buttonStatus.value = true;
    }, 1000);
    return;
  }
  setTimeout(async () => {
    canvas.value = await html2canvas(
      document.getElementById("download") as any
    );
    const base64 = canvas.value.toDataURL();

    downloadImage(base64, "invite.png");
  }, 1000); // 这里等待一秒钟，你可以根据实际情况调整等待时间
};
const copy = async () => {
  const text = `${window.location.origin}/home?parent=${
    useCommonStore().address
  }`;
  try {
    // 复制文本到剪切板
    await navigator.clipboard.writeText(text);
    showSuccessToast({
      duration: 3000,
      message: "已成功複製到剪切板"
    });
  } catch (err) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // 将 textarea 添加到 DOM 中
    document.body.appendChild(textArea);

    // 选择文本
    textArea.select();
    try {
      // 复制文本到剪切板
      document.execCommand("copy");

      const parentElement: any = textArea.parentNode;
      parentElement.removeChild(textArea);
      showSuccessToast({
        duration: 3000,
        message: "已成功複製到剪切板"
      });
    } catch (err) {
      showFailToast({
        duration: 3000,
        message: `複製失敗:${err}`
      });
    }
  }
};
onMounted(async () => {
  await generateAndSaveQRCode();
});
</script>

<style scoped lang="less">
.qr-box {
  z-index: 1000;
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  .qr-background {
    width: 100%;
  }
  #download {
    position: relative;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
  }
  .qr-code-box {
    width: 171px;
    height: 170.5px;
    border: 2px solid #d6ff4b;
    border-radius: 8px;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      width: 158px;
      height: 158.5px;
      border-radius: 6px;
      margin: 0 auto;
    }
    .text {
      width: 145px;
      height: 19px;
      font-size: 13.5px;
      font-weight: 800;
      color: #ffffff;
      text-shadow: 0px 1.5px 0px #180a00;
      z-index: 100;
      position: absolute;
      bottom: -30%;
      left: 55%;
      transform: translate(-50%, -50%);
      .text-border {
        z-index: -1;
        position: absolute;
        top: 11px;
        left: -10px;
        width: 159px;
        height: 6px;
        background: #d6ff4b;
        border-radius: 3px;
      }
    }
  }

  .save-button {
    width: 319px;
    height: 56px;
    background: #d6ff4b;
    border-radius: 16px 0px 16px 0px;
    box-shadow: 1.5px 1.5px 0px 0px rgba(0, 0, 0, 0.16);
    line-height: 56px;
    text-align: center;
    color: #304009;
    font-size: 20px;
    margin: 20px auto;
  }
  .close-icon {
    position: absolute;
    top: 2%;
    right: 3%;
    color: #fff;
    font-size: 18px;
  }
}

.tokenPocketBase64Img {
  width: 100%;
}
</style>
