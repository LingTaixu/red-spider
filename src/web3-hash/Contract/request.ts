import WEB3 from "web3";
import {
  type Address,
  type Receiver,
  type ProviderRpcError,
  AmountUtils
} from "./type";
import { closeToast } from "vant";

export class Chain {
  protected web3!: WEB3;

  protected ethereum: any;

  protected rpcUri: string;

  protected sender: Address;

  constructor(rpc: string, sender: Address) {
    this.rpcUri = rpc;
    this.sender = sender;
  }

  public getWeb3(): WEB3 {
    if (!(this.web3 instanceof WEB3)) {
      this.web3 = new WEB3(new WEB3.providers.HttpProvider(this.rpcUri));
    }
    return this.web3;
  }

  protected getEthereum() {
    if (
      this.ethereum === null ||
      this.ethereum == undefined ||
      this.ethereum === ""
    ) {
      if (!window.ethereum) {
        throw new Error("Browser does not support web3");
      }
      this.ethereum = window.ethereum;
    }
    return this.ethereum;
  }

  public async sendTransaction(
    receiver: Receiver,
    data: string
  ): Promise<unknown> {
    const gasLimit = await this.gasLimit(receiver, data);
    const gasPrice = this.web3.utils.numberToHex(await this.gasPrice());

    const mainBalance = await this.getBalance();
    const gas = BigInt(gasLimit) * BigInt(gasPrice);

    if (mainBalance <= gas) {
      throw new Error("手续费不足");
    }

    return new Promise((resolve, reject) => {
      this.request("eth_sendTransaction", [
        {
          from: this.sender.address,
          to: receiver.receiver,
          value: receiver.amount,
          data: data,
          gasPrice: gasPrice,
          gasLimit: gasLimit
        }
      ])
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(new Error(err.data?.message || err.message));
        });
    });
  }

  public ethCall(receiver: Receiver, data: string) {
    return new Promise((resolve, reject) => {
      this.request("eth_call", [
        {
          from: this.sender.address,
          to: receiver.receiver,
          input: data,
          data: data
        },
        "latest"
      ])
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(new Error(err.data?.message || err.message));
        });
    });
  }

  public getTransactionReceipt(hash: string) {
    return this.request("eth_getTransactionReceipt", [hash]);
  }

  public async getBalance(): Promise<bigint> {
    return await this.request("eth_getBalance", [
      this.sender.address,
      "latest"
    ]);
  }

  // protected async gasPrice2() {
  //   return await this.request("eth_gasPrice");
  // }

  protected async gasPrice() {
    return new AmountUtils(6, 9).toWei();
  }

  protected async gasLimit(receiver: Receiver, data: string) {
    const res = await this.request("eth_estimateGas", [
      {
        from: this.sender.address,
        to: receiver.receiver,
        value: receiver.amount,
        data: data
      }
    ]);
    return res;
  }

  protected request(funcName: string, params: any = []): any {
    console.log(funcName, params, "request");

    return new Promise((resolve, reject) => {
      this.getEthereum()
        .request({
          method: funcName,
          params: params
        })
        .then((result: string) => {
          resolve(result);
        })
        .catch((error: ProviderRpcError) => {
          reject(error);
        });
    });
  }
}
