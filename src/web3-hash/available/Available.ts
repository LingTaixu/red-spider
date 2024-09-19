import { AbiFragment } from "web3";
import { Erc20 } from "../erc20/erc20";
import { Address } from "../Contract/type";
import { Chain } from "../Contract/request";
import { AbstractContract } from "../Contract/abstractContract";
import { Erc20Factory } from "../erc20/Erc20Factory";
import { useRedSpiderStore } from "@/store";

export class Available extends AbstractContract {
  protected erc20Factory: Erc20Factory;

  constructor(abi: AbiFragment[], contractAddress: Address, chain: Chain) {
    super(abi, contractAddress, chain);
    this.erc20Factory = new Erc20Factory();
  }

  protected getERC20(token: Address): Erc20 {
    return this.erc20Factory.make(token);
  }

  public async availableBalanceOf(userAddress: string): Promise<any> {
    const res = await this.contract.methods
      .availableBalanceOf(userAddress)
      .call();
    return await this.getERC20(
      new Address(useRedSpiderStore().payToken)
    ).fromWei(res);
  }
}
