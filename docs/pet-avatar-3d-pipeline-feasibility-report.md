# 拍照到 Q 版宠物再到绑定骨骼 3D 模型链路可行性报告

日期：2026-06-14  
范围：宠物照片上传、`gpt-image-2` / image2 生成 Q 版形象、Tripo 生成 3D 模型、骨骼绑定、移动端展示与降级方案。  
结论级别：可做 P0，但必须把“骨骼绑定”设计成异步可选阶段，不能把它当作单次 image-to-3D 的稳定输出承诺。

## 1. 执行摘要

这条链路总体可行，适合进入工程验证和 P0 MVP。最稳的产品化路径不是“一张照片直接生成可动画 3D 宠物”，而是拆成可回退的多阶段工作流：

```text
宠物照片
-> 上传与质量检查
-> Q 版 2D 候选生成
-> 用户选择主设定图
-> 多视角参考图
-> Tripo image/multiview-to-model
-> 下载并转存 GLB/缩略图
-> 自动 QA
-> Tripo pre-rig check
-> animate_rig 绑定骨骼
-> 可选 retarget 动画
-> 移动端 GLB 展示，失败时降级 2D
```

推荐 P0 定义：

- 必须交付：用户上传照片、生成 4 张左右 Q 版候选、选择主设定图、异步生成静态 GLB、移动端可预览。
- 应该尝试：Tripo `animate_prerigcheck` 与 `animate_rig` 输出 rigged `GLB`。
- 不应承诺：所有宠物都能稳定四足绑定、尾巴/耳朵自然动、内置完整动作库。
- 失败兜底：3D 或 rig 失败时，使用 2D 头像、多视角卡片、静态 GLB turntable 或轻量 idle。

技术判断：

| 环节 | 可行性 | 主要判断 |
| --- | --- | --- |
| 拍照/上传 | 高 | 当前移动端还缺拍照依赖，但工程常规；参考后端已有 COS 上传模式。 |
| 宠物照片 -> Q 版 2D | 高 | `gpt-image-2` 支持生成和编辑；参考后端已有 APIMart `gpt-image-2` 配置与任务轮询，但需补图生图入参。 |
| Q 版图 -> 3D | 中高 | Tripo 支持单图和多视角 3D；P1 适合低面数移动端资产，H3/v3.1 适合高保真对比。 |
| 3D -> 骨骼绑定 | 中 | Tripo 有 `animate_prerigcheck` 和 `animate_rig`，但 Q 版宠物自动 rig 有形变与失败风险。 |
| 移动端展示 | 中 | GLB 展示可行，但当前 Expo 依赖未包含 3D runtime；需 Development Build 验证。 |

## 2. 本次调研方式

本次使用 3 个子 agent 并行研究：

- 子 agent A：OpenAI `gpt-image-2` / image2 用于宠物照片到 Q 版图。
- 子 agent B：Tripo OpenAPI 的 image-to-3D、multiview-to-3D、rig、retarget、价格和限制。
- 子 agent C：结合当前仓库和参考后端，提出端到端架构、接口、数据表和 MVP 工作量。

主线程同时检查了当前仓库和参考后端：

- 当前仓库：`/Users/1pitaph/dev/pets`
- 参考后端：`/Users/1pitaph/Documents/1pitaph/work/aoya-agent/aoya-agent`

本报告只记录配置位置和变量名，不记录或复述任何密钥值。

## 3. 当前代码与参考后端现状

### 3.1 当前仓库

当前仓库已经有移动端和 Web 壳：

- `apps/mobile`：React Native + Expo，已有地图、POI、宠物档案、分身占位图。
- `apps/web`：Next.js 网站。
- `packages/shared`：共享 demo 数据与推荐逻辑。
- `docs/prd-pet-mobility-agent.md`：PRD 已经包含“宠物分身与状态表达”“生成链路”“3D 资产与骨骼绑定”章节。

当前缺口：

- 没有后端服务。
- 没有拍照/相册上传依赖。
- 没有 3D 预览 runtime。
- 没有持久化任务表、资产表、QA 表。
- 现有移动端分身是静态 PNG 占位，不具备生成任务入口。

### 3.2 参考后端可复用点

参考后端已经有大量可借鉴结构：

