# 🔲 QRGo

> 免费、开源、无需注册的自定义二维码生成器。纯前端处理，数据不上传服务器。

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ 功能特性

### 核心功能
- 🖊 **实时预览** — 输入即生成，所见即所得
- 🎨 **颜色自定义** — 前景色 + 背景色自由搭配
- 📐 **点阵样式** — 方形 / 圆角 / 圆点三种风格
- 🔲 **定位符样式** — 方角 / 圆角 / 圆点三种风格
- 🖼 **中心 Logo** — 上传本地图片嵌入二维码中心
- 🏷 **文字标签** — 在二维码上下左右添加自定义文字（支持字体、字号、颜色、换行）
- 🎭 **预设模板** — 极简 / 复古蓝 / 霓虹 一键切换
- 🌙 **深色模式** — 支持手动切换浅色 / 深色

### 下载选项
- 下载为 **PNG**（含文字标签合成）
- 下载为 **SVG**（矢量格式）

### 隐私优先
- ✅ 纯前端处理，所有数据留在本地
- ✅ 无账号系统，无需注册
- ✅ 无广告，无追踪

---

## 🚀 本地运行

**前置要求：** Node.js v18+

```bash
# 克隆仓库
git clone https://github.com/你的用户名/qrgo.git
cd qrgo

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 `http://localhost:5173`

**构建生产版本：**
```bash
npm run build
```

---

## 🛠 技术栈

| 分类 | 技术 |
|---|---|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 8 |
| 样式方案 | Tailwind CSS 3 |
| 二维码库 | qr-code-styling 1.9 |
| 部署 | GitHub Pages / Vercel |

---

## 📁 项目结构

```
src/
├── components/
│   ├── InputPanel.tsx      # 内容与样式控制面板
│   ├── QRPreview.tsx       # 二维码预览与下载
│   └── LabelPanel.tsx      # 文字标签配置
├── hooks/
│   └── useQRCode.ts        # 二维码生成逻辑
├── types/
│   └── qr.types.ts         # TypeScript 类型定义
└── App.tsx                 # 主布局与状态管理
```

---

## 🗺 开发路线图

- [x] Phase 0 · 项目搭建
- [x] Phase 1 · MVP（基础生成与下载）
- [x] Phase 2 · 样式定制（点阵、Logo、模板、文字标签）
- [ ] Phase 3 · 完善与发布（SEO、GitHub Actions 自动部署）

---

## 📄 License

[MIT](./LICENSE) © 2026 QRGo
