# Changelog

所有版本的变更记录。格式遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)。

---

## [Unreleased] · 开发中

### Phase 3 待完成
- [ ] 复制二维码到剪贴板（Clipboard API）
- [ ] 生成中的加载动画
- [ ] 空状态提示（未输入内容时）
- [ ] 错误处理（图片格式不对、内容过长等）
- [ ] SEO 基础设置（页面标题、meta description）
- [ ] GitHub Actions 自动部署到 GitHub Pages
- [ ] 更新 README 截图
- [ ] 发布 v1.0.0

---

## [0.2.0] · 2026-04-27 · Phase 2 样式定制

### feat
- 新增点阵样式选择：方形 / 圆角 / 圆点
- 新增定位符（缩眼）样式选择：方角 / 圆角 / 圆点
- 新增中心 Logo 上传功能（本地图片，不上传服务器）
- 新增 Logo 大小滑块（20%–40%）
- 上传 Logo 时自动切换纠错等级至 H
- 新增预设模板：极简 / 复古蓝 / 霓虹
- 新增文字标签功能：可在二维码上下左右添加自定义文字
  - 每个位置独立配置字体、字号、颜色
  - 支持换行
  - 左右标签为竖排显示（从上到下）
  - 下载 PNG 时自动将标签合成进图片

### feat
- 新增深色模式切换按钮（右上角）
- 深色模式完全独立于系统设置，手动控制

---

## [0.1.0] · 2026-04-27 · Phase 1 MVP

### feat
- 搭建整体页面布局（左侧控制面板 + 右侧二维码预览）
- 实现文本 / URL 输入框，实时生成二维码
- 接入 qr-code-styling 库
- 实现前景色 / 背景色颜色选择器
- 实现纠错等级下拉选择（L / M / Q / H）
- 实现 PNG 下载功能
- 实现 SVG 下载功能

---

## [0.0.1] · 2026-04-27 · Phase 0 项目搭建

### chore
- 使用 Vite 创建 React 19 + TypeScript 项目
- 配置 Tailwind CSS 3（class-based dark mode）
- 安装 qr-code-styling 1.9
- 初始化 .gitignore、README.md、PLANNING.md
