import { AbiFragment } from "web3";
import { Erc20 } from "../erc20/erc20";
import { Address } from "../Contract/type";
import { Chain } from "../Contract/request";
import { AbstractContract } from "../Contract/abstractContract";
import { Erc20Factory } from "../erc20/Erc20Factory";
import { useCommonStore, useRedSpiderStore } from "@/store";

interface InsurancePool {
  token: string;
  amount: number;
  price: number;
}

export class Invite extends AbstractContract {
  protected erc20Factory: Erc20Factory;

  constructor(abi: AbiFragment[], contractAddress: Address, chain: Chain) {
    super(abi, contractAddress, chain);
    this.erc20Factory = new Erc20Factory();
  }

  protected getERC20(token: Address): Erc20 {
    return this.erc20Factory.make(token);
  }

  public async bindInvite(address: Address): Promise<unknown> {
    const encode = await this.contract.methods
      .bind(address.address)
      .encodeABI();
    return this.send(encode);
  }
}
