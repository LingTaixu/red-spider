// { [key: string]: number }
export interface IConfig {
  env: string; // 开发环境
  mock?: string; // mock数据
  title: string; // 项目title
  baseUrl?: string; // 项目地址
  baseApi?: string; // api请求地址
  APPID?: string; // 公众号appId 一般放在服务器端
  $cdn: string; // cdn公共资源路径
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const envMap: { [key: string]: any } = {};
const globalModules = import.meta.glob("./*.ts", { eager: true });

Object.entries(globalModules).forEach(([key, value]) => {
  // key.match(/\.\/env\.(\S*)\.ts/)
  const name = key.replace(/\.\/env\.(.*)\.ts$/, "$1");
  envMap[name] = value;
});

// 根据环境引入不同配置
export const config = envMap[import.meta.env.VITE_ENV].default;