| 能力 | 参考文件 | 可迁移价值 |
| --- | --- | --- |
| COS 上传 | `app/upload/handler.go`、`infra/cos/client.go` | 宠物原图、Q 版图、GLB、缩略图都应转存对象存储。 |
| APIMart `gpt-image-2` | `app/inspiration/service/gpt_image2.go`、`configs/app.yaml` | 已有任务提交、轮询、超时、重试模式。 |
| Agent 工具版 GPT Image | `tool/builtin/gpt_image_gen.go` | 已有 `gpt_image_generation` 工具、参考图数组、积分预检、事件心跳。 |
| Tripo 静态 3D 工具 | `tool/builtin/tripo_3d.go` | 已支持 `image`、`text`、`multiview` 三种静态 3D 生成模式。 |
| 积分预检 | `infra/credit/mapper.go`、`domain/credit.go` | 可把 Avatar 任务拆成确定性计费任务。 |
| 工具元数据 | `app/server/agents.go`、`app/agent/tool_sync.go` | 可参考工具注册与 billable 管理，但 Avatar 不宜直接走聊天 Agent 工具。 |

参考后端里已经出现的配置变量名：

| 配置 | 变量名/位置 | 说明 |
| --- | --- | --- |
| APIMart image2 | `gpt_image_2.api_key: ${APIMART_API_KEY}` | 当前用于 APIMart `gpt-image-2`。 |
| APIMart base URL | `gpt_image_2.base_url` | 默认 `https://api.apimart.ai/v1`。 |
| COS | `COS_SECRET_ID`、`COS_SECRET_KEY` | 对象存储上传与下载。 |
| Ultron 网关 | `cfg.Ultron.BaseURL` + 请求上下文 `Authorization` | 参考后端 Tripo/GPT Image 工具走内部网关而非直接 Tripo key。 |

如果新服务直接接 Tripo 官方 OpenAPI，还需要新增：

```text
TRIPO_API_KEY
TRIPO_BASE_URL=https://api.tripo3d.ai
TRIPO_MODEL_VERSION=P1-20260311
TRIPO_RIG_VERSION=v2.5-20260210
```

## 4. 图片生成可行性：宠物照片到 Q 版形象

### 4.1 推荐模型与接口

用户口中的 `image2` 建议在工程里正式写为 `gpt-image-2`。可选路径有两条：

1. 直接接 OpenAI Images API。
   - 使用 `images.edit` 做“参考宠物照片 -> Q 版形象”。
   - 使用 `images.generate` 做无参考补充图。
   - 输出通常要自行转存到对象存储。

2. 复用参考后端 APIMart `gpt-image-2`。
   - 参考后端已有 `POST /v1/images/generations -> GET /v1/tasks/{task_id}` 的任务式封装。
   - APIMart 文档支持 `image_urls` 做图生图，参考后端当前 `GptImage2Service.Generate` 只传了 prompt、size、resolution，需要扩展 `image_urls` 入参。
   - 这个路径更贴近当前“相关 key 参考后端”的要求。

建议 P0 用参考后端同类配置方式，但新建产品化 Avatar service，不直接复用聊天 Agent 的工具调用。

### 4.2 推荐生成策略

Q 版图的目标不是“艺术风格越强越好”，而是让后续 3D 和 rig 更稳。提示词应约束主体完整、特征保真、轮廓干净：

```text
基于参考宠物照片生成一个 Q版/chibi 宠物角色形象。
必须保留：宠物种类、毛色、脸部花纹、耳朵形状、尾巴特征、独特斑点/项圈。
风格：大头小身体、圆润可爱、玩具/吉祥物质感、全身站姿、正面 3/4 视角。
输出：单只宠物，居中，完整身体，不裁切，无文字、无水印、无复杂背景、无额外动物或人物。
```

用于 3D 的图要额外要求：

- 白底或透明底。
- 全身无遮挡。
- 避免衣服、牵引绳、玩具遮挡四肢。
- 避免强阴影和复杂毛发边缘。
- 生成正面、左侧、背面、右侧多视角时，必须标注侧面和背面可能是模型推测。

### 4.3 候选数量与用户选择

建议 P0 默认生成 4 张 Q 版候选：

- 2 张偏“像真实宠物”。
- 1 张偏“更 Q、更圆润”。
- 1 张偏“3D 友好、四肢更清晰”。

用户选择主设定图后再进入 3D。不要自动把所有候选都送 Tripo，否则成本、排队和失败率都会放大。

