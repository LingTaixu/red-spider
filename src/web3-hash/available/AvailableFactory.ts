import { AbiFragment } from "web3";
import { Available } from "./Available";
import { Address } from "../Contract/type";
import { BaseFactory } from "../Contract/BaseFactory";

export class AvailableFactory extends BaseFactory {
  public make(contractAddress: Address): Available {
    return new Available(this.abi, contractAddress, this.chain);
  }

  protected abi: AbiFragment[] = [
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "addAvailableAmount",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "member",
          type: "address"
        }
      ],
      name: "availableBalanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    }
  ];
}
