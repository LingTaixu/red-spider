import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized
} from "vue-router";
import routes from "./routes";
import { useCachedViewStoreHook } from "@/store/modules/cachedView";
import NProgress from "@/utils/progress";
import setPageTitle from "@/utils/set-page-title";
import { useCommonStore } from "@/store";
import { computed } from "vue";
import { getAddress } from "@/web3-hash/abi";
const address = computed(() => useCommonStore().address);
const router = createRouter({
  history: createWebHistory(),
  routes
});

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    title?: string;
    noCache?: boolean;
  };
}

router.beforeEach(async (to: toRouteType, from, next) => {
  NProgress.start();
  // 路由缓存
  useCachedViewStoreHook().addCachedView(to);
  // 页面 title
  setPageTitle(to.meta.title);

  if (!address.value) {
    await getAddress();
    next("/home");
  } else {
    next();
  }

  // next();
  // NProgress.done();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