## 5. Tripo 3D 与骨骼绑定可行性

### 5.1 Tripo 官方任务链

Tripo 官方 OpenAPI 的通用模式是：

```text
POST /v2/openapi/task
-> 返回 task_id
-> GET /v2/openapi/task/{task_id}
-> status = queued | running | success | failed | banned | expired | cancelled | unknown
-> 读取 data.output
```

Tripo 支持：

- `image_to_model`：单图生成 3D。
- `multiview_to_model`：前、左、后、右多视角生成 3D。
- `generate_multiview_image`：单张输入补多视角。
- `animate_prerigcheck`：判断模型是否可绑定，并返回可能的 rig 类型。
- `animate_rig`：绑定骨骼，输出 `glb` 或 `fbx`。
- `animate_retarget`：把预设动画 retarget 到已 rig 模型。
- `convert_model`：格式转换，如 GLTF、USDZ、FBX、OBJ 等。

关键结论：

- `image_to_model` 和 `multiview_to_model` 不会一步直接输出 rigged 模型。
- Rig 必须作为后处理任务执行。
- 对宠物应尝试 `rig_type: "quadruped"`。
- Rig 输出建议先用 `GLB`，调试时再用 `FBX`。

### 5.2 推荐参数

移动端 P0 推荐优先试：

```json
{
  "type": "multiview_to_model",
  "model_version": "P1-20260311",
  "texture": true,
  "pbr": true,
  "face_limit": 8000,
  "texture_quality": "standard",
  "texture_alignment": "geometry",
  "orientation": "align_image",
  "compress": "geometry"
}
```

如果 P1 对 Q 版毛发或表情保真不足，再对比：

```json
{
  "type": "image_to_model",
  "model_version": "v3.1-20260211",
  "texture": true,
  "pbr": true,
  "texture_quality": "standard",
  "geometry_quality": "standard"
}
```

Rig 阶段：

```json
{
  "type": "animate_prerigcheck",
  "original_model_task_id": "<model_task_id>"
}
```

```json
{
  "type": "animate_rig",
  "original_model_task_id": "<model_task_id>",
  "model_version": "v2.5-20260210",
  "rig_type": "quadruped",
  "spec": "tripo",
  "out_format": "glb"
}
```

可选动画：

```json
{
  "type": "animate_retarget",
  "original_model_task_id": "<rig_task_id>",
  "out_format": "glb",
  "animation": "preset:quadruped:walk",
  "animate_in_place": true,
  "bake_animation": true
}
```

### 5.3 格式建议

| 场景 | 格式 | 说明 |
| --- | --- | --- |
| 移动端运行时 | `GLB` | 最适合保存骨骼、贴图、动画和单文件分发。 |
| 调试/美术检查 | `FBX` | 方便 Blender、Unity 等工具检查骨骼和蒙皮。 |
| iOS AR Quick Look | `USDZ` | 可做 AR 预览，但 rig/动画保真要实测。 |
| 静态几何导出 | `OBJ` / `STL` / `3MF` | 不适合 rigged 宠物，会丢骨骼或只保几何。 |

最终资产必须从 Tripo 临时 URL 下载并转存 COS。Tripo 任务结果里的下载 URL 可能只有短时间有效，不能让移动端长期依赖供应商 URL。

## 6. 产品化后端架构建议

### 6.1 为什么不能只复用 Agent 工具

参考后端的 `gpt_image_generation` 和 `tripo_3d` 是给聊天 Agent 调用的工具，适合“对话中生成一次结果”。宠物分身链路更像产品级工作流，有这些额外要求：

- 用户可能断线、杀 App、第二天回来继续看进度。
- 同一个宠物要长期绑定一个默认 avatar。
- 每个阶段都需要重试、审计、成本归因、删除和隐私处理。
- 外部 URL 必须及时下载归档。
- 需要在用户选择 Q 版候选后再进入 3D。

因此建议新建 `AvatarPipeline` 服务，复用参考后端的配置、上传、COS、积分、轮询模式，但任务状态和资产要独立持久化。

### 6.2 服务模块

```text
apps/mobile
-> services/api 或 Go BFF
-> upload/COS
-> avatar pipeline
   -> photo quality check
   -> Q image generation
   -> multiview generation
   -> Tripo model generation
   -> asset download and COS archive
   -> QA
   -> pre-rig check
   -> rig / retarget
-> mobile preview and fallback
```

