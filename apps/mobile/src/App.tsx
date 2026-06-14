import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView
} from "react-native-safe-area-context";

import {
  buildDepartureAdvice,
  demoPet,
  demoPois,
  demoRoutes,
  demoWeather,
  type Poi,
  type RoutineRoute
} from "@pets/shared";

type TabKey = "today" | "routes" | "map" | "profile";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "today", label: "出门" },
  { key: "routes", label: "路线" },
  { key: "map", label: "地点" },
  { key: "profile", label: "档案" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");

  const advice = useMemo(
    () =>
      buildDepartureAdvice({
        pet: demoPet,
        routes: demoRoutes,
        pois: demoPois,
        weather: demoWeather
      }),
    []
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top", "right", "left"]} style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.shell}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEar}>小</Text>
              <Text style={styles.avatarName}>{demoPet.name.slice(0, 1)}</Text>
            </View>
            <View>
              <Text style={styles.kicker}>爪边 P0</Text>
              <Text style={styles.title}>今天怎么遛更稳？</Text>
            </View>
          </View>

          <View style={styles.tabBar} accessibilityRole="tablist">
            {tabs.map((tab) => (
              <TouchableOpacity
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === tab.key }}
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.tabTextActive
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === "today" && (
              <TodayView advice={advice} route={advice.recommendedRoute} />
            )}
            {activeTab === "routes" && <RoutesView routes={demoRoutes} />}
            {activeTab === "map" && <PoisView pois={demoPois} />}
            {activeTab === "profile" && <ProfileView />}
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TodayView({
  advice,
  route
}: {
  advice: ReturnType<typeof buildDepartureAdvice>;
  route: RoutineRoute;
}) {
  return (
    <View style={styles.stack}>
      <View style={styles.agentPanel}>
        <Text style={styles.panelLabel}>出门 Agent</Text>
        <Text style={styles.recommendation}>{advice.headline}</Text>
        <Text style={styles.summary}>{advice.summary}</Text>

        <View style={styles.reasonGrid}>
          {advice.reasons.map((reason) => (
            <View key={reason.label} style={styles.reasonItem}>
              <Text style={styles.reasonValue}>{reason.value}</Text>
              <Text style={styles.reasonLabel}>{reason.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <RouteCard route={route} highlighted />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>路上关注</Text>
        <Text style={styles.sectionMeta}>来自天气、路线和社区信号</Text>
      </View>

      {advice.alerts.map((alert) => (
        <View key={alert} style={styles.alertRow}>
          <View style={styles.alertDot} />
          <Text style={styles.alertText}>{alert}</Text>
        </View>
      ))}

      <View style={styles.feedbackBar}>
        <Text style={styles.feedbackTitle}>走完只问两件事</Text>
        <View style={styles.feedbackActions}>
          <TouchableOpacity style={styles.feedbackButton}>
            <Text style={styles.feedbackButtonText}>顺利</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.feedbackButtonSecondary}>
            <Text style={styles.feedbackButtonTextSecondary}>有新风险</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function RoutesView({ routes }: { routes: RoutineRoute[] }) {
  return (
    <View style={styles.stack}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>常走路线</Text>
        <Text style={styles.sectionMeta}>PRD P0 的核心复用对象</Text>
      </View>
      {routes.map((route) => (
        <RouteCard key={route.id} route={route} />
      ))}
    </View>
  );
}

function PoisView({ pois }: { pois: Poi[] }) {
  return (
    <View style={styles.stack}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>附近地点</Text>
        <Text style={styles.sectionMeta}>先显示可信度，再进入推荐</Text>
      </View>
      {pois.map((poi) => (
        <View key={poi.id} style={styles.poiCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>{poi.name}</Text>
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
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{demoPet.name}</Text>
        </View>
        <Text style={styles.profileName}>{demoPet.name}</Text>
        <Text style={styles.profileMeta}>
          {demoPet.size} · {demoPet.ageLabel} · 可走 {demoPet.walkMinutes} 分钟
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>影响推荐的档案</Text>
        <Text style={styles.sectionMeta}>怕热、怕狗、怕车会改变排序</Text>
      </View>

      <View style={styles.chipRow}>
        {demoPet.traits.map((trait) => (
          <Text key={trait} style={styles.profileChip}>
            {trait}
          </Text>
        ))}
      </View>
    </View>
  );
}

function RouteCard({
  route,
  highlighted = false
}: {
  route: RoutineRoute;
  highlighted?: boolean;
}) {
  return (
    <View style={[styles.routeCard, highlighted && styles.routeCardHighlight]}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardTitle}>{route.name}</Text>
        <Text style={styles.score}>{route.fitScore}</Text>
      </View>
      <Text style={styles.cardBody}>{route.description}</Text>
      <View style={styles.metricRow}>
        <Metric label="距离" value={`${route.distanceKm} km`} />
        <Metric label="耗时" value={`${route.minutes} 分`} />
        <Metric label="狗密度" value={route.dogDensity} />
      </View>
      <View style={styles.scoreTrack}>
        <View style={[styles.scoreFill, { width: `${route.fitScore}%` }]} />
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function TrustBadge({ trust }: { trust: Poi["trust"] }) {
  const label = trust === "verified" ? "已验证" : "待复查";

  return (
    <Text style={[styles.trustBadge, trust !== "verified" && styles.trustWarn]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F4EE"
  },
  shell: {
    flex: 1,
    paddingHorizontal: 18
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingBottom: 14,
    paddingTop: 10
  },
  kicker: {
    color: "#617067",
    fontSize: 13,
    fontWeight: "700"
  },
  title: {
    color: "#1E2420",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 4
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#EEC46B",
    borderColor: "#1E2420",
    borderRadius: 8,
    borderWidth: 2,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  avatarEar: {
    color: "#1E2420",
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 11
  },
  avatarName: {
    color: "#1E2420",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 24
  },
  tabBar: {
    backgroundColor: "#E8E3D7",
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    padding: 5
  },
  tab: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    minHeight: 38,
    justifyContent: "center"
  },
  tabActive: {
    backgroundColor: "#FFFFFF"
  },
  tabText: {
    color: "#5E655E",
    fontSize: 14,
    fontWeight: "700"
  },
  tabTextActive: {
    color: "#1E2420"
  },
  content: {
    paddingBottom: 28,
    paddingTop: 16
  },
  stack: {
    gap: 14
  },
  agentPanel: {
    backgroundColor: "#1F3D34",
    borderRadius: 8,
    padding: 18
  },
  panelLabel: {
    color: "#B9E6CC",
    fontSize: 13,
    fontWeight: "800"
  },
  recommendation: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 31,
    marginTop: 8
  },
  summary: {
    color: "#E6F2E9",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10
  },
  reasonGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16
  },
  reasonItem: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    flex: 1,
    minHeight: 64,
    padding: 10
  },
  reasonValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900"
  },
  reasonLabel: {
    color: "#C6D7CE",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3
  },
  sectionHeader: {
    gap: 3,
    marginTop: 2
  },
  sectionTitle: {
    color: "#1E2420",
    fontSize: 18,
    fontWeight: "900"
  },
  sectionMeta: {
    color: "#72756D",
    fontSize: 13,
    lineHeight: 18
  },
  routeCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DED8CA",
    borderRadius: 8,
    borderWidth: 1,
    padding: 15
  },
  routeCardHighlight: {
    borderColor: "#D49C45",
    borderWidth: 2
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  cardTitle: {
    color: "#1E2420",
    flex: 1,
    fontSize: 17,
    fontWeight: "900"
  },
  cardBody: {
    color: "#59615A",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8
  },
  score: {
    color: "#176B52",
    fontSize: 18,
    fontWeight: "900"
  },
  metricRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14
  },
  metric: {
    backgroundColor: "#F1EFE7",
    borderRadius: 8,
    flex: 1,
    minHeight: 56,
    padding: 10
  },
  metricValue: {
    color: "#1E2420",
    fontSize: 15,
    fontWeight: "900"
  },
  metricLabel: {
    color: "#77786F",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2
  },
  scoreTrack: {
    backgroundColor: "#E4E0D6",
    borderRadius: 999,
    height: 8,
    marginTop: 14,
    overflow: "hidden"
  },
  scoreFill: {
    backgroundColor: "#2F8B68",
    height: 8
  },
  alertRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E3DED1",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 13
  },
  alertDot: {
    backgroundColor: "#D86C4D",
    borderRadius: 5,
    height: 10,
    width: 10
  },
  alertText: {
    color: "#3B413C",
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20
  },
  feedbackBar: {
    backgroundColor: "#26322D",
    borderRadius: 8,
    gap: 12,
    padding: 14
  },
  feedbackTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900"
  },
  feedbackActions: {
    flexDirection: "row",
    gap: 10
  },
  feedbackButton: {
    alignItems: "center",
    backgroundColor: "#A7D8B8",
    borderRadius: 8,
    flex: 1,
    minHeight: 42,
    justifyContent: "center"
  },
  feedbackButtonSecondary: {
    alignItems: "center",
    backgroundColor: "#F1D28B",
    borderRadius: 8,
    flex: 1,
    minHeight: 42,
    justifyContent: "center"
  },
  feedbackButtonText: {
    color: "#17211C",
    fontSize: 15,
    fontWeight: "900"
  },
  feedbackButtonTextSecondary: {
    color: "#2E2613",
    fontSize: 15,
    fontWeight: "900"
  },
  poiCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DED8CA",
    borderRadius: 8,
    borderWidth: 1,
    padding: 15
  },
  trustBadge: {
    backgroundColor: "#DFF1E2",
    borderRadius: 6,
    color: "#176B52",
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  trustWarn: {
    backgroundColor: "#F7E8BF",
    color: "#8C5B13"
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  chip: {
    backgroundColor: "#EFF4F0",
    borderColor: "#D9E4DC",
    borderRadius: 6,
    borderWidth: 1,
    color: "#3B5147",
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  profilePanel: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#DED8CA",
    borderRadius: 8,
    borderWidth: 1,
    padding: 20
  },
  profileAvatar: {
    alignItems: "center",
    backgroundColor: "#EEC46B",
    borderColor: "#1E2420",
    borderRadius: 8,
    borderWidth: 2,
    height: 88,
    justifyContent: "center",
    width: 88
  },
  profileAvatarText: {
    color: "#1E2420",
    fontSize: 22,
    fontWeight: "900"
  },
  profileName: {
    color: "#1E2420",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 12
  },
  profileMeta: {
    color: "#697069",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5
  },
  profileChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DAD3C5",
    borderRadius: 8,
    borderWidth: 1,
    color: "#334139",
    fontSize: 14,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 10
  }
});
