import Web3 from "web3";
const ethereum = window?.ethereum;
const web3 = new Web3(ethereum);

export const utf8ToHex = (address: string) => web3.utils.utf8ToHex(address);

export const sliceAddress = (address: string) => {
  if (!address) return;
  const end0 = 4;
  const start0 = -4;
  const newAddress = address.toLowerCase();
  if (newAddress) {
    const start = newAddress.slice(0, end0);
    const end = newAddress.slice(start0, newAddress.length);
    return `${start}...${end}`;
  }
  return newAddress;
};

export const headerSliceAddress = (address: string) => {
  if (!address) return;
  const end0 = 8;
  const start0 = -8;
  const newAddress = address.toLowerCase();
  if (newAddress) {
    const start = newAddress.slice(0, end0);
    const end = newAddress.slice(start0, newAddress.length);
    return `${start}...${end}`;
  }
  return newAddress;
};

export const sliceAddressNumber = (address: string, num: number) => {
  if (!address) return;
  const end0 = num;
  const start0 = -num;
  const newAddress = address.toLowerCase();
  if (newAddress) {
    const start = newAddress.slice(0, end0);
    const end = newAddress.slice(start0, newAddress.length);
    return `${start}...${end}`;
  }
  return newAddress;
};
export default web3;
