# QRGo

> 免费、开源、无需注册的自定义二维码生成器。纯前端处理，数据不上传服务器。

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 功能特性

### 核心功能
- **实时预览** — 输入即生成，所见即所得
- **中英双语界面** — 支持中文 / English 一键切换
- **简单 / 自定义模式** — 简单模式快速生成，自定义模式开放完整配置
- **预设模板** — 极简黑 / 复古蓝 / 赛博粉一键切换
- **颜色自定义** — 自定义模式下可调整前景色与背景色
- **点阵样式** — 方形 / 圆角 / 圆点三种风格
- **定位符样式** — 方角 / 圆角 / 圆点三种风格
- **边框设置** — 支持设置二维码边框内边距与圆角
- **中心 Logo** — 上传本地图片嵌入二维码中心，并自动切换高纠错等级
- **文字标签** — 自定义模式下可在二维码上下左右添加文字，支持字体、字号、颜色与换行
- **深色模式** — 支持手动切换浅色 / 深色
- **中文内容修复** — 针对中文等非 ASCII 内容进行 UTF-8 字节处理，提升扫码结果准确性

### 模式说明
- **简单模式**
  - 保留内容输入、预设模板和中心 Logo 上传
  - 默认使用 H 级纠错
  - 默认使用 28px 边框内边距和 36px 圆角
  - 隐藏颜色、点阵、定位符、边框、纠错等级和文字标签设置
- **自定义模式**
  - 保留所有高级配置
  - 可自由调整颜色、样式、边框、纠错等级和文字标签

### 下载选项
- 下载为 **PNG**（含文字标签合成）
- 下载为 **SVG**（矢量格式）
- 一键复制二维码 PNG 到剪贴板

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

如果项目部署在 GitHub Pages 子路径下，访问路径可能是 `/qrgo/`。

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
│   ├── InputPanel.tsx      # 内容、模板、Logo 与样式控制面板
│   ├── QRPreview.tsx       # 二维码预览、复制与下载
│   └── LabelPanel.tsx      # 自定义文字标签配置
├── hooks/
│   └── useQRCode.ts        # 二维码生成、UTF-8 数据处理与错误提示
├── types/
│   └── qr.types.ts         # TypeScript 类型定义
└── App.tsx                 # 主布局、主题、语言与模式状态管理
```

---

## 🗺 开发路线图

- [x] Phase 0 · 项目搭建
- [x] Phase 1 · MVP（基础生成与下载）
- [x] Phase 2 · 样式定制（点阵、Logo、模板、文字标签）
- [x] Phase 3 · 体验完善（深色模式、双语界面、简单/自定义模式）
- [ ] Phase 4 · 发布优化（SEO、GitHub Actions 自动部署、更多模板）

---

## 📄 License

[MIT](./LICENSE) © 2026 QRGo
