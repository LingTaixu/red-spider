import { createPinia } from "pinia";
import useCommonStore from "./modules/common";
import useRedSpiderStore from "./modules/red-spider";
import useWalletStore from "./modules/wallet";
import useAvailableStore from "./modules/available";

const store = createPinia();
export { useCommonStore, useRedSpiderStore, useWalletStore, useAvailableStore };

export default store;
