import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "RED SPIDER",
          keepAlive: true
        }
      },
      {
        path: "/order",
        name: "order",
        component: () => import("@/views/order/index.vue"),
        meta: {
          title: "我的訂單",
          keepAlive: true
        }
      },
      {
        path: "/order-detail",
        name: "order-detail",
        component: () => import("@/views/order-detail/index.vue"),
        meta: {
          title: "訂單詳情",
          keepAlive: true
        }
      },
      {
        path: "/level",
        name: "level",
        component: () => import("@/views/level/index.vue"),
        meta: {
          title: "我的等級",
          keepAlive: true
        }
      }
    ]
  }
];

export default routes;
