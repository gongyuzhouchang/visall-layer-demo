# visall-layer-demo

> 纯 TypeScript + 原生 DOM 示例，演示如何向 **AIGCDataVis** 注册自定义 Layer。

## 快速开始

```bash
git clone <repo> && cd visall-layer-demo
npm i
npm run dev
```

浏览器自动打开 `http://localhost:5173`，即可看到自定义仪表盘 Layer 渲染结果。

## 主要命令

| 命令             | 说明                |
| ---------------- | ------------------- |
| `npm run dev`    | 本地开发（Vite）     |
| `npm run build`  | 打包生产包           |
| `npm run test`   | Vitest + 覆盖率      |
| `npm run lint`   | ESLint（零 WARNING） |
| `npm run format` | Prettier 一键格式化  |

## 目录结构

```
visall-layer-demo/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ README.md
├─ .eslintrc.cjs
├─ .prettierrc.yml
├─ src/
│  ├─ main.ts
│  ├─ style.css
│  ├─ types.d.ts
│  └─ layers/
│     └─ simpleGaugeLayer.ts
└─ tests/
   └─ simpleGaugeLayer.test.ts
``` 