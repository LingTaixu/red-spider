import { useCommonStore } from "@/store";

interface ChainConfig {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  iconUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

interface ChainConfigObject {
  [key: string]: ChainConfig;
}

const ethereum = window.ethereum;
export const walletEnv = () => {
  const env = import.meta.env.MODE;

  const envChainConfig: ChainConfigObject = {
    development: {
      chainId: "0x61",
      chainName: "BNB Smart Chain Testnet",
      rpcUrls: ["https://data-seed-prebsc-1-s3.binance.org:8545"],
      blockExplorerUrls: ["https://testnet.bscscan.com/"],
      iconUrls: [""],
      nativeCurrency: {
        name: "tBNB",
        symbol: "tBNB",
        decimals: 18
      }
    },
    production: {
      chainId: "0x38",
      chainName: "BNB Chain",
      rpcUrls: ["https://bsc-dataseed.binance.org"],
      // rpcUrls: ['http://rpc.chain.hashbc.cn'],
      blockExplorerUrls: ["https://bscscan.com"],
      iconUrls: [],
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18
      }
    }
  };

  return envChainConfig[env];
};

export const addChain = async (params: any): Promise<any> => {
  try {
    console.log("wallet_addEthereumChain");

    const addError = await ethereum.request({
      method: "wallet_addEthereumChain",
      params
    });
    return addError;
  } catch (error) {
    console.error(error, "wallet_addEthereumChain");
    return null;
  }
};

export const switchChain = async (params: any): Promise<any> => {
  try {
    const switchError = await ethereum.request({
      method: "wallet_switchEthereumChain",
      params
    });
    return switchError;
  } catch (error) {
    console.error(error, "wallet_switchEthereumChain");
    return error;
  }
};

export const getChainID = async (): Promise<string> => {
  try {
    const chainID = await ethereum.request({ method: "eth_chainId" });
    return chainID;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export const addToken = async (token: any): Promise<boolean> => {
  try {
    if (!token.address) {
      console.error("Cannot register an empty token");
      return false;
    }

    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals
        }
      }
    });

    return !!wasAdded;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const chain = walletEnv();

export async function checkChain(): Promise<boolean> {
  const chainId = await getChainID();
  console.log(chainId, "chainId");

  if (chainId !== chain.chainId) {
    let switchError = await switchChain([{ chainId: chain.chainId }]);
    console.log(switchError, "switchError");

    if (switchError && switchError.code === 4902) {
      console.log(4902);

      const addError = await addChain([chain]);

      if (addError) {
        return false;
      }

      switchError = await switchChain([{ chainId: chain.chainId }]);
      console.log(switchError, "add");

      if (!switchError) {
        return true;
      }
    }
    return true;
  } else {
    return true;
  }

  return false;
}

export async function getAddress() {
  const addresses = await ethereum.enable();
  const address = addresses?.[0]; // 使用可选链操作符和解构赋值
  if (address) {
    useCommonStore().update_address(address);
    return address;
  }
}
