import Web3 from "web3";
import { Chain } from "./request";
import { Address } from "./type";

import { isEmpty } from "lodash";
import { showFailToast, showSuccessToast } from "vant";
import { useCommonStore } from "@/store";

export default class ChainFactory {
  protected rpc: string;

  protected sender: Address;

  protected chain: Chain;

  constructor() {
    this.rpc = import.meta.env.VITE_API_RPC;
    this.sender = this.getAddress();
    this.chain = new Chain(this.rpc, this.sender);
  }

  public make(): Chain {
    if (isEmpty(this.chain)) {
      this.chain = new Chain(this.rpc, this.sender);
    }
    return this.chain;
  }

  public getAddress(): Address {
    //todo 获取地址
    const address: string = useCommonStore().address;
    return new Address(address);
  }

  public async checkHash(
    hash: string,
    message: string | boolean,
    callback?: Function
  ) {
    const res: any = await this.chain.getTransactionReceipt(hash);
    if (isEmpty(res)) {
      //todo
      setTimeout(() => {
        this.checkHash(hash, message, callback);
      }, 3000);
    } else {
      const status = Web3.utils.hexToNumber(res.status);
      if (callback) {
        callback(status, res);
      }
      if (status && message) {
        showSuccessToast({ message: `${message}成功`, duration: 3000 });
        return status;
      } else if (message) {
        showFailToast({ message: `${message}失败`, duration: 3000 });
        return status;
      }
    }
    return false;
  }
}
