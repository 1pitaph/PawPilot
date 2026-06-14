# Nook

Nook 是一个安静的聊天式收集入口，用来快速保存想法、链接、图片、语音、文件和零散资料。它先把信息收进来，再让用户慢慢整理、摘要和归档。

当前仓库里的 Nook 是 `apps/nook-ios` 下的 iOS SwiftUI 原型，重点验证「空白画布 + 底部输入栏 + 轻量收集动作」的移动端体验。本项目与 Barnes & Noble NOOK 阅读器、Nook Earn App 等公开同名产品无关联。

## 项目状态

Nook 目前处于 `Prototype / 0.1.0` 阶段。代码用于交互验证，不代表完整生产应用。

- 平台：iOS / iPadOS
- 技术栈：SwiftUI、Observation、XcodeGen
- 数据状态：当前收集内容保存在本地内存中，尚未接入账号、同步或长期存储
- AI 状态：目前是收集原型，尚未接入真实摘要、归档或搜索模型

## 已实现原型

- 聊天式底部输入栏：输入内容后生成一条收集卡片。
- 快捷建议卡：`Collect an idea`、`Save a link`、`Make a list`、`Capture a file`。
- 多来源入口：Text、Link、Image、Voice、File。
- 收集卡片：展示标题、详情、来源和标签。
- 收集状态面板：查看条目数量、当前来源和输入状态。
- SwiftUI Preview：包含空状态和已有收集状态。

## 占位与下一步

当前已经预留但尚未接入真实能力：

- 图片选择器
- 文件导入
- 语音录制与转写
- 本地持久化
- 搜索、摘要、归档
- iCloud 或跨设备同步
- 中文本地化与可访问性完善

## 仓库结构

```text
apps/nook-ios/      Nook iOS SwiftUI 原型，当前主项目
apps/mobile/        早期爪边 / 宠物友好地图 Expo 原型
apps/web/           早期爪边宣传站
services/avatar-api 宠物分身生成 API 原型
packages/shared/    早期宠物地图共享类型、mock 数据与推荐逻辑
docs/               PRD、调研、Quarto 渲染文件和历史产品资料
```

## 运行 Nook iOS

### 环境要求

- Xcode 26.5 或更新版本
- XcodeGen

### 生成 Xcode 工程

```bash
xcodegen generate --spec apps/nook-ios/project.yml
```

### 打开工程

```bash
open apps/nook-ios/Nook.xcodeproj
```

### 命令行构建

```bash
xcodebuild -project apps/nook-ios/Nook.xcodeproj \
  -scheme Nook \
  -destination 'generic/platform=iOS Simulator' \
  build
```

### SwiftUI Preview

打开 `apps/nook-ios/Nook/Features/Collection/NookHomeView.swift`，可以查看：

- `Empty`：空画布与底部建议卡。
- `With captures`：已有收集条目的状态。

## Nook iOS 源码入口

| 路径 | 用途 |
| --- | --- |
| `apps/nook-ios/project.yml` | XcodeGen 项目配置 |
| `apps/nook-ios/Nook/App/NookApp.swift` | App 入口 |
| `apps/nook-ios/Nook/Features/Collection/NookHomeView.swift` | 首页、底部输入栏、建议卡、Sheet 与 Preview |
| `apps/nook-ios/Nook/Features/Collection/NookHomeModel.swift` | 收集状态、输入状态和交互逻辑 |
| `apps/nook-ios/Nook/Models/CollectionEntry.swift` | 收集条目与来源类型 |
| `apps/nook-ios/Nook/Models/NookSuggestion.swift` | 默认快捷建议 |
| `apps/nook-ios/Nook/Design/NookTheme.swift` | 颜色、阴影和界面基础样式 |

## 相关历史资料

这个仓库早期围绕“爪边 / 宠物友好地图 Agent”展开，相关 PRD 和原型仍保留在仓库中：

- `docs/prd-pet-mobility-agent.md`：宠物友好地图 Agent PRD 源文档。
- `docs/prd-pet-mobility-agent.qmd`：Quarto 展示包装，正文通过 include 引入 Markdown。
- `apps/mobile`、`apps/web`、`services/avatar-api`：早期宠物地图与宠物分身原型。

生成物 `docs/prd-pet-mobility-agent.html` 不应手工编辑，需要从 `.qmd` 重新渲染。

## 贡献说明

- 修改 Nook target、目录结构或资源配置时，请同步更新 `apps/nook-ios/project.yml` 并重新生成 Xcode 工程。
- 提交 PR 时请说明改动范围、验证命令，以及必要的截图或录屏。
- 适合优先推进的方向包括真实图片/文件导入、语音转写、本地持久化、空状态体验、可访问性、中文文案和 Preview 覆盖。
