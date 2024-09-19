export default {
  env: "env.production",
  mock: true,
  title: "生产",
  baseUrl: import.meta.env.VITE_API_BASEURL, // 项目地址
  baseApi: import.meta.env.VITE_API_BASEURL, // 本地api请求地址,注意：如果你使用了代理，请设置成'/'

  nftFixedStarAddress: "0x4ef5d44bb3bf04034acbd2e939d30f487baeeb5c",
  chain: {
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
  },
  host: "http://47.108.140.190:9501",
  host1: "http://47.108.140.190:9521",
  //区块链浏览器
  browser: import.meta.env.VITE_APP_BROWSER,
  //Dapp网址
  h5: "http://47.108.140.190:1555",
  //rpc//HBC Test Chain
  rpc: "https://bsc-dataseed.binance.org",
  fishNft: "http://fishnft.dapp.hashweb.cn"
};
