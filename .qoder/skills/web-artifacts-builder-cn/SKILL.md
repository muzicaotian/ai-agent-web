---
name: web-artifacts-builder-cn
description: 用于创建复杂、多组件 claude.ai HTML artifacts 的工具套件，使用现代前端技术（React、Tailwind CSS、shadcn/ui）。适用于需要状态管理、路由或 shadcn/ui 组件的复杂 artifacts，不适用于简单的单文件 HTML/JSX artifacts。
license: 完整条款见 LICENSE.txt
---

# Web Artifacts 构建器

构建强大的前端 claude.ai artifacts，请按以下步骤操作：

1. 使用 `scripts/init-artifact.sh` 初始化前端项目
2. 编辑生成的代码来开发你的 artifact
3. 使用 `scripts/bundle-artifact.sh` 将所有代码打包成单个 HTML 文件
4. 向用户展示 artifact
5. （可选）测试 artifact

**技术栈**: React 18 + TypeScript + Vite + Parcel（打包）+ Tailwind CSS + shadcn/ui

## 设计与样式指南

**非常重要**: 为避免所谓的"AI 生成感"，请避免使用过多的居中布局、紫色渐变、统一的圆角以及 Inter 字体。

## 快速开始

### 第一步：初始化项目

运行初始化脚本创建一个新的 React 项目：
```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

这会创建一个完整配置的项目，包含：
- ✅ React + TypeScript（通过 Vite）
- ✅ Tailwind CSS 3.4.1 配合 shadcn/ui 主题系统
- ✅ 路径别名（`@/`）已配置
- ✅ 40+ shadcn/ui 组件已预装
- ✅ 所有 Radix UI 依赖已包含
- ✅ Parcel 打包配置（通过 .parcelrc）
- ✅ Node 18+ 兼容（自动检测并锁定 Vite 版本）

### 第二步：开发你的 Artifact

编辑生成的文件来构建 artifact。参见下方 **常见开发任务** 获取指导。

### 第三步：打包成单个 HTML 文件

将 React 应用打包成单个 HTML artifact：
```bash
bash scripts/bundle-artifact.sh
```

这会创建 `bundle.html` —— 一个自包含的 artifact，所有 JavaScript、CSS 和依赖都已内联。此文件可以直接在 Claude 对话中作为 artifact 分享。

**要求**: 项目根目录必须有 `index.html` 文件。

**脚本执行内容**:
- 安装打包依赖（parcel, @parcel/config-default, parcel-resolver-tspaths, html-inline）
- 创建 `.parcelrc` 配置，支持路径别名
- 使用 Parcel 构建（无 source maps）
- 使用 html-inline 将所有资源内联到单个 HTML

### 第四步：向用户分享 Artifact

最后，在对话中向用户分享打包好的 HTML 文件，让他们可以作为 artifact 查看。

### 第五步：测试/预览 Artifact（可选）

注意：这是完全可选的步骤。仅在必要时或用户要求时执行。

要测试/预览 artifact，可使用可用的工具（包括其他 Skills 或内置工具如 Playwright 或 Puppeteer）。通常情况下，避免预先测试 artifact，因为这会增加请求和最终 artifact 展示之间的延迟。如有需要或出现问题，可在展示 artifact 后再进行测试。

## 参考资料

- **shadcn/ui 组件文档**: https://ui.shadcn.com/docs/components
