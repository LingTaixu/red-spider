// 本地环境配置
export default {
  env: "development",
  mock: true,
  title: "开发",
  baseUrl: import.meta.env.VITE_API_BASEURL, // 项目地址
  baseApi: import.meta.env.VITE_API_BASEURL, // 本地api请求地址,注意：如果你使用了代理，请设置成'/'

  /*HBC Test Chain*/
  nftFixedStarAddress: "0xaFCBf413BC2613556c6343548aaFe25F951BD780",
  chain: {
    chainId: "0x4d2",
    chainName: "Hash Test Chain",
    rpcUrls: ["http://rpc.test.chain.hashbc.cn"],
    blockExplorerUrls: ["http://47.108.140.190:8118"],
    iconUrls: [
      "https://memallpro.oss-cn-zhangjiakou.aliyuncs.com/20220515/107318af1783306b0e16f5496568f5ae.png"
    ],
    nativeCurrency: {
      name: "HBC",
      symbol: "HBC",
      decimals: 18
    }
  },
  // host : 'http://api.mepro.mebit.cc'
  host: "http://api.mepro.hashwt.com",
  host1: "http://api.mepro.hashwt.com",

  //区块链浏览器
  browser: "http://browser.hashbc.cn",
  //dapp网址
  h5: "http://eden.dapp.hashweb.cn",
  //rpc
  rpc: "http://rpc.chain.hashbc.cn",
  fishNft: "http://47.108.140.190:9111"
};
