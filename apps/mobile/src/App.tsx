import { StatusBar } from "expo-status-bar";
import {
  AlertTriangle,
  ChevronRight,
  CloudSun,
  Droplets,
  Home,
  Map,
  MapPin,
  MessageCircle,
  PawPrint,
  Plus,
  RefreshCw,
  Route,
  Search,
  ShieldCheck,
  UserRound,
  type LucideIcon
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets
} from "react-native-safe-area-context";

import petMascotImage from "../assets/pet-mascot.png";
import quietWalkRouteImage from "../assets/quiet-walk-route.png";
import {
  buildDepartureAdvice,
  demoPet,
  demoPois,
  demoRoutes,
  demoWeather,
  type Poi,
  type RoutineRoute
} from "@pets/shared";

import { MapScreen } from "./MapScreen";

type TabKey = "today" | "map" | "spots" | "pet";
type HomeNoticeKind =
  | "ask"
  | "assistant"
  | "routeSwapped"
  | "feedbackSmooth"
  | "feedbackRisk"
  | "addMode";
type FeedbackState = "idle" | "smooth" | "risk";

const BOTTOM_NAV_HEIGHT = 76;
const BOTTOM_NAV_MIN_SAFE_PADDING = 10;

const noticeCopy: Record<
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

export default function App() {
  return (
    <SafeAreaProvider>
      <AppShell />
    </SafeAreaProvider>
  );
}

function AppShell() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [homeNotice, setHomeNotice] = useState<HomeNoticeKind | null>(null);
  const [feedbackState, setFeedbackState] =
    useState<FeedbackState>("idle");
  const [isAddingPoi, setAddingPoi] = useState(false);
  const [customPois, setCustomPois] = useState<Poi[]>([]);
  const [homeRouteId, setHomeRouteId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const bottomSafePadding = Math.max(
    insets.bottom,
    BOTTOM_NAV_MIN_SAFE_PADDING
  );
  const scrollBottomPadding =
    BOTTOM_NAV_HEIGHT + bottomSafePadding + 28;
  const mapBottomNavInset = BOTTOM_NAV_HEIGHT + bottomSafePadding;

  const pois = useMemo(() => [...demoPois, ...customPois], [customPois]);

  const advice = useMemo(
    () =>
      buildDepartureAdvice({
        pet: demoPet,
        routes: demoRoutes,
        pois,
        weather: demoWeather
      }),
    [pois]
  );

  const activeRoute =
    demoRoutes.find((routeItem) => routeItem.id === homeRouteId) ??
    advice.recommendedRoute;
  const verifiedPoiCount = pois.filter(
    (poi) => poi.trust === "verified" && poi.lastVerifiedDays <= 7
  ).length;

  function showNotice(kind: HomeNoticeKind) {
    setHomeNotice(kind);
  }

  function handleRouteSwap() {
    const currentIndex = Math.max(
      0,
      demoRoutes.findIndex((routeItem) => routeItem.id === activeRoute.id)
    );
    const nextRoute = demoRoutes[(currentIndex + 1) % demoRoutes.length];

    setHomeRouteId(nextRoute.id);
    showNotice("routeSwapped");
  }

  function openMap() {
    setActiveTab("map");
    setAddingPoi(false);
    setHomeNotice(null);
  }

  function startAddPoi() {
    setActiveTab("map");
    setAddingPoi(true);
    showNotice("addMode");
  }

  function submitFeedback(nextState: Exclude<FeedbackState, "idle">) {
    setFeedbackState(nextState);
    showNotice(nextState === "smooth" ? "feedbackSmooth" : "feedbackRisk");
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <View
        pointerEvents={activeTab === "map" ? "auto" : "none"}
        style={[
          styles.mapLayer,
          activeTab === "map"
            ? styles.mapLayerVisible
            : styles.mapLayerHidden
        ]}
      >
        <MapScreen
          activeRouteId={activeRoute.id}
          bottomNavInset={mapBottomNavInset}
          isAddingPoi={isAddingPoi}
          onCancelAdding={() => setAddingPoi(false)}
          onCreateCustomPoi={(poi) => {
            setCustomPois((currentPois) => [...currentPois, poi]);
          }}
          pois={pois}
          routes={demoRoutes}
          topInset={insets.top}
        />
      </View>

      {activeTab !== "map" && (
        <SafeAreaView edges={["top", "right", "left"]} style={styles.safeArea}>
          {activeTab === "today" && (
            <HomeScreen
              activeRoute={activeRoute}
              advice={advice}
              bottomPadding={scrollBottomPadding}
              feedbackState={feedbackState}
              homeNotice={homeNotice}
              onAskPress={() => showNotice("ask")}
              onAssistantPress={() => showNotice("assistant")}
              onDismissNotice={() => setHomeNotice(null)}
              onFeedback={submitFeedback}
              onOpenMap={openMap}
              onRouteSwap={handleRouteSwap}
              onStartAddPoi={startAddPoi}
              verifiedPoiCount={verifiedPoiCount}
            />
          )}

          {activeTab === "spots" && (
            <SecondaryPageShell
              bottomPadding={scrollBottomPadding}
              eyebrow="附近证据"
              subtitle="POI 先显示来源和可信度，再进入推荐。"
              title="路线会用到这些地点"
            >
              <PoisView pois={pois} />
            </SecondaryPageShell>
          )}

          {activeTab === "pet" && (
            <SecondaryPageShell
              bottomPadding={scrollBottomPadding}
              eyebrow="宠物档案"
              subtitle="怕热、怕车、怕大狗会直接改变路线排序。"
              title={`${demoPet.name} 的出门偏好`}
            >
              <ProfileView />
            </SecondaryPageShell>
          )}
        </SafeAreaView>
      )}

      {activeTab !== "map" && homeNotice && (
        <FloatingNotice
          bottom={BOTTOM_NAV_HEIGHT + bottomSafePadding + 12}
          copy={noticeCopy[homeNotice]}
          onPress={() => setHomeNotice(null)}
        />
      )}

      <BottomNavBar
        activeTab={activeTab}
        bottomSafePadding={bottomSafePadding}
        onAddPress={startAddPoi}
        onTabPress={(tab) => {
          setActiveTab(tab);
          setAddingPoi(false);
          setHomeNotice(null);
        }}
      />
    </View>
  );
}

