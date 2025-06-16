import type { VisInfo, LayerSpec, ApiContext } from '../types.d.ts';

// 由于无法直接导入bundle，我们假设AIGCDataVis已经在全局可用
const AIGCDataVis = window.AIGCDataVis;
const DEFINE = AIGCDataVis.DEFINE;

// 定义组件信息
const visInfo: VisInfo = {
  id: 'simpleBar',
  name_en: 'Simple Bar Chart',
  name_zh: '简单柱状图',
  types_en: ['bar', 'chart'],
  purpose_en: ['compare values', 'show data distribution'],
  purpose_zh: ['比较数值', '显示数据分布'],
  standers: '',
  parameters: {
    x: {
      itemType: [DEFINE.STR],
      category: DEFINE.SINGLE,
    },
    y: {
      itemType: [DEFINE.NUMBER],
      category: DEFINE.SINGLE,
    },
    color: {
      itemType: [DEFINE.STR],
      category: DEFINE.COLOR,
    },
  },
};

// 注册外部图层
export const layer = AIGCDataVis.defineExternalLayer({
  type: visInfo.id,
  visInfo,
  render(api: ApiContext, spec: LayerSpec, $dom: HTMLElement) {
    // 清空旧内容
    $dom.innerHTML = '';

    // 从spec.encoding中获取参数值
    const encoding = spec.encoding || {};
    const data = api.spec.data?.[0]?.values || [];

    // 获取参数值
    let xField = '';
    let yField = '';
    let color = '#1890ff';

    if (encoding.x) {
      xField = encoding.x as string;
    }

    if (encoding.y) {
      yField = encoding.y as string;
    }

    if (encoding.color) {
      color = encoding.color as string;
    }

    // 如果没有数据或字段映射，显示提示
    if (!data.length || !xField || !yField) {
      $dom.innerHTML =
        '<div style="padding: 20px; text-align: center; color: #999;">缺少数据或字段映射</div>';
      return;
    }

    // 计算数据范围
    const maxValue = Math.max(...data.map((d) => (d[yField] as number) || 0));
    const chartHeight = 200;
    const chartWidth = 400;
    const barWidth = (chartWidth / data.length) * 0.8;
    const barSpacing = (chartWidth / data.length) * 0.2;

    // 创建SVG
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${chartWidth + 100} ${chartHeight + 80}`);

    // 创建柱状图
    data.forEach((d, index) => {
      const value = (d[yField] as number) || 0;
      const label = String(d[xField]) || '';
      const barHeight = (value / maxValue) * chartHeight;
      const x = index * (barWidth + barSpacing) + barSpacing / 2 + 50;
      const y = chartHeight + 30 - barHeight;

      // 柱子
      const rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', color);
      rect.setAttribute('rx', '2');

      // 数值标签
      const valueText = document.createElementNS(svgNS, 'text');
      valueText.setAttribute('x', (x + barWidth / 2).toString());
      valueText.setAttribute('y', (y - 5).toString());
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '12');
      valueText.setAttribute('fill', '#333');
      valueText.textContent = value.toString();

      // X轴标签
      const labelText = document.createElementNS(svgNS, 'text');
      labelText.setAttribute('x', (x + barWidth / 2).toString());
      labelText.setAttribute('y', (chartHeight + 50).toString());
      labelText.setAttribute('text-anchor', 'middle');
      labelText.setAttribute('font-size', '12');
      labelText.setAttribute('fill', '#666');
      labelText.textContent = label;

      svg.append(rect, valueText, labelText);
    });

    // Y轴
    const yAxis = document.createElementNS(svgNS, 'line');
    yAxis.setAttribute('x1', '50');
    yAxis.setAttribute('y1', '30');
    yAxis.setAttribute('x2', '50');
    yAxis.setAttribute('y2', (chartHeight + 30).toString());
    yAxis.setAttribute('stroke', '#ccc');
    yAxis.setAttribute('stroke-width', '1');

    // X轴
    const xAxis = document.createElementNS(svgNS, 'line');
    xAxis.setAttribute('x1', '50');
    xAxis.setAttribute('y1', (chartHeight + 30).toString());
    xAxis.setAttribute('x2', (chartWidth + 50).toString());
    xAxis.setAttribute('y2', (chartHeight + 30).toString());
    xAxis.setAttribute('stroke', '#ccc');
    xAxis.setAttribute('stroke-width', '1');

    svg.append(yAxis, xAxis);
    $dom.appendChild(svg);

    // 返回清理函数
    return () => {
      $dom.innerHTML = '';
    };
  },
});
