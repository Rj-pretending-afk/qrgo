# 🔲 QRCraft · 自定义二维码生成器 · 项目规划文档

> 版本：v0.1 · 状态：规划阶段 · 最后更新：2026-04

---

## 目录

1. [项目概述](#1-项目概述)
2. [功能范围](#2-功能范围)
3. [技术选型](#3-技术选型)
4. [项目结构](#4-项目结构)
5. [开发阶段划分](#5-开发阶段划分)
6. [界面设计思路](#6-界面设计思路)
7. [核心功能技术实现](#7-核心功能技术实现)
8. [GitHub 仓库规范](#8-github-仓库规范)
9. [测试策略](#9-测试策略)
10. [部署方案](#10-部署方案)
11. [未来扩展方向](#11-未来扩展方向)
12. [参考资源](#12-参考资源)

---

## 1. 项目概述

### 1.1 定位

**QRCraft** 是一个完全免费、开源的在线二维码生成器。（主要是随便翻一翻都是要注册账号且收费实在是看不下去（？？？））  
用户输入文本或链接后，可以实时调整二维码的样式（颜色、形状、边角），并在中心嵌入自定义图片（Logo），最终下载高质量图片。

### 1.2 与市面上其他产品的区别

| 特性 | 同类商业产品 | QRCraft |
|---|---|---|
| 价格 | 收费（部分功能限制） | 完全免费 |
| 自定义样式 | ✅ 丰富（收费） | ✅ 核心样式免费 |
| 中心 Logo | ✅（收费） | ✅ 免费 |
| 动态二维码 | ✅（收费） | ❌ 暂不支持 |
| 账号系统 | 需要 | ❌ 无需注册 |
| 广告 | 有 | ❌ 无 |
| 开源 | ❌ | ✅ MIT |
| 数据隐私 | 上传至服务器 | ✅ 纯前端处理，不上传 |

### 1.3 核心价值主张

> **"输入即生成，所见即所得，纯前端处理，隐私零泄露。"**

---

## 2. 功能范围

### 2.1 MVP（第一个版本）

- [ ] 输入框（支持文本 / URL 输入）
- [ ] 实时预览二维码
- [ ] 颜色自定义（前景色 + 背景色）
- [ ] 纠错等级选择（L / M / Q / H）
- [ ] 下载为 PNG / SVG
- [ ] 响应式布局（手机端可用）

### 2.2 第二版（核心差异化功能）

- [ ] 二维码点阵样式（圆形 / 方形 / 圆角方）
- [ ] 外框定位符（缩眼）样式自定义
- [ ] 中心嵌入自定义 Logo 图片（上传本地图片）
- [ ] Logo 大小调节
- [ ] 预设风格模板（如：黑白极简 / 彩色渐变 / 复古等）

### 2.3 明确不做

- 动态二维码（需要服务器）
- 二维码扫描分析
- 账号系统 / 历史记录云端同步
- 批量生成

---

## 3. 技术选型

### 3.1 技术栈一览

```
前端框架：   React 18 + TypeScript
构建工具：   Vite
样式方案：   Tailwind CSS + CSS Variables（自定义主题）
QR 生成库：  qr-code-styling（支持点阵样式、Logo嵌入）
              备选：qrcode.js（轻量）
状态管理：   React useState / useReducer（足够简单，无需 Redux）
文件下载：   FileSaver.js 或原生 Blob API
图标库：     Lucide React
部署：       GitHub Pages 或 Vercel（静态部署，零成本）
```

### 3.2 为什么选 qr-code-styling

- 原生支持圆点、圆角、渐变颜色等样式
- 支持中心 Logo 嵌入（自动计算白色缓冲区）
- 输出 Canvas / SVG / PNG
- 纯前端，无服务器依赖

### 3.3 为什么选 Vite + React

- Vite 启动极快，降低初学者本地开发体验门槛
- React 生态成熟，组件化思路适合这类交互复杂的工具
- TypeScript 帮助在项目变大时保持代码可维护性

---

## 4. 项目结构

```
qrcraft/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── QRPreview.tsx          # 二维码预览区域
│   │   ├── InputPanel.tsx         # 文本输入面板
│   │   ├── StylePanel.tsx         # 样式控制面板
│   │   │   ├── ColorPicker.tsx    # 颜色选择器
│   │   │   ├── DotStyleSelector.tsx  # 点阵样式
│   │   │   └── LogoUploader.tsx   # Logo 上传
│   │   └── DownloadButton.tsx     # 下载按钮
│   │   └── TemplateGallery.tsx    # 预设模板（第二版）
│   ├── hooks/
│   │   ├── useQRCode.ts           # QR 生成逻辑封装
│   │   └── useDownload.ts         # 下载逻辑
│   ├── types/
│   │   └── qr.types.ts            # TypeScript 类型定义
│   ├── utils/
│   │   └── qrHelpers.ts           # 工具函数
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── .github/
│   └── workflows/
│       └── deploy.yml             # 自动部署 GitHub Actions
├── .gitignore
├── README.md
├── PLANNING.md                    # 本文档
├── CHANGELOG.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 5. 开发阶段划分

### Phase 0 · 项目搭建（预计 0.5 天）✅ 已完成

- [x] 用 Vite 创建 React + TypeScript 项目
- [x] 配置 Tailwind CSS
- [x] 安装 qr-code-styling
- [ ] 创建 GitHub 仓库，推送初始代码
- [x] 配置 .gitignore、README.md
- [x] 验证：运行 npm run dev 能看到默认页面

---

### Phase 1 · MVP 核心功能（预计 2-3 天）

**目标：** 能生成并下载基础二维码

- [ ] 搭建整体页面布局（左侧控制 + 右侧预览）
- [ ] 实现文本/URL 输入框
- [ ] 接入 qr-code-styling，实时渲染二维码
- [ ] 实现前景色/背景色颜色选择器
- [ ] 实现纠错等级下拉选择
- [ ] 实现 PNG 下载功能
- [ ] 基础响应式布局

**验收标准：**
> 用户输入 `https://github.com`，调整颜色后，点击下载，得到正确可扫描的 PNG 二维码。

---

### Phase 2 · 样式定制（预计 2-3 天）

**目标：** 实现差异化的视觉自定义能力

- [ ] 点阵样式选择（圆 / 方 / 圆角）
- [ ] 定位符（缩眼）样式选择
- [ ] 中心 Logo 上传功能
- [ ] Logo 大小滑块
- [ ] SVG 格式下载
- [ ] 预设风格模板（至少 3 个）

**验收标准：**
> 用户上传公司 Logo，选择圆形点阵、蓝色渐变，下载的 SVG 二维码中心有 Logo，可被手机正确扫描。

---

### Phase 3 · 完善与发布（预计 1-2 天）

**目标：** 打磨体验，公开上线

- [ ] 添加复制二维码图片功能（Clipboard API）
- [ ] 加载 / 生成中的状态动画
- [ ] 空状态提示（当未输入内容时）
- [ ] 错误处理（图片格式不对、内容过长等）
- [ ] SEO 基础设置（页面标题、description）
- [ ] 配置 GitHub Actions 自动部署到 GitHub Pages
- [ ] 更新 README（含截图、使用说明、本地启动步骤）
- [ ] 打 v1.0.0 tag，发布 Release

---

## 6. 界面设计思路

### 6.1 整体布局

```
┌─────────────────────────────────────────────────────┐
│  🔲 QRCraft          [GitHub 链接]                   │  ← 顶部导航
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│  📝 内容输入         │   🔲 二维码预览              │
│  ──────────────────  │   ──────────────────         │
│  │ 输入文字/链接  │  │   │              │           │
│  ──────────────────  │   │   QR Code    │           │
│                      │   │              │           │
│  🎨 样式设置         │   ──────────────────         │
│  · 前景色 / 背景色   │                              │
│  · 点阵样式          │  [下载 PNG] [下载SVG]        │
│  · 缩眼样式          │  [复制图片]                  │
│  · Logo 上传         │                              │
│  · 纠错等级          │                              │
│                      │                              │
│  🖼 预设模板         │                              │
│  [极简] [彩色] [复古]│                              │
└──────────────────────┴──────────────────────────────┘
```

### 6.2 配色方案（建议）

- 背景：`#F8F7F4`（暖白）
- 主色：`#1A1A2E`（深海墨黑）
- 强调色：`#E63946`（活力红）或 `#457B9D`（复古蓝）
- 面板：白色卡片 + 轻微阴影

---

## 7. 核心功能技术实现

### 7.1 QR 生成核心代码思路

```typescript
// hooks/useQRCode.ts
import QRCodeStyling from 'qr-code-styling';

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  data: inputText,
  dotsOptions: {
    color: foregroundColor,
    type: dotStyle,          // 'rounded' | 'dots' | 'square'
  },
  backgroundOptions: {
    color: backgroundColor,
  },
  image: logoUrl,            // 中心 Logo
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 5,
    imageSize: logoSize,     // 0.3 ~ 0.5
  },
  cornersSquareOptions: {
    type: cornerStyle,       // 'extra-rounded' | 'dot' | 'square'
  },
  qrOptions: {
    errorCorrectionLevel: errorLevel,  // 'L'|'M'|'Q'|'H'
  },
});
```

### 7.2 Logo 嵌入注意事项

- 嵌入 Logo 会遮盖部分二维码，**必须将纠错等级设为 H**（30% 冗余）
- Logo 占比建议不超过二维码面积的 30%
- 上传的图片转成本地 ObjectURL，不会发送到服务器

### 7.3 下载实现

```typescript
// 下载 PNG
qrCode.download({ name: 'qrcraft', extension: 'png' });

// 下载 SVG
qrCode.download({ name: 'qrcraft', extension: 'svg' });
```

---

## 8. GitHub 仓库规范

### 8.1 分支策略

```
main          → 稳定版本，自动部署
└── dev       → 日常开发汇总
    ├── feat/style-panel     → 功能分支
    ├── feat/logo-upload
    └── fix/download-bug
```

### 8.2 Commit 消息格式（Conventional Commits）

```
feat: 添加圆形点阵样式选项
fix: 修复 Safari 下 SVG 下载失败问题
chore: 升级 qr-code-styling 到 1.6.x
docs: 更新 README 添加使用截图
style: 调整颜色选择器间距
refactor: 抽取 useDownload hook
```

### 8.3 Issue 标签

| 标签 | 用途 |
|---|---|
| `bug` | 功能异常 |
| `enhancement` | 新功能请求 |
| `good first issue` | 适合入门贡献 |
| `documentation` | 文档相关 |
| `phase-1 / phase-2` | 对应开发阶段 |

### 8.4 README 必须包含的内容

- [ ] 项目截图 / GIF 演示
- [ ] 一句话介绍
- [ ] 功能列表
- [ ] 在线体验链接（GitHub Pages）
- [ ] 本地启动步骤（`npm install` → `npm run dev`）
- [ ] 技术徽章
- [ ] License 声明

---

## 9. 测试策略

> 作为第一个项目，不需要追求 100% 测试覆盖率，重点放在**关键路径验证**。

### 9.1 手动测试清单（每次发布后）

- [ ] 输入普通文本 → 可生成并扫描
- [ ] 输入长 URL → 可生成并扫描
- [ ] 修改颜色 → 预览实时更新
- [ ] 上传 JPG Logo → 正确嵌入中心
- [ ] 上传 PNG 透明 Logo → 正确嵌入（无黑色背景）
- [ ] 点击下载 PNG → 文件正确保存
- [ ] 点击下载 SVG → 文件正确保存
- [ ] 在手机浏览器上测试响应式布局
- [ ] 用微信/相机扫描下载的二维码 → 内容正确

### 9.2 未来可加入（第二版后考虑）

- Vitest 单元测试（工具函数）
- Playwright E2E 测试（核心流程）

---

## 10. 部署方案

### 10.1 GitHub Pages（推荐首选）

**特点：** 免费、与 GitHub 仓库紧密集成、自动 HTTPS

**步骤：**
1. `vite.config.ts` 中设置 `base: '/仓库名/'`
2. 创建 `.github/workflows/deploy.yml`
3. 推送到 `main` 分支自动触发部署

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 10.2 Vercel（备选，更简单）

- 登录 vercel.com，导入 GitHub 仓库，一键部署
- 每次 push 自动生成预览链接
- 自定义域名支持

---

## 11. 未来扩展方向

> 这些功能**现在不做**，但设计时保留可能性

| 功能 | 技术分析 | 难度 |
|---|---|---|
| 批量生成（CSV 输入） | 纯前端可实现 | ⭐⭐ |
| 历史记录（localStorage） | 纯前端 | ⭐ |
| 渐变色二维码 | qr-code-styling 已支持 | ⭐⭐ |
| 艺术风格二维码（AI 生成背景） | 需要 AI API | ⭐⭐⭐⭐ |
| 动态二维码（扫码次数统计） | 需要后端 + 数据库 | ⭐⭐⭐⭐⭐ |

---

## 12. 参考资源

### 库文档
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) · 核心 QR 库
- [Vite 官方文档](https://vitejs.dev/)
- [React 官方文档](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 学习资源（适合第一个项目）
- [GitHub Actions 入门](https://docs.github.com/en/actions/quickstart)
- [Conventional Commits 规范](https://www.conventionalcommits.org/zh-hans/)
- [如何写一个好的 README](https://github.com/matiassingers/awesome-readme)

### 竞品参考
- [qr.io](https://qr.io) · 同类商业竞品
- [qr-code-styling demo](https://qr-code-styling.com/) · 功能演示

---

*本文档将随项目推进持续更新。每完成一个 Phase，在对应任务前打 ✅ 并补充遇到的问题和解决方案。*
