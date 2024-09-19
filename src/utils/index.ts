import { Web3 } from "web3";

export const fromWei = (amount: number, decimals: number) => {
  const amountBigInt = Web3.utils.toBigInt(amount);
  const decimalsBigInt = Web3.utils.toBigInt(decimals);
  // init
  const denomination = BigInt(10) ** decimalsBigInt;
  // value in wei would always be integer
  // 13456789, 1234
  const value = String(Web3.utils.toNumber(amountBigInt));
  // count number of zeros in denomination
  // 1000000 -> 6
  const numberOfZerosInDenomination = denomination.toString().length - 1;

  if (numberOfZerosInDenomination <= 0) {
    return value.toString();
  }

  // pad the value with required zeros
  // 13456789 -> 13456789, 1234 -> 001234
  const zeroPaddedValue = value.padStart(numberOfZerosInDenomination, "0");

  // get the integer part of value by counting number of zeros from start
  // 13456789 -> '13'
  // 001234 -> ''
  const integer = zeroPaddedValue.slice(0, -numberOfZerosInDenomination);

  // get the fraction part of value by counting number of zeros backward
  // 13456789 -> '456789'
  // 001234 -> '001234'
  const fraction = zeroPaddedValue
    .slice(-numberOfZerosInDenomination)
    .replace(/\.?0+$/, "");

  if (integer === "" && fraction === "") {
    return "0";
  }
  if (integer === "") {
    return `0.${fraction}`;
  }
  if (fraction === "") {
    return integer;
  }

  return `${integer}.${fraction}`;
};

export const toWei = (amount: number | string, decimals: number) => {
  const amountBigInt = Web3.utils.toBigInt(amount);
  const decimalsBigInt = Web3.utils.toBigInt(decimals);
  const denomination = BigInt(10) ** decimalsBigInt;

  const [integer, fraction] = String(
    typeof amountBigInt === "string" && !Web3.utils.isHexStrict(amountBigInt)
      ? amountBigInt
      : Web3.utils.toNumber(amountBigInt)
  )
    .split(".")
    .concat("");

  // join the value removing `.` from
  // 24.56 -> 2456
  const value = BigInt(`${integer}${fraction}`);

  // multiply value with denomination
  // 2456 * 1000000 -> 2456000000
  const updatedValue = value * denomination;

  // count number of zeros in denomination
  const numberOfZerosInDenomination = denomination.toString().length - 1;

  // check which either `fraction` or `denomination` have lower number of zeros
  const decimalsMath = Math.min(fraction.length, numberOfZerosInDenomination);

  if (decimalsMath === 0) {
    return updatedValue.toString();
  }
  return updatedValue
    .toString()
    .padStart(decimalsMath, "0")
    .slice(0, -decimalsMath);
};

export const convertToPercentageString = (value: number): string => {
  // 将万分之一的数字转换为百分比形式的字符串
  const percentageValue = value * 0.0001; // 将万分之一转换为百分之一
  const formattedValue = (percentageValue * 100).toFixed(2); // 转换为百分比形式的字符串并保留两位小数
  const percentageString = formattedValue.endsWith(".00")
    ? formattedValue.slice(0, -3) + "%"
    : formattedValue + "%"; // 去掉末尾的两个零
  return percentageString;
};
