/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Erc20 } from "@/web3-hash/erc20/erc20";
import { Erc20Factory } from "@/web3-hash/erc20/Erc20Factory";
import { Address } from "@/web3-hash/Contract/type";
import { convertToPercentageString } from "@/utils";
import {
  redSpiderStore,
  pool,
  InsurancePool,
  DestroyItem,
  AdmissionParam
} from "./types";
import { defineStore } from "pinia";
import { isEmpty, map } from "lodash";
import { RedSpider } from "@/web3-hash/redSpider/RedSpider";

interface RateInterface {
  incomeRate: number;
  claimRate: number;
  availableRate: number;
}
// createMessage
const useRedSpiderStore = defineStore("noah", {
  state: (): redSpiderStore => ({
    pool: {} as pool,
    payToken: "",
    InsurancePool: {} as InsurancePool,
    payTokenErc20: {} as Erc20,
    destroy: [] as DestroyItem[],
    authorityFromHUSD: false,
    redSpiderContract: {} as any,
    admissionParam: {} as AdmissionParam,
    rate: {} as RateInterface,
    claimAmount: 0,
    total: {} as any
  }),
  actions: {
    UPDATE_POOL(payload: pool) {
      this.pool = payload;
    },
    update_payToken(payload: string) {
      this.payToken = payload;
      this.update_PayTokenErc20(payload);
    },
    update_InsurancePool(payload: InsurancePool) {
      this.InsurancePool = payload;
    },
    async update_PayTokenErc20(payload: any) {
      this.payTokenErc20 = new Erc20Factory().make(new Address(payload));
    },
    update_destroy(payload: any) {
      if (!isEmpty(payload)) {
        map(payload, (value: DestroyItem) => {
          const rate = convertToPercentageString(value.destroyTokenRate);
          value.rate = `${value.symbol} ${rate}`;
          return value;
        });
      }
      this.destroy = payload;
    },
    update_authorityUSDT(payload: boolean) {
      this.authorityFromHUSD = payload;
    },
    update_redSpiderContract(payload: RedSpider) {
      this.redSpiderContract = payload;
    },
    update_admissionParam(payload: AdmissionParam) {
      this.admissionParam = payload;
    },
    async update_rate() {
      const bigIntRate =
        (await this.redSpiderContract.getSystemRate()) as RateInterface;
      // 除以100为百分之 除以 10000为数字
      this.rate = {
        incomeRate: Number(bigIntRate.incomeRate) / 100,
        claimRate: Number(bigIntRate.incomeRate) / 100,
        availableRate: Number(bigIntRate.incomeRate) / 100
      };
    },
    update_claimAmount(payload: number) {
      this.claimAmount = payload;
    },
    update_total(payload: any) {
      this.total = payload;
    }
  }
});

export default useRedSpiderStore;
