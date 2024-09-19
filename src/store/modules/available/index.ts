/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from "pinia";
import type { AvailableStoreInterface } from "./types";
import { useCommonStore } from "@/store";
const available = defineStore("available", {
  state: (): AvailableStoreInterface => ({
    RSTBalanceOf: "0",
    RSTContract: {} as any
  }),
  actions: {
    async update_RSTBalanceOf() {
      const res = await this.RSTContract.availableBalanceOf(
        useCommonStore().address
      );

      this.RSTBalanceOf = res;
    },
    async update_contract(payload: any) {
      this.RSTContract = payload;
      await this.update_RSTBalanceOf();
    }
  }
});

export default available;
