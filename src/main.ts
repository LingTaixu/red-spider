import { createApp } from "vue";
import store from "./store";
// normalize.css
import router, { toRouteType } from "./router";
import "normalize.css/normalize.css";

// svg icon
import "virtual:svg-icons-register";
// dayjs
import "dayjs/locale/zh-cn";
import * as dayjs from "dayjs";
import App from "./App.vue";
import { checkChain, getAddress } from "@/web3-hash/abi";
dayjs.locale("zh-cn");

import { showFailToast } from "vant";

const app = createApp(App);
async function initializeApp() {
  app.use(router);
  app.use(store);

  try {
    const checkChainRes = await checkChain();

    if (!window.ethereum) {
      showFailToast({
        duration: 0,
        message: "請用錢包打開"
      });
      app.mount("#err");
      return;
    }

    if (checkChainRes) {
      const res = await getAddress();
      if (res) {
        app.mount("#app");
      }
    }
  } catch (error) {
    console.error("An error occurred:", error, "?");
  }
}

initializeApp();
