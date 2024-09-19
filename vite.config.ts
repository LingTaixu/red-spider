import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";
import mockDevServerPlugin from "vite-plugin-mock-dev-server";
import vueSetupExtend from "vite-plugin-vue-setup-extend";
import viteCompression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html";
import inject from "@rollup/plugin-inject";
// 当前工作目录路径
const root: string = process.cwd();
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 环境变量
  const env = loadEnv(mode, root, "");
  // console.log(env.VITE_ENABLE_ERUDA, "env.VITE_ENABLE_ERUDA");

  return {
    base: env.VITE_PUBLIC_PATH || "/",
    define: {
      "process.env": process.env
    },
    plugins: [
      vue(),
      vueJsx(),
      mockDevServerPlugin(),
      // vant 组件自动按需引入
      Components({
        resolvers: [VantResolver()]
      }),
      // svg icon
      createSvgIconsPlugin({
        // 指定图标文件夹
        iconDirs: [path.resolve(root, "src/icons/svg")],
        // 指定 symbolId 格式
        symbolId: "icon-[dir]-[name]"
      }),
      // 允许 setup 语法糖上添加组件名属性
      vueSetupExtend(),
      // 生产环境 gzip 压缩资源
      viteCompression({
        verbose: true,
        disable: false,
        algorithm: "gzip",
        ext: ".gz"
        // 以下配置仅生成 Gzip 压缩文件，不会生成原始文件
      }),
      // 注入模板数据
      createHtmlPlugin({
        inject: {
          data: {
            ENABLE_ERUDA: env.VITE_ENABLE_ERUDA || "false"
          }
        }
      })
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        util: "util"
      }
    },
    server: {
      host: true
    },
    build: {
      chunkSizeWarningLimit: 2000
    }
  };
});
