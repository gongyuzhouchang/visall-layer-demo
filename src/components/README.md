# 组件文件夹结构说明

这个文件夹包含了所有VISALL第三方组件的配置、数据和注册逻辑。

## 文件夹结构

```
src/components/
├── index.ts           # 统一入口，导出所有组件配置和注册函数
├── gauge/            # 仪表盘组件
│   └── index.ts      # 仪表盘组件配置和数据
├── bar/              # 柱状图组件
│   └── index.ts      # 柱状图组件配置和数据
└── README.md         # 说明文档
```

## 如何添加新组件

1. **创建组件文件夹**
   ```bash
   mkdir src/components/newComponent
   ```

2. **创建组件配置文件** (`src/components/newComponent/index.ts`)
   ```typescript
   import { layer as newComponentLayer } from '../../layers/newComponentLayer';
   import type { ComponentConfig } from '../../types.d.ts';

   // 生成测试数据
   export const generateNewComponentData = () => {
     return [
       // 你的测试数据
     ];
   };

   // 组件配置
   export const newComponentConfig: ComponentConfig = {
     id: 'newComponent',
     name: '新组件',
     description: '新组件的描述',
     spec: {
       // 你的组件规范
     },
   };

   // 导出layer用于注册
   export { newComponentLayer };
   ```

3. **更新统一入口文件** (`src/components/index.ts`)
   ```typescript
   import { newComponentConfig, newComponentLayer } from './newComponent';

   // 添加到组件配置数组
   export const componentConfigs: ComponentConfig[] = [
     gaugeConfig,
     barConfig,
     newComponentConfig, // 新增
   ];

   // 添加到组件layers数组
   export const componentLayers = [
     gaugeLayer,
     barLayer,
     newComponentLayer, // 新增
   ];

   // 导出新组件
   export * from './newComponent';
   ```

4. **创建实际的layer文件** (`src/layers/newComponentLayer.ts`)
   按照VISALL规范创建组件实现。

## 组件配置说明

每个组件配置包含以下部分：

- **id**: 组件唯一标识符
- **name**: 组件显示名称
- **description**: 组件描述
- **spec**: VISALL规范的组件配置
  - **data**: 测试数据和元数据
  - **view**: 视图配置，包含layers和encoding

## 自动注册

所有在 `componentConfigs` 和 `componentLayers` 中的组件会自动被注册到VISALL系统中。

只需要调用 `registerAllComponents()` 函数即可完成所有组件的注册。 