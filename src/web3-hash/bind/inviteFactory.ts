import { AbiFragment } from "web3";
import { Invite } from "./invite";
import { Address } from "../Contract/type";
import { BaseFactory } from "../Contract/BaseFactory";

export class InviteFactory extends BaseFactory {
  public make(contractAddress: Address): Invite {
    return new Invite(this.abi, contractAddress, this.chain);
  }

  protected abi: AbiFragment[] = [
    {
      inputs: [
        {
          internalType: "address",
          name: "whiteAndBlack",
          type: "address"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address"
        }
      ],
      name: "OwnershipTransferred",
      type: "event"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "parent",
          type: "address"
        }
      ],
      name: "bind",
      outputs: [
        {
          internalType: "uint256",
          name: "inviteId",
          type: "uint256"
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
        },
        {
          internalType: "address",
          name: "parent",
          type: "address"
        }
      ],
      name: "bindFrom",
      outputs: [
        {
          internalType: "uint256",
          name: "inviteId",
          type: "uint256"
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
      name: "getInviteCode",
      outputs: [
        {
          internalType: "uint256",
          name: "inviteId",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "inviteId",
          type: "uint256"
        }
      ],
      name: "getInviteCodeByMember",
      outputs: [
        {
          internalType: "address",
          name: "member",
          type: "address"
        }
      ],
      stateMutability: "view",
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
      name: "getParent",
      outputs: [
        {
          internalType: "address",
          name: "parent",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getWhiteAndBlack",
      outputs: [
        {
          internalType: "address",
          name: "whiteAndBlack",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "inviteCode",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "whiteAndBlack",
          type: "address"
        }
      ],
      name: "setWhiteAndBlack",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address"
        }
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ];
}
