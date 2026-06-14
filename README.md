# 爪边 App Monorepo

这是爪边 / 宠物友好地图 Agent 的 React Native monorepo 框架。产品内容以 `docs/prd-pet-mobility-agent.md` 为准，移动端当前实现 P0 闭环的可运行壳：

- 宠物档案
- 常走路线卡
- 出门 Agent 建议
- POI 与风险信号
- 走后轻反馈入口

## 结构

```text
apps/mobile          Expo React Native app
packages/shared      共享类型、mock 数据与推荐逻辑
docs/                PRD 与 Quarto 渲染文件
```

## 运行

```bash
npm install
npm run mobile:ios
```

`npm run mobile:ios` 会启动 Expo dev server，并尝试把 app 打开到当前 iOS 模拟器。