function HomeScreen({
  activeRoute,
  advice,
  bottomPadding,
  feedbackState,
  homeNotice,
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
  advice: ReturnType<typeof buildDepartureAdvice>;
  bottomPadding: number;
  feedbackState: FeedbackState;
  homeNotice: HomeNoticeKind | null;
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
          weatherLabel={`${demoWeather.feelsLikeC}C 体感`}
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

function HomeTopBar({
  onAskPress,
  onAssistantPress,
  verifiedPoiCount
}: {
  onAskPress: () => void;
  onAssistantPress: () => void;
  verifiedPoiCount: number;
}) {
  return (
    <View style={styles.topBar}>
      <View style={styles.userAvatar}>
        <Image
          accessibilityIgnoresInvertColors
          source={petMascotImage}
          style={styles.userAvatarImage}
        />
      </View>
      <Pressable
        accessibilityHint="Shows the current ask-agent state"
        accessibilityLabel="Ask Pawside"
        accessibilityRole="button"
        onPress={onAskPress}
        style={({ pressed }) => [
          styles.searchPill,
          pressed && styles.softPressed
        ]}
      >
        <Search color="#98A0B4" size={23} strokeWidth={2.6} />
        <Text numberOfLines={1} style={styles.searchText}>
          问爪边 / 搜附近
        </Text>
      </Pressable>
      <View style={styles.signalPill}>
        <CloudSun color="#5C6CF6" size={22} strokeWidth={2.5} />
        <Text style={styles.signalText}>{verifiedPoiCount}</Text>
      </View>
      <Pressable
        accessibilityLabel="Pet assistant"
        accessibilityRole="button"
        onPress={onAssistantPress}
        style={({ pressed }) => [
          styles.assistantButton,
          pressed && styles.softPressed
        ]}
      >
        <MessageCircle color="#5C6CF6" size={22} strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}

function PetStage({
  bubbleText,
  route,
  weatherLabel
}: {
  bubbleText: string;
  route: RoutineRoute;
  weatherLabel: string;
}) {
  return (
    <View style={styles.petStage}>
      <View style={styles.petImageFrame}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={petMascotImage}
          style={styles.petImage}
        />
      </View>
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>{bubbleText}</Text>
        <View style={styles.speechTail} />
      </View>
      <View style={styles.stageBadge}>
        <PawPrint color="#FFFFFF" size={17} strokeWidth={2.6} />
        <Text style={styles.stageBadgeText}>{route.fitScore}% 适配</Text>
      </View>
      <View style={styles.weatherBadge}>
        <Text style={styles.weatherBadgeText}>{weatherLabel}</Text>
      </View>
    </View>
  );
}

function EvidenceStrip({
  route,
  verifiedPoiCount
}: {
  route: RoutineRoute;
  verifiedPoiCount: number;
}) {
  return (
    <View style={styles.evidenceStrip}>
      <EvidenceItem label="阴影" value={`${route.shade}%`} />
      <EvidenceItem label="狗密度" value={route.dogDensity} />
      <EvidenceItem label="可信 POI" value={`${verifiedPoiCount} 个`} />
    </View>
  );
}

function EvidenceItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.evidenceItem}>
      <Text style={styles.evidenceValue}>{value}</Text>
      <Text style={styles.evidenceLabel}>{label}</Text>
    </View>
  );
}