### 6.3 接口草案

| 接口 | 用途 |
| --- | --- |
| `POST /agent-api/v1/upload` | 上传宠物照片，返回 `fileId`、`cosUrl`。 |
| `POST /agent-api/v1/pets/:petId/avatar/jobs` | 创建生成任务。 |
| `GET /agent-api/v1/avatar/jobs/:jobId` | 查询任务状态、阶段、进度、错误、资产列表。 |
| `GET /agent-api/v1/avatar/jobs/:jobId/events` | SSE 订阅阶段事件。 |
| `DELETE /agent-api/v1/avatar/jobs/:jobId` | 取消未完成任务。 |
| `POST /agent-api/v1/avatar/jobs/:jobId/select-q` | 用户选择 Q 版候选，并触发 3D 阶段。 |
| `POST /agent-api/v1/avatar/jobs/:jobId/retry` | 从失败阶段重试。 |
| `GET /agent-api/v1/pets/:petId/avatar` | 获取当前宠物默认分身。 |
| `PATCH /agent-api/v1/pets/:petId/avatar` | 设置默认头像、默认模型、展示模式。 |
| `DELETE /agent-api/v1/pets/:petId/avatar/:avatarId` | 删除分身与资产引用。 |

创建任务入参示例：

```json
{
  "sourceFileIds": ["file_front"],
  "photoRoles": ["front"],
  "candidateCount": 4,
  "mode": "q_to_3d",
  "geometryQuality": "standard",
  "tryRig": true,
  "idempotencyKey": "pet-123-avatar-20260614-001"
}
```

### 6.4 数据表草案

| 表 | 核心字段 |
| --- | --- |
| `pet_photos` | `id,user_id,pet_id,upload_file_id,cos_url,cos_key,sha256,mime,width,height,photo_role,quality_json,subject_bbox_json,status` |
| `pet_avatars` | `id,user_id,pet_id,status,selected_q_asset_id,selected_model_asset_id,current_job_id,display_mode,created_at,deleted_at` |
| `avatar_generation_jobs` | `id,user_id,pet_id,avatar_id,idempotency_key,pipeline_version,status,stage,progress,estimated_seconds,timeout_seconds,error_code,error_message,retry_count,cost_snapshot_json` |
| `avatar_job_events` | `id,job_id,seq,event_type,payload_json,created_at` |
| `avatar_assets` | `id,user_id,pet_id,avatar_id,job_id,kind,cos_url,cos_key,provider,provider_task_id,provider_url,sha256,mime,size_bytes,width,height,triangle_count,status,metadata_json` |
| `avatar_quality_reports` | `id,job_id,asset_id,checks_json,passed,score,error_message,created_at` |
| `avatar_rigs` | `id,model_asset_id,rig_asset_id,status,skeleton_type,animation_clips_json,provider,error_message,created_at` |

### 6.5 任务阶段

```text
created
photo_uploaded
quality_checking
quality_failed
q_generating
q_ready
waiting_user_selection
multiview_generating
tripo_submitting
tripo_processing
model_downloading
model_archived
qa_running
qa_failed
prerig_checking
rigging_skipped
rigging_running
rig_ready
retarget_running
ready_2d
ready_3d
ready_rigged
ready_degraded
failed
canceled
```

## 7. 移动端实现建议

当前 `apps/mobile` 需要补：

| 能力 | 建议 |
| --- | --- |
| 拍照/相册 | Expo Development Build 中接 `expo-camera`、`expo-image-picker`。 |
| 上传 | 统一走后端 `POST /upload`，后端转 COS，移动端不直接拿云密钥。 |
| 任务进度 | 先支持轮询 `GET /avatar/jobs/:jobId`，再加 SSE；移动端后台恢复时靠 DB 状态续上。 |
| Q 版候选 | 网格选择，允许重生成一次；选择后锁定进入 3D。 |
| 3D 预览 | P0 可用 WebView + Three.js 或 React Native GL 方案；需要真机验证 GLB、贴图、动画和内存。 |
| 缓存 | GLB、缩略图、Q 图都做本地缓存；低端机默认 2D。 |
| 降级 | `ready_2d`、`ready_degraded` 都应是成功态，不要让用户感到任务失败。 |

渲染目标：

