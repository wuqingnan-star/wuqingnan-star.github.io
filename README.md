# 数据后台管理系统

一个基于 React + Ant Design + ECharts 的现代化数据后台管理系统。

## 功能特性

- 🎨 现代化的 UI 设计，基于 Ant Design 5.x
- 📊 丰富的数据可视化图表，使用 ECharts
- 📱 完全响应式设计，支持移动端
- 🚀 基于 Vite 构建，开发体验优秀
- 🎯 无需登录，直接进入系统
- 📈 多种图表类型：柱状图、饼图、折线图、仪表盘

## 技术栈

- **前端框架**: React 18
- **UI 组件库**: Ant Design 5.x
- **图表库**: ECharts + echarts-for-react
- **构建工具**: Vite
- **图标**: @ant-design/icons

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/
│   └── Dashboard.jsx      # 仪表盘组件
├── App.jsx               # 主应用组件
├── main.jsx              # 应用入口
└── index.css             # 全局样式
```

## 功能说明

### 布局结构
- **左侧边栏**: 可折叠的导航菜单
- **顶部头部**: 系统标题和菜单折叠按钮
- **主内容区**: 数据展示和图表

### 菜单功能
- **首页**: 数据概览，包含统计卡片和多种图表
- **图表分析**: 
  - 柱状图：月度销售数据
  - 饼图：产品类别分布
  - 折线图：用户增长趋势

### 响应式设计
- 支持桌面端、平板和手机端
- 在小屏幕设备上自动折叠侧边栏
- 图表和布局自适应不同屏幕尺寸

## 自定义配置

### 修改图表数据
在 `src/components/Dashboard.jsx` 中修改相应的图表配置函数。

### 添加新的图表类型
1. 在 `Dashboard.jsx` 中添加新的图表配置函数
2. 在 `renderChart` 函数中添加对应的 case
3. 在 `App.jsx` 的菜单中添加新的菜单项

### 修改主题
可以通过 Ant Design 的 ConfigProvider 来自定义主题色彩。

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

MIT License
