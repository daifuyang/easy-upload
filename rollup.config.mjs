import typescript from "@rollup/plugin-typescript";

// rollup.config.mjs
export default {
  input: "index.js",
  output: [
    // ESM 输出
    {
      format: "es",
      file: "es/index.js"
    },
    // CommonJS 输出
    {
      format: "cjs",
      file: "lib/index.js"
    },
    // UMD 输出
    {
      format: "umd",
      name: "easyUpload", // 全局变量名
      file: "dist/easy-upload.umd.js"
    }
  ],
  external: ['react','react-dom'], // 声明外部依赖
  plugins: [
    typescript() // 使用TypeScript插件
  ]
};
