import { find, forIn } from "lodash";
import type { Chain } from "./request";
import { Receiver, Address } from "./type";
import { Contract } from "web3-eth-contract";
import type { ContractAbi } from "web3-types";
import type { AbiFragment } from "web3-types/src/eth_abi_types";
import { closeToast, showFailToast } from "vant";
import "vant/es/toast/style";
export abstract class AbstractContract {
  protected abi: AbiFragment[];

  protected contractAddress: Address;

  protected chain: Chain;

  protected contract: any;

  constructor(abi: AbiFragment[], contractAddress: Address, chain: Chain) {
    this.abi = abi;
    this.contractAddress = contractAddress;
    this.chain = chain;
    this.contract = new Contract(
      this.abi,
      this.contractAddress.address,
      this.chain.getWeb3()
    );
  }

  protected send(data: string): Promise<unknown> {
    const receiver = new Receiver(this.contractAddress, "0");
    return new Promise((resolve, reject) => {
      this.chain
        .sendTransaction(receiver, data)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          showFailToast({
            message: err?.data?.message || err.message,
            duration: 6000,
            onClose() {
              closeToast();
            }
          });
          reject(err);
        });
    });
  }

  protected call(data: string): Promise<unknown> {
    const receiver = new Receiver(this.contractAddress, "0");
    return new Promise((resolve, reject) => {
      this.chain
        .ethCall(receiver, data)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          showFailToast({
            message: err?.data?.message || err.message,
            duration: 6000
          });
          reject(err);
        });
    });
  }
  /**
   * 获取事件签名
   * @param eventName 事件名称
   */
  public getEventEncodeSignature(eventName: string): AbiFragment {
    return find(this.abi, (value: any) => {
      return value.name === eventName && value.type === "event";
    }) as AbiFragment;
  }

  /**
   * 解析事件
   * @param event event对象
   * @param log 获取的log对象
   */
  public eventDecode(event: AbiFragment, log: any) {
    const topics = log.topics;
    const abi = this.chain.getWeb3().eth.abi;
    if (
      topics[0].toUpperCase() !==
      abi.encodeEventSignature(event as any).toUpperCase()
    ) {
      return [];
    }

    return abi.decodeLog(event.inputs as any, log.data, topics);
  }
}
