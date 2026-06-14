# 爪边 App Monorepo

这是爪边 / 宠物友好地图 Agent 的 React Native monorepo 框架。产品内容以 `docs/prd-pet-mobility-agent.md` 为准，移动端当前实现 P0 闭环的可运行壳：

- 宠物档案
- 常走路线卡
- 出门 Agent 建议
- POI 与风险信号
- 走后轻反馈入口
- 拍照到 Q 版宠物、Tripo 3D、骨骼绑定的 Avatar Pipeline 接入壳

## 结构

```text
apps/mobile          Expo React Native app
apps/web             Next.js 宣传 web
services/avatar-api  Avatar Pipeline API，封装 GPT-Image-2/APIMart 与 Tripo
packages/shared      共享类型、mock 数据与推荐逻辑
docs/                PRD 与 Quarto 渲染文件
```

## 运行

```bash
pnpm install
pnpm avatar:build
pnpm avatar:start
pnpm mobile:ios
pnpm web:dev
```

`pnpm avatar:start` 默认监听 `http://127.0.0.1:4317`。没有配置 key 时会自动使用 mock provider，宠物档案页仍可跑通任务状态、候选图、3D 资产和骨骼绑定结果。接真实链路时复制 `.env.example`，填入 `APIMART_API_KEY` 与 `TRIPO_API_KEY`，并保持 `AVATAR_PROVIDER_MODE=auto` 或切到 `real`。

`pnpm mobile:ios` 会启动 Expo dev server，并尝试把 app 打开到当前 iOS 模拟器。
`pnpm web:dev` 会启动爪边宣传站，默认访问 `http://127.0.0.1:3000`。