function PrimaryRouteCard({
  onOpenMap,
  onRouteSwap,
  route
}: {
  onOpenMap: () => void;
  onRouteSwap: () => void;
  route: RoutineRoute;
}) {
  return (
    <View style={styles.primaryRouteCard}>
      <View style={styles.primaryRouteContent}>
        <View style={styles.primaryRouteText}>
          <Text style={styles.cardKicker}>今日推荐路线</Text>
          <Text numberOfLines={1} style={styles.primaryRouteTitle}>
            {route.name}
          </Text>
          <Text numberOfLines={2} style={styles.primaryRouteBody}>
            {route.description}
          </Text>

          <View style={styles.routeProgress}>
            {demoRoutes.map((routeItem) => (
              <View
                key={routeItem.id}
                style={[
                  styles.routeProgressDot,
                  routeItem.id === route.id && styles.routeProgressDotActive
                ]}
              />
            ))}
          </View>
        </View>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={quietWalkRouteImage}
          style={styles.routeImage}
        />
      </View>

      <View style={styles.primaryActions}>
        <Pressable
          accessibilityLabel="Open route map"
          accessibilityRole="button"
          onPress={onOpenMap}
          style={({ pressed }) => [
            styles.primaryActionButton,
            pressed && styles.buttonPressed
          ]}
        >
          <Map color="#FFFFFF" size={17} strokeWidth={2.6} />
          <Text style={styles.primaryActionText}>看地图</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Try another route"
          accessibilityRole="button"
          onPress={onRouteSwap}
          style={({ pressed }) => [
            styles.secondaryActionButton,
            pressed && styles.buttonPressed
          ]}
        >
          <RefreshCw color="#5C6CF6" size={17} strokeWidth={2.5} />
          <Text style={styles.secondaryActionText}>换一条</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ActionCard({
  Icon,
  accent,
  meta,
  onPress,
  title
}: {
  Icon: LucideIcon;
  accent: string;
  meta: string;
  onPress: () => void;
  title: string;
}) {
  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionCard,
        pressed && styles.cardPressed
      ]}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${accent}18` }]}>
        <Icon color={accent} size={24} strokeWidth={2.6} />
      </View>
      <View style={styles.actionCopy}>
        <Text numberOfLines={1} style={styles.actionTitle}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.actionMeta}>
          {meta}
        </Text>
      </View>
      <ChevronRight color="#5C6CF6" size={28} strokeWidth={2.8} />
    </Pressable>
  );
}

function RiskPanel({ alerts }: { alerts: string[] }) {
  return (
    <View style={styles.riskPanel}>
      <View style={styles.riskPanelHeader}>
        <Text style={styles.sectionTitle}>路上关注</Text>
        <Text style={styles.sectionMeta}>来自天气、路线和社区信号</Text>
      </View>
      {alerts.map((alert) => (
        <View key={alert} style={styles.alertRow}>
          <View style={styles.alertDot} />
          <Text style={styles.alertText}>{alert}</Text>
        </View>
      ))}
    </View>
  );
}

function FeedbackPanel({
  feedbackState,
  onDismissNotice,
  onFeedback,
  showReset
}: {
  feedbackState: FeedbackState;
  onDismissNotice: () => void;
  onFeedback: (state: Exclude<FeedbackState, "idle">) => void;
  showReset: boolean;
}) {
  const summary =
    feedbackState === "idle"
      ? "走完后只问两个问题，反馈会写回下一次推荐。"
      : feedbackState === "smooth"
        ? "已记住这次顺利，下一次会更信任这条路线。"
        : "已标记有新风险，建议在地图上补充位置。";

  return (
    <View style={styles.feedbackPanel}>
      <Text style={styles.feedbackTitle}>回来后怎么记？</Text>
      <Text style={styles.feedbackSummary}>{summary}</Text>
      <View style={styles.feedbackActions}>
        <Pressable
          accessibilityLabel="Mark walk smooth"
          accessibilityRole="button"
          onPress={() => onFeedback("smooth")}
          style={[
            styles.feedbackButton,
            feedbackState === "smooth" && styles.feedbackButtonActive
          ]}
        >
          <Text
            style={[
              styles.feedbackButtonText,
              feedbackState === "smooth" && styles.feedbackButtonTextActive
            ]}
          >
            顺利
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Mark new risk"
          accessibilityRole="button"
          onPress={() => onFeedback("risk")}
          style={[
            styles.feedbackButtonSecondary,
            feedbackState === "risk" && styles.feedbackButtonDangerActive
          ]}
        >
          <Text
            style={[
              styles.feedbackButtonTextSecondary,
              feedbackState === "risk" && styles.feedbackButtonTextActive
            ]}
          >
            有新风险
          </Text>
        </Pressable>
      </View>
      {showReset && (
        <Pressable
          accessibilityLabel="Dismiss current notice"
          accessibilityRole="button"
          onPress={onDismissNotice}
          style={styles.dismissNoticeButton}
        >
          <Text style={styles.dismissNoticeText}>收起提示</Text>
        </Pressable>
      )}
    </View>
  );
}

function SecondaryPageShell({
  bottomPadding,
  children,
  eyebrow,
  subtitle,
  title
}: {
  bottomPadding: number;
  children: React.ReactNode;
  eyebrow: string;
  subtitle: string;
  title: string;
}) {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.secondaryScrollContent,
        { paddingBottom: bottomPadding }
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.secondaryScroll}
    >
      <View style={styles.secondaryHeader}>
        <Text style={styles.secondaryEyebrow}>{eyebrow}</Text>
        <Text style={styles.secondaryTitle}>{title}</Text>
        <Text style={styles.secondarySubtitle}>{subtitle}</Text>
      </View>
      {children}
    </ScrollView>
  );
}

function BottomNavBar({
  activeTab,
  bottomSafePadding,
  onAddPress,
  onTabPress
}: {
  activeTab: TabKey;
  bottomSafePadding: number;
  onAddPress: () => void;
  onTabPress: (tab: TabKey) => void;
}) {
  return (
    <View
      style={[
        styles.bottomNav,
        {
          height: BOTTOM_NAV_HEIGHT + bottomSafePadding,
          paddingBottom: bottomSafePadding
        }
      ]}
    >
      <View style={styles.bottomNavContent} accessibilityRole="tablist">
        <BottomNavItem
          Icon={Home}
          isActive={activeTab === "today"}
          label="Today"
          onPress={() => onTabPress("today")}
        />
        <BottomNavItem
          Icon={Map}
          isActive={activeTab === "map"}
          label="Map"
          onPress={() => onTabPress("map")}
        />
        <View style={styles.centerNavSlot}>
          <CenterAddButton onPress={onAddPress} />
        </View>
        <BottomNavItem
          Icon={MapPin}
          isActive={activeTab === "spots"}
          label="Spots"
          onPress={() => onTabPress("spots")}
        />
        <BottomNavItem
          Icon={UserRound}
          isActive={activeTab === "pet"}
          label="Pet"
          onPress={() => onTabPress("pet")}
        />
      </View>
    </View>
  );
}

function BottomNavItem({
  Icon,
  isActive,
  label,
  onPress
}: {
  Icon: LucideIcon;
  isActive: boolean;
  label: string;
  onPress: () => void;
}) {
  const color = isActive ? "#5C6CF6" : "#6E7280";

  return (
    <Pressable
      accessibilityHint={`Switches to ${label}`}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.bottomNavItem,
        isActive && styles.bottomNavItemActive,
        pressed && styles.navPressed
      ]}
    >
      <Icon color={color} size={23} strokeWidth={2.55} />
      <Text style={[styles.bottomNavLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

function CenterAddButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityHint="Starts adding a custom POI on the map"
      accessibilityLabel="Add place or risk"
      accessibilityRole="button"
      hitSlop={12}
      onPress={onPress}
      style={({ pressed }) => [
        styles.centerAddButton,
        pressed && styles.centerAddButtonPressed
      ]}
    >
      <Plus color="#FFFFFF" size={28} strokeWidth={2.6} />
    </Pressable>
  );
}

function FloatingNotice({
  bottom,
  copy,
  onPress
}: {
  bottom: number;
  copy: { title: string; text: string };
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityHint="Dismisses the current tip"
      accessibilityLabel={copy.title}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.floatingNotice, { bottom }]}
    >
      <Text style={styles.floatingNoticeTitle}>{copy.title}</Text>
      <Text style={styles.floatingNoticeText}>{copy.text}</Text>
    </Pressable>
  );
}

function PoisView({ pois }: { pois: Poi[] }) {
  return (
    <View style={styles.stack}>
      {pois.map((poi) => (
        <View key={poi.id} style={styles.poiCard}>
          <View style={styles.rowBetween}>
            <View style={styles.poiTitleGroup}>
              <Text style={styles.cardTitle}>{poi.name}</Text>
              <Text style={styles.poiSource}>
                {poi.source === "custom"
                  ? "私人地点"
                  : poi.source === "apple"
                    ? "Apple 候选"
                    : "社区贡献"}
              </Text>
            </View>
            <TrustBadge trust={poi.trust} />
          </View>
          <Text style={styles.cardBody}>{poi.rule}</Text>
          <View style={styles.chipRow}>
            {poi.tags.map((tag) => (
              <Text key={tag} style={styles.chip}>
                {tag}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function ProfileView() {
  return (
    <View style={styles.stack}>
      <View style={styles.profilePanel}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={petMascotImage}
          style={styles.profileAvatar}
        />
        <Text style={styles.profileName}>{demoPet.name}</Text>
        <Text style={styles.profileMeta}>
          {demoPet.size} · {demoPet.ageLabel} · 可走 {demoPet.walkMinutes} 分钟
        </Text>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>影响推荐的档案</Text>
        <Text style={styles.sectionMeta}>这些标签会影响路线排序和风险提示。</Text>
        <View style={styles.chipRow}>
          {demoPet.traits.map((trait) => (
            <Text key={trait} style={styles.profileChip}>
              {trait}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function TrustBadge({ trust }: { trust: Poi["trust"] }) {
  const label =
    trust === "verified"
      ? "已验证"
      : trust === "claim"
        ? "待验证"
        : "待复查";

  return (
    <Text
      style={[
        styles.trustBadge,
        trust === "claim" && styles.trustClaim,
        trust === "needs-recheck" && styles.trustWarn
      ]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#F8F8F4",
    flex: 1
  },
  safeArea: {
    backgroundColor: "#F7E8D5",
    flex: 1,
    zIndex: 2
  },
  mapLayer: {
    backgroundColor: "#D6E8E5",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  mapLayerHidden: {
    zIndex: 0
  },
  mapLayerVisible: {
    zIndex: 1
  },
  homeScroll: {
    backgroundColor: "#F8F8F4",
    flex: 1
  },
  homeScrollContent: {
    backgroundColor: "#F8F8F4"
  },
  heroBand: {
    backgroundColor: "#F7E8D5",
    minHeight: 404,
    paddingHorizontal: 18,
    paddingTop: 10
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 58
  },
  userAvatar: {
    backgroundColor: "#A5B2FF",
    borderColor: "rgba(255,255,255,0.72)",
    borderRadius: 23,
    borderWidth: 2,
    height: 46,
    overflow: "hidden",
    width: 46
  },
  userAvatarImage: {
    height: "100%",
    width: "100%"
  },
  searchPill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.66)",
    borderColor: "rgba(255,255,255,0.82)",
    borderRadius: 28,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 9,
    minHeight: 52,
    minWidth: 0,
    paddingHorizontal: 14
  },
  searchText: {
    color: "#9398AA",
    flex: 1,
    fontSize: 18,
    fontWeight: "800"
  },
  signalPill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "rgba(255,255,255,0.82)",
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    height: 52,
    justifyContent: "center",
    paddingHorizontal: 11
  },
  signalText: {
    color: "#26358F",
    fontSize: 19,
    fontWeight: "900"
  },
  assistantButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "rgba(255,255,255,0.82)",
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    width: 50
  },
  softPressed: {
    opacity: 0.76,
    transform: [{ scale: 0.98 }]
  },
  petStage: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 326,
    paddingTop: 8
  },
  petImageFrame: {
    backgroundColor: "#FFF6EA",
    borderColor: "rgba(255,255,255,0.88)",
    borderRadius: 132,
    borderWidth: 1,
    height: 244,
    overflow: "hidden",
    shadowColor: "#8F7355",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 26,
    width: 244,
    elevation: 8
  },
  petImage: {
    height: "100%",
    width: "100%"
  },
  speechBubble: {
    backgroundColor: "#3C3C43",
    borderRadius: 14,
    maxWidth: 214,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: "absolute",
    right: 8,
    top: 154
  },
  speechText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 19
  },
  speechTail: {
    backgroundColor: "#3C3C43",
    bottom: -8,
    height: 16,
    position: "absolute",
    right: 38,
    transform: [{ rotate: "45deg" }],
    width: 16
  },
  stageBadge: {
    alignItems: "center",
    backgroundColor: "#5C6CF6",
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 23,
    borderWidth: 2,
    bottom: 30,
    flexDirection: "row",
    gap: 6,
    minHeight: 42,
    paddingHorizontal: 13,
    position: "absolute"
  },
  stageBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },
  weatherBadge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    left: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: "absolute",
    top: 48
  },
  weatherBadgeText: {
    color: "#7B5B2A",
    fontSize: 13,
    fontWeight: "900"
  },
  homeSheet: {
    backgroundColor: "#F8F8F4",
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    marginTop: -38,
    paddingHorizontal: 18,
    paddingTop: 42
  },
  decisionTitle: {
    color: "#242833",
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 36,
    textAlign: "center"
  },
  decisionMeta: {
    color: "#6D6F7A",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 23,
    marginTop: 8,
    textAlign: "center"
  },
  evidenceStrip: {
    flexDirection: "row",
    gap: 9,
    marginTop: 20
  },
  evidenceItem: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#ECEEF8",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 70,
    justifyContent: "center",
    shadowColor: "#64708A",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3
  },
  evidenceValue: {
    color: "#242833",
    fontSize: 17,
    fontWeight: "900"
  },
  evidenceLabel: {
    color: "#7D8190",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4
  },
  primaryRouteCard: {
    backgroundColor: "#DDEBFF",
    borderColor: "#D4E3FB",
    borderRadius: 28,
    borderWidth: 1,
    marginTop: 22,
    padding: 18,
    shadowColor: "#7790B4",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 6
  },
  primaryRouteContent: {
    flexDirection: "row",
    gap: 14
  },
  primaryRouteText: {
    flex: 1,
    minWidth: 0
  },
  cardKicker: {
    color: "#242833",
    fontSize: 16,
    fontWeight: "900"
  },
  primaryRouteTitle: {
    color: "#5E6574",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 12
  },
  primaryRouteBody: {
    color: "#5F6674",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 8
  },
  routeProgress: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 14
  },
  routeProgressDot: {
    backgroundColor: "#BCC8DA",
    borderRadius: 5,
    height: 10,
    width: 10
  },
  routeProgressDotActive: {
    backgroundColor: "#5C6CF6",
    width: 18
  },
  routeImage: {
    borderRadius: 18,
    height: 110,
    width: 110
  },
  primaryActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18
  },
  primaryActionButton: {
    alignItems: "center",
    backgroundColor: "#5C6CF6",
    borderRadius: 21,
    flex: 1,
    flexDirection: "row",
    gap: 7,
    height: 42,
    justifyContent: "center"
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },
  secondaryActionButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(92,108,246,0.18)",
    borderRadius: 21,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 7,
    height: 42,
    justifyContent: "center"
  },
  secondaryActionText: {
    color: "#5C6CF6",
    fontSize: 14,
    fontWeight: "900"
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }]
  },
  actionList: {
    gap: 13,
    marginTop: 24
  },
  actionCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EAEDF5",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    minHeight: 86,
    paddingHorizontal: 16,
    shadowColor: "#64708A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4
  },
  cardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  },
  actionIcon: {
    alignItems: "center",
    borderRadius: 24,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  actionCopy: {
    flex: 1,
    minWidth: 0
  },
  actionTitle: {
    color: "#3B3F4C",
    fontSize: 18,
    fontWeight: "900"
  },
  actionMeta: {
    color: "#6F7382",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5
  },
  riskPanel: {
    gap: 9,
    marginTop: 24
  },
  riskPanelHeader: {
    gap: 3
  },
  sectionTitle: {
    color: "#242833",
    fontSize: 19,
    fontWeight: "900"
  },
  sectionMeta: {
    color: "#747988",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18
  },
  alertRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#ECEEF8",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 58,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  alertDot: {
    backgroundColor: "#D86C4D",
    borderRadius: 5,
    height: 10,
    width: 10
  },
  alertText: {
    color: "#444956",
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20
  },
  feedbackPanel: {
    backgroundColor: "#26322D",
    borderRadius: 24,
    gap: 11,
    marginTop: 22,
    padding: 16
  },
  feedbackTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900"
  },
  feedbackSummary: {
    color: "#DCEAE3",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20
  },
  feedbackActions: {
    flexDirection: "row",
    gap: 10
  },
  feedbackButton: {
    alignItems: "center",
    backgroundColor: "#E6F3EA",
    borderRadius: 20,
    flex: 1,
    height: 42,
    justifyContent: "center"
  },
  feedbackButtonSecondary: {
    alignItems: "center",
    backgroundColor: "#F7E8BF",
    borderRadius: 20,
    flex: 1,
    height: 42,
    justifyContent: "center"
  },
  feedbackButtonActive: {
    backgroundColor: "#31A66C"
  },
  feedbackButtonDangerActive: {
    backgroundColor: "#D86C4D"
  },
  feedbackButtonText: {
    color: "#176B52",
    fontSize: 15,
    fontWeight: "900"
  },
  feedbackButtonTextSecondary: {
    color: "#8C5B13",
    fontSize: 15,
    fontWeight: "900"
  },
  feedbackButtonTextActive: {
    color: "#FFFFFF"
  },
  dismissNoticeButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderColor: "rgba(255,255,255,0.24)",
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 14
  },
  dismissNoticeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  },
  secondaryScroll: {
    backgroundColor: "#F8F8F4",
    flex: 1
  },
  secondaryScrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18
  },
  secondaryHeader: {
    backgroundColor: "#F7E8D5",
    borderRadius: 28,
    marginBottom: 18,
    padding: 20
  },
  secondaryEyebrow: {
    color: "#8B6A37",
    fontSize: 13,
    fontWeight: "900"
  },
  secondaryTitle: {
    color: "#242833",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 34,
    marginTop: 6
  },
  secondarySubtitle: {
    color: "#6F6A60",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 7
  },
  bottomNav: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "rgba(42,46,56,0.08)",
    borderRadius: 34,
    borderWidth: StyleSheet.hairlineWidth,
    bottom: 10,
    left: 14,
    overflow: "visible",
    position: "absolute",
    right: 14,
    shadowColor: "#2F3445",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.11,
    shadowRadius: 22,
    zIndex: 5,
    elevation: 12
  },
  bottomNavContent: {
    alignItems: "center",
    flexDirection: "row",
    height: BOTTOM_NAV_HEIGHT,
    justifyContent: "space-around",
    paddingHorizontal: 8
  },
  bottomNavItem: {
    alignItems: "center",
    borderRadius: 28,
    flex: 1,
    gap: 4,
    height: 58,
    justifyContent: "center",
    minWidth: 52
  },
  bottomNavItemActive: {
    backgroundColor: "#EEF0FF"
  },
  bottomNavLabel: {
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 13
  },
  navPressed: {
    opacity: 0.72
  },
  centerNavSlot: {
    alignItems: "center",
    justifyContent: "center",
    width: 62
  },
  centerAddButton: {
    alignItems: "center",
    backgroundColor: "#5C6CF6",
    borderColor: "#FFFFFF",
    borderRadius: 30,
    borderWidth: 4,
    height: 60,
    justifyContent: "center",
    shadowColor: "#5260D8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.26,
    shadowRadius: 16,
    transform: [{ translateY: -10 }],
    width: 60,
    elevation: 10
  },
  centerAddButtonPressed: {
    opacity: 0.88,
    transform: [{ translateY: -10 }, { scale: 0.96 }]
  },
  floatingNotice: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(92,108,246,0.14)",
    borderRadius: 18,
    borderWidth: 1,
    left: 18,
    paddingHorizontal: 15,
    paddingVertical: 13,
    position: "absolute",
    right: 18,
    shadowColor: "#2F3445",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.13,
    shadowRadius: 20,
    zIndex: 4,
    elevation: 11
  },
  floatingNoticeTitle: {
    color: "#242833",
    fontSize: 15,
    fontWeight: "900"
  },
  floatingNoticeText: {
    color: "#6F7382",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  },
  stack: {
    gap: 14
  },
  poiCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EAEDF5",
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#64708A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  poiTitleGroup: {
    flex: 1,
    minWidth: 0
  },
  cardTitle: {
    color: "#242833",
    flex: 1,
    fontSize: 17,
    fontWeight: "900"
  },
  poiSource: {
    color: "#7D8190",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4
  },
  cardBody: {
    color: "#5F6674",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 10
  },
  trustBadge: {
    backgroundColor: "#E3F4E8",
    borderRadius: 12,
    color: "#176B52",
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  trustWarn: {
    backgroundColor: "#FFF0D4",
    color: "#8C5B13"
  },
  trustClaim: {
    backgroundColor: "#EEF0FF",
    color: "#5C6CF6"
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 13
  },
  chip: {
    backgroundColor: "#F4F6FA",
    borderColor: "#EAEDF5",
    borderRadius: 14,
    borderWidth: 1,
    color: "#4E596B",
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  profilePanel: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EAEDF5",
    borderRadius: 28,
    borderWidth: 1,
    padding: 22,
    shadowColor: "#64708A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4
  },
  profileAvatar: {
    borderColor: "#EEF0FF",
    borderRadius: 58,
    borderWidth: 4,
    height: 116,
    width: 116
  },
  profileName: {
    color: "#242833",
    fontSize: 25,
    fontWeight: "900",
    marginTop: 14
  },
  profileMeta: {
    color: "#6F7382",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 6
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EAEDF5",
    borderRadius: 22,
    borderWidth: 1,
    padding: 16
  },
  profileChip: {
    backgroundColor: "#F7F9F5",
    borderColor: "#DDE8D8",
    borderRadius: 16,
    borderWidth: 1,
    color: "#334139",
    fontSize: 14,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 9
  }
});
