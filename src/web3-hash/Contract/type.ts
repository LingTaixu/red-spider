import { trimEnd } from "lodash";
import { showFailToast } from "vant";
import Web3 from "web3";
import { isHex, isAddress } from "web3-validator";

export interface SEND {
  from: string;
  to: string;
  value: string | number;
  data: string;
  gasPrice: string | number;
  gasLimit: string;
}

export interface GASLIMIT {
  from: string;
  to: string;
  value: string | number;
  data: string;
}

export class Address {
  get address(): string {
    return this._address;
  }

  protected _address: string;

  constructor(address: string) {
    if (!isAddress(address, false)) {
      new Error("Address Invalid");
    }
    this._address = Web3.utils.toChecksumAddress(address);
  }
}

export class Receiver {
  get receiver(): string {
    return this._receiver.address;
  }

  get amount(): string {
    return Web3.utils.numberToHex(Web3.utils.toWei(this._amount, "ether"));
  }

  protected _receiver: Address;

  protected _amount: string;

  constructor(address: Address, amount: string) {
    this._receiver = address;
    this._amount = amount;
  }
}

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export class AmountUtils {
  protected amount: number | bigint;

  protected decimals: number;

  protected denomination: bigint;

  constructor(amount: number | bigint | string, decimals: number | bigint) {
    if (typeof amount === "string") {
      if (isHex(amount)) {
        amount = Web3.utils.toNumber(amount).toString();
      }
      const [integer, fraction] = amount.split(".").concat("");

      if (Number(integer) <= 0 && Number(fraction.slice(0, 6)) <= 0) {
        showFailToast({
          message: "无法小于0.000001",
          duration: 6000
        });
        throw new Error("数量过小");
      }
      if (BigInt(integer) >= Number.MAX_SAFE_INTEGER) {
        amount = BigInt(integer);
      } else {
        amount = Number(`${integer}.${fraction}`);
      }
    }

    if (typeof amount !== "number" && typeof amount !== "bigint") {
      amount = Web3.utils.toNumber(amount);
    }

    this.amount = amount;

    this.decimals = typeof decimals === "number" ? decimals : Number(decimals);
    this.denomination = BigInt(10) ** BigInt(this.decimals);
  }

  public fromWei(decimals: number = 6): string {
    const value = this.amount.toString();

    const [valueResult] = value.split(".").concat("");
    const zeroPaddedValue = valueResult.padStart(this.decimals, "0");
    if (zeroPaddedValue.length > this.decimals) {
      const integer = zeroPaddedValue.slice(0, -this.decimals);
      const fraction = zeroPaddedValue.slice(
        integer.length,
        integer.length + decimals
      );

      if (Number(fraction) <= 0) return integer;
      return `${integer}.${trimEnd(fraction, "0")}`;
    } else {
      const fraction = zeroPaddedValue.slice(0, decimals);
      if (!trimEnd(fraction, "0")) return "0";
      return `0.${trimEnd(fraction, "0")}`;
    }
  }

  public toWei(): string {
    const value: string = this.amount.toString();
    // if (!value.includes(".")) return BigInt(value).toString();

    const [integer, fraction] = value.split(".").concat("");
    let decimals: string = fraction.padEnd(this.decimals, "0");
    if (fraction.length > this.decimals) {
      decimals = fraction.slice(0, this.decimals);
    }
    return BigInt(`${integer}${decimals}`).toString();
  }
}