- GLB 文件目标小于 10-12MB。
- 首屏先显示 Q 版 PNG，再懒加载 3D。
- 低端机或地图交互时用 2D，详情页再加载 3D。
- 动画只在非关键页面播放，避免影响地图帧率。

## 8. 成本与延迟估算

### 8.1 OpenAI / APIMart 图片阶段

官方 OpenAI 文档显示 `gpt-image-2` 支持更多尺寸和基于 token 的计费；同等 1024 方图低/中/高质量示例价格大致为低质量约 $0.006、中质量约 $0.053、高质量约 $0.211。实际成本还要加输入文本和参考图片 token。

APIMart `gpt-image-2` 文档显示：

- 任务式提交，返回 `task_id`。
- 需要轮询 `/v1/tasks/{task_id}`。
- 单图通常 30-60 秒，但排队可能更久。
- 失败和审核拒绝不扣费。
- 返回 URL 仍建议尽快转存自有 CDN/COS。

P0 建议：

- 打样候选用 `1k` 或中等质量。
- 用户选中主设定后，3D 参考图可升到 `2k`。
- 每个用户默认限制生成次数，避免成本失控。

### 8.2 Tripo 阶段

Tripo 官方价格按 credits：

| 任务 | 参考 credits |
| --- | --- |
| `generate_multiview_image` | 10 |
| P1 `image_to_model` / `multiview_to_model` 无贴图 | 40 |
| P1 `image_to_model` / `multiview_to_model` 带贴图 | 50 |
| 非 P1 `image_to_model` / `multiview_to_model` 无贴图 | 20 |
| 非 P1 `image_to_model` / `multiview_to_model` 带贴图 | 30 |
| `animate_prerigcheck` | 免费 |
| `animate_rig` | 25 |
| `animate_retarget` | 10 / 动画 |
| `convert_model` | 5 起 |

P0 单次成功资产大致由：

```text
Q 版图生成
+ 多视角图生成
+ 3D 模型生成
+ rig 检查
+ 可选 rig
+ 下载、转存、QA
+ 失败重试系数
```

建议预算口径：

- 只做 2D Q 版：低。
- 2D + 静态 3D：中。
- 2D + 静态 3D + rig：中高，且失败率不确定。
- 对外展示报价或积分前，先做 30-50 个真实宠物样本的成本统计。

## 9. 风险与缓解

| 风险 | 等级 | 缓解 |
| --- | --- | --- |
| Q 版图不像真实宠物 | 中 | 多候选、用户选择、保留关键特征提示词、允许重新生成。 |
| 多视角背面/侧面幻觉 | 中 | 引导补拍正侧背；缺失时标注推测；用户确认后再 3D。 |
| Tripo 静态模型四肢/尾巴不完整 | 中高 | 输入图全身无遮挡；多视角优先；自动 QA；失败降级 2D。 |
| Rig 失败或蒙皮变形 | 高 | `animate_prerigcheck` 前置；P0 不承诺完整动画；成功再启用 rig 展示。 |
| 外部 URL 过期 | 高 | 后端立即下载并转存 COS；资产表记录 COS key。 |
| 生成成本失控 | 中高 | idempotency key、同宠物并发锁、积分预检、阶段重试上限。 |
| 移动端性能不足 | 中 | GLB 压缩、面数限制、低端机默认 2D、详情页懒加载 3D。 |
| 用户隐私 | 高 | 不公开原图；照片删除；人脸、门牌、项圈电话脱敏；最小化存储。 |
| 商用与版权 | 中 | 禁止生成像已有 IP 的宠物角色；付费 Tripo 账户确认商用条款；记录输入来源和用户授权。 |
| 网关选择混乱 | 中 | 明确“直连 OpenAI/Tripo”和“走参考后端 Ultron/APIMart”两套配置，不混用密钥。 |

## 10. MVP 工作量

| 范围 | 估算 |
| --- | --- |
| 2D Q 版头像：上传、质量检查、4 个候选、用户选择、COS 存储 | 8-12 人日 |
| 静态 3D：Tripo image/multiview、COS 转存、状态查询、移动端预览 | 8-12 人日 |
| 基础 QA：文件大小、缩略图、metadata、失败降级 | 3-5 人日 |
| 移动端：拍照/相册、进度页、候选选择、2D/3D 预览、缓存 | 6-10 人日 |
| Rig 实验：pre-rig check、animate_rig、rigged GLB 展示 | 4-8 人日 |

