import { layer as barLayer } from '../../layers/simpleBarLayer';
import type { ComponentConfig } from '../../types.d.ts';

// 生成柱状图测试数据
export const generateBarData = () => {
  return [
    { category: '一月', sales: 120 },
    { category: '二月', sales: 180 },
    { category: '三月', sales: 150 },
    { category: '四月', sales: 200 },
    { category: '五月', sales: 170 },
  ];
};

// 柱状图组件配置
export const barConfig: ComponentConfig = {
  id: 'simpleBar',
  name: '简单柱状图',
  description: '显示分类数据对比的柱状图组件',
  spec: {
    data: [
      {
        values: generateBarData(),
        metadata: {
          data_type: 'Tabular',
          attribute_description: [
            {
              attribute_name: 'category',
              attribute_type: 'STRING',
              attribute_unit: '',
            },
            {
              attribute_name: 'sales',
              attribute_type: 'DOUBLE',
              attribute_unit: '万元',
            },
          ],
        },
      },
    ],
    view: {
      main: {
        layers: [
          {
            type: 'simpleBar',
            encoding: {
              x: 'category',
              y: 'sales',
              color: '#52c41a',
            },
          },
        ],
      },
    },
  },
};

// 导出layer用于注册
export { barLayer };
