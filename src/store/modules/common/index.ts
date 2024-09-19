/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from "pinia";
import type { Common } from "./types";
import { compact, map, sortBy } from "lodash";

const common = defineStore("common", {
  state: (): Common => ({
    globalStatus: true,
    address: "",
    showRule: false,
    closePopupStart: true,
    homeStatus: false,
    constantStatusEnum: [],
    orderStatusShow: false,
    firstOpening: true,
    paused: false,
    notifyStatus: false
  }),
  actions: {
    update_globalStatus(payload: boolean) {
      this.globalStatus = payload;
    },
    update_address(payload: string) {
      this.address = payload;
    },
    update_paused(payload: boolean) {
      this.paused = payload;
    },

    update_showRule(payload: boolean) {
      this.showRule = payload;
    },
    update_closePopupStart(payload: boolean) {
      this.closePopupStart = payload;
    },
    update_homeStatus(payload: boolean) {
      this.homeStatus = payload;
    },
    update_clickProject(payload: boolean) {
      this.firstOpening = payload;
      console.log("firstOpening");
    },
    update_constantStatusEnum(payload: any) {
      if (!payload.code) {
        const newArray = compact(
          map(payload.data.code.statusCode, value => {
            if (value.value !== 4) return value;
            return { value: 0, message: "全部" };
          })
        );
        this.constantStatusEnum = sortBy(newArray, v => v.value);
      }
    },
    update_orderStatusShow(payload: boolean) {
      this.orderStatusShow = payload;
    },
    update_notifyStatus(payload: boolean) {
      this.notifyStatus = payload;
    }
  }
});

export default common;
