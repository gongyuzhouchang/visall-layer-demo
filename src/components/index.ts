import { gaugeConfig, gaugeLayer } from './gauge';
import { barConfig, barLayer } from './bar';
import type { ComponentConfig } from '../types.d.ts';

// 所有组件配置
export const componentConfigs: ComponentConfig[] = [gaugeConfig, barConfig];

// 所有组件layers
export const componentLayers = [gaugeLayer, barLayer];

// 注册所有组件
export function registerAllComponents() {
  if (!window.AIGCDataVis) {
    throw new Error('AIGCDataVis 未加载，无法注册组件');
  }

  const { registerLayer } = window.AIGCDataVis;

  componentLayers.forEach((layer) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerLayer(layer as any);
  });

  console.log(`已注册 ${componentLayers.length} 个组件`);
}

// 导出具体组件用于单独使用
export * from './gauge';
export * from './bar';
