import type { HomeNoticeKind } from "./types";

export const noticeCopy: Record<
  HomeNoticeKind,
  { title: string; text: string }
> = {
  ask: {
    title: "问爪边已就绪",
    text: "现在先用演示数据回答：今晚优先走阴影多、狗密度低的常走路线。"
  },
  assistant: {
    title: "宠物分身会解释原因",
    text: "它只表达真实信号：天气、路线强度、遇狗概率和 POI 可信度。"
  },
  routeSwapped: {
    title: "已切换备选路线",
    text: "地图页会跟随当前路线，方便你对比风险点和附近 POI。"
  },
  feedbackSmooth: {
    title: "已记录：这次顺利",
    text: "下一次推荐会继续提高这条熟悉路线的权重。"
  },
  feedbackRisk: {
    title: "已记录：发现新风险",
    text: "建议打开地图添加风险点，让它先作为私人待验证信号参与判断。"
  },
  addMode: {
    title: "进入地图添加模式",
    text: "在地图上点一下位置，就能保存私人 POI 或风险点。"
  }
};
