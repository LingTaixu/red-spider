import { AbiFragment } from "web3";
import { RedSpider } from "./RedSpider";
import { Address } from "../Contract/type";
import { BaseFactory } from "../Contract/BaseFactory";

export class RedSpiderFactory extends BaseFactory {
  public make(contractAddress: Address): RedSpider {
    return new RedSpider(this.abi, contractAddress, this.chain);
  }

  protected abi: AbiFragment[] = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "orderId",
          type: "uint256"
        }
      ],
      name: "claim",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "claimReward",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "parent",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "day",
          type: "uint256"
        }
      ],
      name: "entrance",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "funPoolInsert",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "addresses",
          type: "address[]"
        },
        {
          internalType: "uint256[]",
          name: "amounts",
          type: "uint256[]"
        },
        {
          internalType: "uint256",
          name: "orderId",
          type: "uint256"
        }
      ],
      name: "issueSocietyRewards",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "payToken",
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
          name: "rewardAddress",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "rewardType",
          type: "uint256"
        }
      ],
      name: "IssueReward",
      type: "event"
    },
    {
      inputs: [],
      name: "liquidate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address"
        }
      ],
      name: "Liquidate",
      type: "event"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "orderId",
          type: "uint256"
        }
      ],
      name: "liquidateOrder",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "orderId",
          type: "uint256"
        },
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address"
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "address",
          name: "owner",
          type: "address"
        }
      ],
      name: "LiquidateOrder",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "orderId",
          type: "uint256"
        }
      ],
      name: "OrderCrated",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "orderId",
          type: "uint256"
        }
      ],
      name: "OrderOutIncome",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "orderId",
          type: "uint256"
        }
      ],
      name: "OrderSuccess",
      type: "event"
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
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "memberCount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "lotAmount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "maxLot",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "minDay",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "maxDay",
          type: "uint256"
        }
      ],
      name: "setAdmissionParam",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "deposit",
          type: "address"
        },
        {
          internalType: "address",
          name: "claimAddress",
          type: "address"
        }
      ],
      name: "setHandleAddress",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "insuranceToken",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "insuranceTokenRate",
          type: "uint256"
        }
      ],
      name: "setInsurance",
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
        },
        {
          internalType: "address",
          name: "invite",
          type: "address"
        }
      ],
      name: "setInterfaceParam",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "level",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "node",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "link",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "rate",
          type: "uint256"
        }
      ],
      name: "setLevel",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "levelMax",
          type: "uint256"
        }
      ],
      name: "setLevelMax",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "platformCommission",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "platformCommissionAddress",
          type: "address"
        },
        {
          internalType: "address",
          name: "fundAddress",
          type: "address"
        }
      ],
      name: "setPlatformParam",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "router",
          type: "address"
        }
      ],
      name: "setRouter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "lead",
          type: "uint256"
        },
        {
          internalType: "bool",
          name: "paused",
          type: "bool"
        }
      ],
      name: "setSystemParam",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "incomeRate",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "claimRate",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "availableRate",
          type: "uint256"
        }
      ],
      name: "setSystemRate",
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
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address"
        }
      ],
      name: "withdrawToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "getAdmissionParam",
      outputs: [
        {
          internalType: "uint256",
          name: "memberCount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "lotAmount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "maxLot",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "minDay",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "maxDay",
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
          name: "quantity",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "day",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "member",
          type: "address"
        }
      ],
      name: "getClaimAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "claimAmount",
          type: "uint256"
        },
        {
          internalType: "bool",
          name: "entranceStatus",
          type: "bool"
        },
        {
          internalType: "uint256",
          name: "payAmount",
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
          name: "orderId",
          type: "uint256"
        }
      ],
      name: "getClaimStatus",
      outputs: [
        {
          internalType: "uint256",
          name: "status",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "time",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "needAmount",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getFundPool",
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
      name: "getHandleAddress",
      outputs: [
        {
          internalType: "address",
          name: "deposit",
          type: "address"
        },
        {
          internalType: "address",
          name: "claimAddress",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getIncome",
      outputs: [
        {
          internalType: "uint256",
          name: "incomePool",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "incomeCount",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getInsurance",
      outputs: [
        {
          internalType: "address",
          name: "insuranceToken",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "insuranceTokenRate",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getInsurancePool",
      outputs: [
        {
          internalType: "address",
          name: "token",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getInterfaceParam",
      outputs: [
        {
          internalType: "address",
          name: "whiteAndBlack",
          type: "address"
        },
        {
          internalType: "address",
          name: "invite",
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
          name: "owner",
          type: "address"
        }
      ],
      name: "getLinkCount",
      outputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "bool",
          name: "isValid",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getLiquidateParam",
      outputs: [
        {
          internalType: "uint256",
          name: "liquidateIncomePool",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "liquidateInsurancePool",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "liquidateOrderId",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        }
      ],
      name: "getNodeAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "count",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getPayToken",
      outputs: [
        {
          internalType: "address",
          name: "payToken",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getPeriod",
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
      name: "getPlatformParam",
      outputs: [
        {
          internalType: "uint256",
          name: "platformCommission",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "platformCommissionAddress",
          type: "address"
        },
        {
          internalType: "address",
          name: "fundAddress",
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
          name: "owner",
          type: "address"
        }
      ],
      name: "getRewards",
      outputs: [
        {
          internalType: "uint256",
          name: "linkReward",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "societyReward",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getRewardsAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "issueRewardsAmount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "issueSocietyRewardsAmount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "totalRewardsAmount",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getRouter",
      outputs: [
        {
          internalType: "address",
          name: "router",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getSystemParam",
      outputs: [
        {
          internalType: "uint256",
          name: "lead",
          type: "uint256"
        },
        {
          internalType: "bool",
          name: "paused",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getSystemRate",
      outputs: [
        {
          internalType: "uint256",
          name: "incomeRate",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "claimRate",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "availableRate",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getTotal",
      outputs: [
        {
          internalType: "uint256",
          name: "total",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "totalCount",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      name: "LevelBalanceOf",
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
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      name: "orderInfo",
      outputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "_startTime",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "_status",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "_incomeDay",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "_claimAmount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "_endTime",
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
    }
  ];
}
