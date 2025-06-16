export interface IRegisterLayerParams<TProps = Record<string, unknown>> {
  /** 唯一类型标识，用于渲染时匹配 */
  type: string;
  /** 默认宽度 */
  defaultWidth?: number;
  /** 默认高度 */
  defaultHeight?: number;
  /** 渲染函数 */
  render(container: HTMLElement, props: TProps): void;
}

export interface ISimpleGaugeProps {
  value: number;
  max?: number;
  color?: string;
}

// VISALL 相关类型定义
export interface VisInfo {
  id: string;
  name_en: string;
  name_zh: string;
  types_en: string[];
  purpose_en: string[];
  purpose_zh: string[];
  standers: string;
  parameters: Record<
    string,
    {
      itemType: string[];
      category: string;
    }
  >;
}

export interface LayerSpec {
  encoding?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ApiContext {
  spec: {
    data?: Array<{
      values: Record<string, unknown>[];
      metadata?: unknown;
    }>;
    [key: string]: unknown;
  };
}

// 组件配置接口
export interface ComponentConfig {
  id: string;
  name: string;
  description: string;
  spec: {
    data: Array<{
      values: Record<string, unknown>[];
      metadata?: {
        data_type: string;
        attribute_description: Array<{
          attribute_name: string;
          attribute_type: string;
          attribute_unit: string;
        }>;
      };
    }>;
    view: {
      main: {
        layers: Array<{
          type: string;
          encoding: Record<string, unknown>;
        }>;
      };
    };
  };
}

declare global {
  interface Window {
    AIGCDataVis: {
      registerLayer: <T>(layer: IRegisterLayerParams<T>) => void;
      render: (
        container: HTMLElement | string,
        config: unknown
      ) => {
        destroy?: () => void;
        [key: string]: unknown;
      };
      defineExternalLayer: (params: {
        type: string;
        visInfo: VisInfo;
        cdn?: string[];
        render: (api: ApiContext, spec: LayerSpec, $dom: HTMLElement) => (() => void) | void;
      }) => unknown;
      DEFINE: {
        STR: string;
        NUMBER: string;
        BOOLEAN: string;
        OBJECT: string;
        ARRAY: string;
        SINGLE: string;
        MULTIPLE: string;
        COLOR: string;
        GROUPBY: string;
      };
      // 其他属性可选
      [key: string]: unknown;
    };
  }
}

export {};
