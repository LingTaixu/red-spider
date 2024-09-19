import { AbstractContract } from "../Contract/abstractContract";
import { Address, AmountUtils } from "../Contract/type";

interface AmountOutput {
  [key: string]: string;
}

export class Erc20 extends AbstractContract {
  protected _decimals: number = 0;

  public balanceOf = async (owner: Address): Promise<string> => {
    const balance = await this.contract.methods.balanceOf(owner.address).call();

    return this.fromWei(balance);
  };

  public decimals = async (): Promise<number> => {
    if (this._decimals <= 0) {
      this._decimals = await this.contract.methods.decimals().call();
    }
    return this._decimals;
  };

  public fromWei = async (
    amount: number | bigint | string
  ): Promise<string> => {
    const decimals = await this.decimals();

    const amountUtils = new AmountUtils(amount, decimals);
    return amountUtils.fromWei();
  };

  public fromWeiObject = async (input: Object): Promise<AmountOutput> => {
    const decimals = await this.decimals();
    const output: AmountOutput = {};

    for (const [key, amount] of Object.entries(input)) {
      const amountUtils = new AmountUtils(amount, decimals);
      output[key] = amountUtils.fromWei();
    }

    return output;
  };

  public toWei = async (amount: number | bigint | string): Promise<string> => {
    const decimals = await this.decimals();
    console.log(amount, "amount");

    const amountUtils = new AmountUtils(amount, decimals);
    return amountUtils.toWei();
  };

  public approve = async (owner: Address): Promise<any> => {
    const approveAmount = BigInt(2) ** BigInt(100);
    const encode = this.contract.methods
      .approve(owner.address, approveAmount)
      .encodeABI();
    return this.send(encode);
  };

  public allowance = async (
    owner: Address,
    spender: Address
  ): Promise<bigint> => {
    const amount = await this.contract.methods
      .allowance(owner.address, spender.address)
      .call();
    return amount;
  };
}
