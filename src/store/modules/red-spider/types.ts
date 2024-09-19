import { Erc20 } from "@/web3-hash/erc20/erc20";
import { RedSpider } from "@/web3-hash/redSpider/RedSpider";

export interface pool {
  incomePool: BigInt;
  incomeCount: BigInt;
  total: bigint;
  totalCount: BigInt;
  fundPool: BigInt;
}
export interface InsurancePool {
  token: string;
  amount: number;
  price: number;
  priceTotal?: String;
}

export interface AdmissionParam {
  memberCount: bigint;
  lotAmount: bigint;
  maxLot: bigint;
  minDay: bigint;
  maxDay: bigint;
}

export interface DestroyItem {
  /**
   * decimals
   */
  decimals?: number;
  /**
   * 销毁支付代币token
   */
  destroyToken?: string;
  /**
   * 销毁本金的金本位 万分之
   */
  destroyTokenRate: number;
  /**
   * 销毁地址
   */
  destroyTokenToAddress?: string;
  icon?: Url;
  /**
   * symbol 不用上传
   */
  symbol?: string;

  rate?: string;
}

/**
 * Url，icon
 */
export interface Url {
  path?: string;
  url?: string;
}
interface RateInterface {
  incomeRate: number;
  claimRate: number;
  availableRate: number;
}

export interface redSpiderStore {
  pool: pool;
  payToken: string;
  InsurancePool: InsurancePool;
  payTokenErc20: Erc20;
  destroy: DestroyItem[];
  authorityFromHUSD: boolean;
  redSpiderContract: RedSpider;
  admissionParam: AdmissionParam;
  rate: RateInterface;
  claimAmount: Number;
  total?: any;
}
