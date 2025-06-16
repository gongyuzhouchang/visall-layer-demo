import type { VisInfo, LayerSpec, ApiContext } from '../types.d.ts';

// 由于无法直接导入bundle，我们假设AIGCDataVis已经在全局可用
const AIGCDataVis = window.AIGCDataVis;
const DEFINE = AIGCDataVis.DEFINE;

// 定义组件信息
const visInfo: VisInfo = {
  id: 'simpleGauge',
  name_en: 'Simple Gauge',
  name_zh: '简单仪表盘',
  types_en: ['gauge', 'indicator'],
  purpose_en: ['show progress', 'display metrics'],
  purpose_zh: ['显示进度', '展示指标'],
  standers: '',
  parameters: {
    value: {
      itemType: [DEFINE.NUMBER],
      category: DEFINE.SINGLE,
    },
    max: {
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
    let value = 0;
    let max = 100;
    let color = '#1890ff';

    if (encoding.value && data.length > 0) {
      const valueField = encoding.value as string;
      value = (data[0][valueField] as number) || 0;
    }

    if (encoding.max && data.length > 0) {
      const maxField = encoding.max as string;
      max = (data[0][maxField] as number) || 100;
    }

    if (encoding.color) {
      color = encoding.color as string;
    }

    const percent = Math.max(0, Math.min(value / max, 1));

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 200 100');

    // 背景弧
    const bgPath = document.createElementNS(svgNS, 'path');
    bgPath.setAttribute('d', 'M10 100 A90 90 0 0 1 190 100');
    bgPath.setAttribute('stroke', '#eee');
    bgPath.setAttribute('stroke-width', '20');
    bgPath.setAttribute('fill', 'none');

    // 前景弧
    const angle = 180 * percent;
    const rad = (Math.PI / 180) * angle;
    const x = 100 + 90 * Math.cos(Math.PI - rad);
    const y = 100 - 90 * Math.sin(Math.PI - rad);
    const large = percent > 0.5 ? 1 : 0;

    const fgPath = document.createElementNS(svgNS, 'path');
    fgPath.setAttribute('d', `M10 100 A90 90 0 ${large} 1 ${x} ${y}`);
    fgPath.setAttribute('stroke', color);
    fgPath.setAttribute('stroke-width', '20');
    fgPath.setAttribute('fill', 'none');

    // 数值文本
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', '100');
    text.setAttribute('y', '90');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '24');
    text.setAttribute('fill', color);
    text.textContent = `${value}`;

    svg.append(bgPath, fgPath, text);
    $dom.appendChild(svg);

    // 返回清理函数
    return () => {
      $dom.innerHTML = '';
    };
  },
});
