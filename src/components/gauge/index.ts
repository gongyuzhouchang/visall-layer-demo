import { layer as gaugeLayer } from '../../layers/simpleGaugeLayer';
import type { ComponentConfig } from '../../types.d.ts';

// 生成仪表盘测试数据
export const generateGaugeData = () => {
  return [{ metric_name: 'CPU使用率', value: 68, max_value: 100 }];
};

// 仪表盘组件配置
export const gaugeConfig: ComponentConfig = {
  id: 'simpleGauge',
  name: '简单仪表盘',
  description: '显示单个数值的仪表盘组件',
  spec: {
    data: [
      {
        values: generateGaugeData(),
        metadata: {
          data_type: 'Tabular',
          attribute_description: [
            {
              attribute_name: 'value',
              attribute_type: 'DOUBLE',
              attribute_unit: '%',
            },
            {
              attribute_name: 'max_value',
              attribute_type: 'DOUBLE',
              attribute_unit: '%',
            },
            {
              attribute_name: 'metric_name',
              attribute_type: 'STRING',
              attribute_unit: '',
            },
          ],
        },
      },
    ],
    view: {
      main: {
        layers: [
          {
            type: 'simpleGauge',
            encoding: {
              value: 'value',
              max: 'max_value',
              color: '#fb8c00',
            },
          },
        ],
      },
    },
  },
};

// 导出layer用于注册
export { gaugeLayer };
