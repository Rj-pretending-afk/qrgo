# QRGo

> 免费、开源、无需注册的自定义二维码生成器。纯前端处理，数据不上传服务器。

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 功能特性

### 核心功能
- **实时预览** — 输入即生成，所见即所得
- **中英双语界面** — 支持中文 / English 一键切换
- **简单 / 自定义模式** — 简单模式快速生成，自定义模式开放完整配置
- **预设模板** — 极简黑 / 复古蓝 / 赛博粉一键切换
- **颜色自定义** — 自定义前景色与背景色
- **点阵样式** — 方形 / 圆角 / 圆点
- **定位符样式** — 方角 / 圆角 / 圆点
- **边框设置** — 可调内边距与圆角，文字标签可选包含在边框内

### Logo 与标签
- **中心 Logo** — 上传本地图片后进入**裁剪弹窗**，可拖动选区和四角缩放，确认后嵌入二维码中心
- **文字标签** — 上下左右四个位置，各自配置字体、字号、颜色；支持**粗体 / 斜体 / 阴影**格式开关

### 预览与导出
- **预览缩放** — +/- 按钮在 160–520px 范围内调整预览尺寸（下载分辨率不受影响）
- **下载 PNG** — 含文字标签和边框的高分辨率合成图
- **下载 SVG** — 矢量格式
- **复制到剪贴板** — 一键复制 PNG

### 技术亮点
- ✅ **中文内容修复** — UTF-8 字节编码，避免 qrcode-generator 8-bit 截断乱码
- ✅ **2x 清晰渲染** — 560px canvas CSS 缩放至显示尺寸，retina 显示器清晰
- ✅ **纯前端处理** — 所有数据留在本地，无账号，无广告，无追踪

---

## 🚀 本地运行

**前置要求：** Node.js v18+

```bash
git clone https://github.com/Rj-pretending-afk/qrgo.git
cd qrgo
npm install
npm run dev
```

浏览器访问 `http://localhost:5173/qrgo/`

```bash
npm run build   # 构建生产版本
```

---

## 🛠 技术栈

| 分类 | 技术 |
|---|---|
| 前端框架 | React 19 + TypeScript 6 |
| 构建工具 | Vite 8 |
| 样式方案 | Tailwind CSS 3 |
| 二维码库 | qr-code-styling 1.9 |
| 部署 | GitHub Pages / Cloudflare Pages |

---

## 📁 项目结构

```
src/
├── components/
│   ├── InputPanel.tsx    # 内容、模板、Logo 上传与样式控制
│   ├── CropModal.tsx     # Logo 裁剪弹窗
│   ├── QRPreview.tsx     # 二维码预览、缩放、复制与下载
│   └── LabelPanel.tsx    # 文字标签配置（含格式选项）
├── hooks/
│   └── useQRCode.ts      # 二维码生成、UTF-8 处理与错误提示
├── types/
│   └── qr.types.ts       # TypeScript 类型定义
└── App.tsx               # 主布局、主题、语言与模式管理
```

---

## 🗺 开发路线图

- [x] Phase 0 · 项目搭建
- [x] Phase 1 · MVP（基础生成与下载）
- [x] Phase 2 · 样式定制（点阵、Logo、模板、文字标签）
- [x] Phase 3 · 体验完善（深色模式、双语界面、简单/自定义模式、复制、错误处理）
- [x] Phase 4 · 功能增强（Logo 裁剪、预览缩放、标签格式、Cloudflare 部署）

---

## 📄 License

[MIT](./LICENSE) © 2026 QRGo
