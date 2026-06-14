import { AlertTriangle, Droplets, ShieldCheck } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

import type { DepartureAdvice, RoutineRoute } from "@pets/shared";

import { ActionCard } from "../../components/home/ActionCard";
import { EvidenceStrip } from "../../components/home/EvidenceStrip";
import { FeedbackPanel } from "../../components/home/FeedbackPanel";
import { HomeTopBar } from "../../components/home/HomeTopBar";
import { PetStage } from "../../components/home/PetStage";
import { PrimaryRouteCard } from "../../components/home/PrimaryRouteCard";
import { RiskPanel } from "../../components/home/RiskPanel";
import type { FeedbackState, HomeNoticeKind } from "../../app/types";
import { styles } from "./HomeScreen.styles";

export function HomeScreen({
  activeRoute,
  advice,
  bottomPadding,
  routes,
  feedbackState,
  homeNotice,
  weatherLabel,
  onAskPress,
  onAssistantPress,
  onDismissNotice,
  onFeedback,
  onOpenMap,
  onRouteSwap,
  onStartAddPoi,
  verifiedPoiCount
}: {
  activeRoute: RoutineRoute;
  advice: DepartureAdvice;
  bottomPadding: number;
  routes: RoutineRoute[];
  feedbackState: FeedbackState;
  homeNotice: HomeNoticeKind | null;
  weatherLabel: string;
  onAskPress: () => void;
  onAssistantPress: () => void;
  onDismissNotice: () => void;
  onFeedback: (state: Exclude<FeedbackState, "idle">) => void;
  onOpenMap: () => void;
  onRouteSwap: () => void;
  onStartAddPoi: () => void;
  verifiedPoiCount: number;
}) {
  const bubbleText =
    feedbackState === "risk"
      ? "发现风险就先记下来，我下次会绕开。"
      : feedbackState === "smooth"
        ? "这条路线今天表现不错，可以继续保留。"
        : "今天热，先走阴影多、狗密度低的熟路。";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.homeScrollContent,
        { paddingBottom: bottomPadding }
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.homeScroll}
    >
      <View style={styles.heroBand}>
        <HomeTopBar
          onAskPress={onAskPress}
          onAssistantPress={onAssistantPress}
          verifiedPoiCount={verifiedPoiCount}
        />
        <PetStage
          bubbleText={bubbleText}
          route={activeRoute}
          weatherLabel={weatherLabel}
        />
      </View>

      <View style={styles.homeSheet}>
        <Text style={styles.decisionTitle}>
          今晚走{activeRoute.name}更稳
        </Text>
        <Text style={styles.decisionMeta}>
          {activeRoute.minutes} 分 · {activeRoute.distanceKm} km · 狗密度
          {activeRoute.dogDensity} · {verifiedPoiCount} 个可信 POI
        </Text>

        <EvidenceStrip
          route={activeRoute}
          verifiedPoiCount={verifiedPoiCount}
        />

        <PrimaryRouteCard
          routes={routes}
          onOpenMap={onOpenMap}
          onRouteSwap={onRouteSwap}
          route={activeRoute}
        />

        <View style={styles.actionList}>
          <ActionCard
            Icon={Droplets}
            accent="#5C6CF6"
            meta="2 天前已验证 · 建议停留不超过 5 分钟"
            onPress={onStartAddPoi}
            title="复查巷口水碗"
          />
          <ActionCard
            Icon={AlertTriangle}
            accent="#D86C4D"
            meta="北门草地待复查，反应犬今天不作为默认推荐"
            onPress={onOpenMap}
            title="避开待复查风险"
          />
          <ActionCard
            Icon={ShieldCheck}
            accent="#176B52"
            meta="顺利或有新风险，二选一就够"
            onPress={() => onFeedback("smooth")}
            title="走完反馈两件事"
          />
        </View>

        <RiskPanel alerts={advice.alerts} />

        <FeedbackPanel
          feedbackState={feedbackState}
          onDismissNotice={onDismissNotice}
          onFeedback={onFeedback}
          showReset={Boolean(homeNotice)}
        />
      </View>
    </ScrollView>
  );
}
