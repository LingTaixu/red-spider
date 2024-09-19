import ChainFactory from "../Contract/ChainFactory";
import type { Chain } from "../Contract/request";
import type { Address } from "../Contract/type";
import type { AbstractContract } from "./abstractContract";

export abstract class BaseFactory {
  protected chain: Chain;
  constructor() {
    const chainFactory = new ChainFactory();
    this.chain = chainFactory.make();
  }
  public abstract make(contractAddress: Address): AbstractContract;
}
