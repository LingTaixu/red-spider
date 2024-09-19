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

export class RedSpider extends AbstractContract {
  protected erc20Factory: Erc20Factory;

  constructor(abi: AbiFragment[], contractAddress: Address, chain: Chain) {
    super(abi, contractAddress, chain);
    this.erc20Factory = new Erc20Factory();
  }

  protected getERC20(token: Address): Erc20 {
    return this.erc20Factory.make(token);
  }

  public async getPoolBalanceOf(payToken: string): Promise<any> {
    try {
      const res = await this.contract.methods.getInsurance().call();
      const insuranceToken = res.insuranceToken;

      const balanceOf = await this.getERC20(
        new Address(insuranceToken)
      ).balanceOf(
        new Address(import.meta.env.VITE_CONTRACT_RED_SPIDER_ADDRESS)
      );
      return balanceOf;
    } catch (error) {
      console.log("getPoolBalanceOf", error);
      return error;
    }
  }
  public async getPool(payToken: string): Promise<any> {
    try {
      const res = await this.contract.methods.getFundPool().call();
      const newRes = await this.getERC20(new Address(payToken)).fromWeiObject(
        res
      );
      return newRes;
    } catch (error) {
      console.log("getPool", error);
      return error;
    }
  }
  public async getTotal(payToken: string): Promise<any> {
    try {
      const res = await this.contract.methods.getTotal().call();
      res.total = await this.getERC20(new Address(payToken)).fromWei(res.total);
      return res;
    } catch (error) {
      console.log("getTotal", error);
    }
  }

  public async getPayTokenFunc(): Promise<string> {
    return this.contract.methods.getPayToken().call();
  }

  public async getAdmissionParam(payToken: string): Promise<any> {
    const res = await this.contract.methods.getAdmissionParam().call();
    res.lotAmount = await this.getERC20(new Address(payToken)).fromWei(
      res.lotAmount
    );
    return res;
  }
  public async getSystemParam(): Promise<any> {
    const res = await this.contract.methods.getSystemParam().call();
    return res;
  }

  public async getRewards(address: string): Promise<unknown> {
    const res = await this.contract.methods.getRewards(address).call();
    const calc = res.linkReward + res.societyReward;
    return await this.getERC20(
      new Address(useRedSpiderStore().payToken)
    ).fromWei(calc);
  }

  public async LevelBalanceOf(address: string): Promise<unknown> {
    const res = await this.contract.methods.LevelBalanceOf(address).call();
    const newRes = await this.getERC20(
      new Address(useRedSpiderStore().payToken)
    ).fromWei(res);
    return newRes;
  }

  // quantity 份数
  // parent 上级地址 冷斌出接口获取
  // day 收益多少天
  public async entranceContract(
    quantity: string,
    parent: string,
    day: string
  ): Promise<any> {
    const abiEncode = this.contract.methods
      .entrance(quantity, parent, day)
      .encodeABI();
    return this.send(abiEncode);
  }

  public async getClaimStatus(orderId: string): Promise<unknown> {
    const res = await this.contract.methods.getClaimStatus(orderId).call();

    const newRes = {
      status: res.status.toString(),
      time: res.time.toString(),
      needAmount: await this.getERC20(
        new Address(useRedSpiderStore().payToken)
      ).fromWei(res.needAmount)
    };
    console.log(newRes);

    return newRes;
  }
  public async getSystemRate(): Promise<unknown> {
    return await this.contract.methods.getSystemRate().call();
  }
  public async calcClaimAmount(
    quantity: number,
    day: number
  ): Promise<unknown> {
    const res = await this.contract.methods
      .getClaimAmount(BigInt(quantity), BigInt(day), useCommonStore().address)
      .call();
    return {
      amount: await this.getERC20(
        new Address(useRedSpiderStore().payToken)
      ).fromWei(res.amount),
      claimAmount: await this.getERC20(
        new Address(useRedSpiderStore().payToken)
      ).fromWei(res.claimAmount),
      entranceStatus: res.entranceStatus,
      payAmount: await this.getERC20(
        new Address(useRedSpiderStore().payToken)
      ).fromWei(res.payAmount),
      fee: await this.getERC20(
        new Address(useRedSpiderStore().payToken)
      ).fromWei(res.payAmount - res.amount)
    };
  }

  public async claimContract(orderId: string): Promise<unknown> {
    const encode = await this.contract.methods.claim(orderId).encodeABI();
    return this.send(encode);
  }

  public async liquidateContract(orderId: string): Promise<unknown> {
    const encode = await this.contract.methods
      .liquidateOrder(orderId)
      .encodeABI();
    return this.send(encode);
  }

  public async claimRewardContract(): Promise<unknown> {
    const encode = await this.contract.methods.claimReward().encodeABI();
    return this.send(encode);
  }
  // f28f
  public async nodeAmount(owner: string): Promise<unknown> {
    const res = await this.contract.methods.getNodeAmount(owner).call();
    return {
      amount: await useRedSpiderStore().payTokenErc20.fromWei(res.amount),
      count: res.count
    };
  }
  public async getInsurancePoolFunc(): Promise<InsurancePool> {
    const result = await this.contract.methods.getInsurancePool().call();
    console.log("debug", await this.contract.methods.getInsurancePool());

    // useRedSpiderStore().payToken
    result.amount = await this.getERC20(new Address(result.token)).fromWei(
      result.amount
    );

    result.price = await this.getERC20(
      new Address(useRedSpiderStore().payToken)
    ).fromWei(result.price);

    result.priceTotal = Number(result.amount) * Number(result.price);

    return result;
  }
}
