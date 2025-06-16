import './style.css';
import { componentConfigs, registerAllComponents } from './components';
import type { ComponentConfig } from './types.d.ts';

// 创建组件选择器UI
function createComponentSelector(
  container: HTMLElement,
  configs: ComponentConfig[],
  onSelect: (config: ComponentConfig) => void
) {
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'component-selector';
  selectorContainer.innerHTML = `
    <div class="selector-header">
      <h3>选择组件</h3>
    </div>
    <div class="selector-list"></div>
  `;

  const selectorList = selectorContainer.querySelector('.selector-list') as HTMLElement;

  configs.forEach((config, index) => {
    const item = document.createElement('div');
    item.className = `selector-item ${index === 0 ? 'active' : ''}`;
    item.innerHTML = `
      <div class="item-name">${config.name}</div>
      <div class="item-description">${config.description}</div>
    `;

    item.addEventListener('click', () => {
      // 移除其他项的active状态
      selectorList
        .querySelectorAll('.selector-item')
        .forEach((el) => el.classList.remove('active'));
      // 添加当前项的active状态
      item.classList.add('active');
      // 调用选择回调
      onSelect(config);
    });

    selectorList.appendChild(item);
  });

  container.appendChild(selectorContainer);
}

// 当前渲染的组件实例
let currentRenderInstance: { destroy?: () => void; [key: string]: unknown } | null = null;

// 渲染组件
function renderComponent(container: HTMLElement, config: ComponentConfig) {
  // 清理之前的渲染实例
  if (currentRenderInstance && typeof currentRenderInstance.destroy === 'function') {
    currentRenderInstance.destroy();
  }

  // 清空容器
  container.innerHTML = '';

  // 使用DOM元素而不是选择器
  const { render } = window.AIGCDataVis;
  currentRenderInstance = render(container, config.spec);
}

// 创建应用布局
function createAppLayout(container: HTMLElement) {
  // 设置根容器样式
  container.style.cssText = `
    display: flex;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // 创建左侧选择器容器
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'sidebar';
  selectorContainer.style.cssText = `
    width: 300px;
    height: 100%;
    background: #f5f5f5;
    border-right: 1px solid #ddd;
    overflow-y: auto;
  `;

  // 创建右侧组件展示容器
  const componentContainer = document.createElement('div');
  componentContainer.className = 'main-content';
  componentContainer.style.cssText = `
    flex: 1;
    height: 100%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  container.appendChild(selectorContainer);
  container.appendChild(componentContainer);

  return { selectorContainer, componentContainer };
}

// 初始化应用
function initializeApp() {
  // 检查 AIGCDataVis 是否加载
  if (!window.AIGCDataVis) {
    console.error('AIGCDataVis 未加载，无法继续渲染。');
    return;
  }

  // 注册所有组件
  registerAllComponents();

  // 获取根容器
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('找不到app容器');
    return;
  }

  // 创建应用布局
  const { selectorContainer, componentContainer } = createAppLayout(appContainer);

  // 创建组件选择器
  createComponentSelector(selectorContainer, componentConfigs, (config) => {
    renderComponent(componentContainer, config);
  });

  // 默认渲染第一个组件
  if (componentConfigs.length > 0) {
    renderComponent(componentContainer, componentConfigs[0]);
  }
}

// 等待 DOM 与 VISALL 脚本就绪
window.addEventListener('DOMContentLoaded', initializeApp);
