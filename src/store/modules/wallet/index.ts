import { Wallet } from "./types";
import { defineStore } from "pinia";
import { useCommonStore } from "@/store";

// crea teMessage
const useWalletStore = defineStore("wallet", {
  state: (): Wallet => ({
    HUSDBalance: "",
    parent: "0x0000000000000000000000000000000000000000",
    redFalling: [],
    airdropInfo: []
  }),
  actions: {
    update_HUSDBalance(payload: string) {
      this.HUSDBalance = payload;
    },
    update_Parent(payload: string) {
      if (payload === useCommonStore().address) return;
      this.parent = payload;
    },
    update_red_info(payload: any) {
      this.redFalling = payload;
    },
    update_airdrop_info(payload: any) {
      this.airdropInfo = payload;
    }
  }
});

export default useWalletStore;