单人全栈约 3-5 周；两人并行可压到 2-3 周。建议先做 2D + 静态 3D 闭环，再用真实样本评估 rig 成功率。

## 11. 推荐实施路线

### P0.1：2D 闭环

- 接拍照/相册上传。
- 后端上传 COS。
- 扩展或新写 `gpt-image-2` 图生图服务。
- 生成 4 个 Q 版候选。
- 用户选择主设定图。
- 保存 `PetAvatar` 与 `avatar_assets`。

验收：

- 95% 以上宠物照片能在 60-120 秒内得到候选。
- 用户能选择并回到宠物档案页看到新头像。
- 所有供应商 URL 已转存 COS。

### P0.2：静态 3D 闭环

- 根据主设定图生成多视角。
- 提交 Tripo `image_to_model` / `multiview_to_model`。
- 下载 GLB 与 preview，转存 COS。
- 移动端加载静态 GLB 或 turntable。
- 失败降级 2D。

验收：

- GLB 能在 iOS/Android 至少一类设备稳定预览。
- 文件大小、面数、贴图基本可控。
- 用户可继续使用地图，不被 3D 任务阻塞。

### P0.3：Rig 实验

- 对静态 3D 模型执行 `animate_prerigcheck`。
- `riggable=true` 时尝试 `animate_rig`。
- 成功则展示 rigged GLB；失败保留静态 GLB。
- 对少量样本测试 `preset:quadruped:walk` 或 idle。

验收：

- 不把 rig 失败视为用户任务失败。
- 能统计 rig 成功率、失败原因、形变评分。
- 成功样本能在移动端播放至少 1 个动作。

### P1：产品化动画

- 专门做四足 QA。
- 建立猫/狗体型分类。
- 建立 idle/walk/sit/sniff/pant 等动作映射。
- 引入 glTF Transform、KTX2、LOD、USDZ 转码。
- 对低端机做 2D/3D 自动切换。

## 12. 最终判断

建议立项实现，但验收口径要克制：

```text
P0 成功 = 用户能从照片得到可信 Q 版头像，并异步得到可预览的静态 3D 分身。
P0 加分 = 部分样本能通过 Tripo rig，展示轻动作。
P0 不承诺 = 每只宠物都能稳定四足骨骼绑定和自然动画。
```

最关键的工程动作不是调用某一个模型，而是建立可恢复、可回放、可降级的生成流水线。这样即使 Tripo rig 或多视角质量波动，产品仍然能交付稳定的宠物分身体验。

## 13. 参考来源

- OpenAI Image generation guide: <https://developers.openai.com/api/docs/guides/image-generation>
- OpenAI Images API reference: <https://developers.openai.com/api/reference/resources/images>
- OpenAI Pricing: <https://developers.openai.com/api/docs/pricing>
- OpenAI Usage Policies: <https://openai.com/policies/usage-policies/>
- APIMart GPT-Image-2 generation: <https://docs.apimart.ai/cn/api-reference/images/gpt-image-2/generation>
- Tripo Quick Start: <https://docs.tripo3d.ai/get-started/quick-start.html>
- Tripo Image to Model P1: <https://docs.tripo3d.ai/model-generation/image-to-model-p1-20260311.html>
- Tripo Image to Model H3: <https://docs.tripo3d.ai/model-generation/image-to-model-v3-0-v3-1.html>
- Tripo Multiview to Model P1: <https://docs.tripo3d.ai/model-generation/multiview-to-model-p1-20260311.html>
- Tripo Pre Rig Check: <https://docs.tripo3d.ai/animation/pre-rig-check-v2-0-20250506.html>
- Tripo Rig v2.5: <https://docs.tripo3d.ai/animation/rig-v2-5-20260210.html>
- Tripo Retarget: <https://docs.tripo3d.ai/animation/retarget.html>
- Tripo Conversion: <https://docs.tripo3d.ai/export/conversion.html>
- Tripo Pricing: <https://docs.tripo3d.ai/get-started/pricing.html>
- Tripo Rate Limits: <https://docs.tripo3d.ai/get-started/rate-limits.html>
- Tripo Changelog: <https://docs.tripo3d.ai/get-started/changelog.html>
- 本地参考后端：`/Users/1pitaph/Documents/1pitaph/work/aoya-agent/aoya-agent`
- 当前 PRD：`docs/prd-pet-mobility-agent.md`
