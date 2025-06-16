import { describe, it, expect, beforeEach } from 'vitest';
import simpleGaugeLayer from '../src/layers/simpleGaugeLayer';

describe('simpleGaugeLayer', () => {
  beforeEach(() => {
    // @ts-ignore 扩展 window 以注入模拟对象
    window.AIGCDataVis = {
      _layers: {} as Record<string, unknown>,
      registerLayer(layer: { type: string }) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        this._layers = this._layers || {};
        // @ts-ignore
        this._layers[layer.type] = layer;
      },
    } as any;
  });

  it('registerLayer 后能识别 simpleGauge 类型', () => {
    const { registerLayer, _layers } = window.AIGCDataVis as any;
    registerLayer(simpleGaugeLayer);
    expect(_layers.simpleGauge).toBe(simpleGaugeLayer);
  });

  it('value 超过 max 时弧度应被裁切到 100%', () => {
    const container = document.createElement('div');
    simpleGaugeLayer.render(container, { value: 150, max: 100 });
    const paths = container.querySelectorAll('path');
    // 第二个 path 是前景弧
    const fgPath = paths[1] as SVGPathElement;
    expect(fgPath.getAttribute('d')).toContain('190 100');
  });

  it('颜色参数应生效', () => {
    const container = document.createElement('div');
    const color = '#fb8c00';
    simpleGaugeLayer.render(container, { value: 50, max: 100, color });
    const paths = container.querySelectorAll('path');
    const fgPath = paths[1] as SVGPathElement;
    expect(fgPath.getAttribute('stroke')).toBe(color);
  });
}); 