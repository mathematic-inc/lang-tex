import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default [
  {
    input: "./src/index.ts",
    output: [{ dir: "dist", format: "cjs" }],
    external(id) {
      return !/^[\.\/]/.test(id);
    },
    plugins: [
      json({ compact: true, preferConst: true }),
      typescript({
        typescript: require("typescript"),
        tsconfig: "./tsconfig.rollup.json"
      })
    ]
  },
  {
    input: "./src/index.ts",
    output: [{ file: "dist/index.es.js", format: "es" }],
    external(id) {
      return !/^[\.\/]/.test(id);
    },
    plugins: [
      json({ compact: true, preferConst: true }),
      typescript({ typescript: require("typescript") })
    ]
  }
];
