import {
  ChevronDown,
  CircleAlert,
  Clock3,
  Crosshair,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X
} from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import MapView, {
  Callout,
  Marker,
  Polyline,
  type LongPressEvent,
  type MapPressEvent,
  type Region
} from "react-native-maps";

import {
  demoMapCenter,
  poiCategoryLabels,
  type GeoCoordinate,
  type Poi,
  type PoiCategory,
  type RoutineRoute
} from "@pets/shared";

import { searchAppleMapPois } from "./appleMapsSearch";

const MAPKIT_REGION: Region = {
  ...demoMapCenter,
  latitudeDelta: 0.006,
  longitudeDelta: 0.006
};

const CATEGORY_FILTERS: Array<PoiCategory | "all"> = [
  "all",
  "water",
  "cafe",
  "grass",
  "clinic",
  "pet-store",
  "risk",
  "custom"
];

const CUSTOM_CATEGORY_OPTIONS: PoiCategory[] = [
  "custom",
  "water",
  "grass",
  "risk",
  "cafe"
];

export function MapScreen({
  activeRouteId,
  bottomNavInset,
  isAddingPoi,
  onCancelAdding,
  onCreateCustomPoi,
  pois,
  routes,
  topInset
}: {
  activeRouteId: string;
  bottomNavInset: number;
  isAddingPoi: boolean;
  onCancelAdding: () => void;
  onCreateCustomPoi: (poi: Poi) => void;
  pois: Poi[];
  routes: RoutineRoute[];
  topInset: number;
}) {
  const mapRef = useRef<MapView>(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<PoiCategory | "all">("all");
  const [selectedPoiId, setSelectedPoiId] = useState(pois[0]?.id ?? "");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isRecommendationCardVisible, setRecommendationCardVisible] =
    useState(true);
  const [draftCoordinate, setDraftCoordinate] =
    useState<GeoCoordinate | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftRule, setDraftRule] = useState("");
  const [draftCategory, setDraftCategory] =
    useState<PoiCategory>("custom");
  const [applePois, setApplePois] = useState<Poi[]>([]);
  const [isAppleSearchLoading, setAppleSearchLoading] = useState(false);

  const activeRoute =
    routes.find((route) => route.id === activeRouteId) ?? routes[0];

  useEffect(() => {
    if (!isAddingPoi) {
      resetDraftPoi();
    }
  }, [isAddingPoi]);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      setApplePois([]);
      setAppleSearchLoading(false);
      return;
    }

    let isCurrent = true;
    setAppleSearchLoading(true);

    const timeout = setTimeout(() => {
      searchAppleMapPois(normalizedQuery)
        .then((result) => {
          if (!isCurrent) {
            return;
          }

          setApplePois(result.pois);
          setAppleSearchLoading(false);
        })
        .catch(() => {
          if (!isCurrent) {
            return;
          }

          setApplePois([]);
          setAppleSearchLoading(false);
        });
    }, 320);

    return () => {
      isCurrent = false;
      clearTimeout(timeout);
    };
  }, [query]);

  const searchablePois = useMemo(
    () => mergePois(pois, applePois),
    [applePois, pois]
  );

  const filteredPois = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return searchablePois.filter((poi) => {
      const matchesCategory =
        selectedCategory === "all" || poi.category === selectedCategory;
      const searchableText = [
        poi.name,
        poi.rule,
        poiCategoryLabels[poi.category],
        ...poi.tags
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        searchableText.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [query, searchablePois, selectedCategory]);

  useEffect(() => {
    if (filteredPois.length === 0) {
      return;
    }

    if (!filteredPois.some((poi) => poi.id === selectedPoiId)) {
      setSelectedPoiId(filteredPois[0].id);
      setActiveCardIndex(0);
    }
  }, [filteredPois, selectedPoiId]);

  const selectedPoi =
    filteredPois.find((poi) => poi.id === selectedPoiId) ?? filteredPois[0];

  function focusCoordinate(coordinate: GeoCoordinate, zoom = 0.0035) {
    mapRef.current?.animateToRegion(
      {
        ...coordinate,
        latitudeDelta: zoom,
        longitudeDelta: zoom
      },
      260
    );
  }

  function focusRoute(route: RoutineRoute) {
    mapRef.current?.fitToCoordinates(route.path, {
      animated: true,
      edgePadding: {
        top: Math.round(topInset + 190),
        right: 40,
        bottom: Math.round(bottomNavInset + 160),
        left: 40
      }
    });
  }

  function selectPoi(poi: Poi, cardIndex?: number) {
    setSelectedPoiId(poi.id);
    setActiveCardIndex(
      cardIndex ??
        Math.max(0, filteredPois.findIndex((item) => item.id === poi.id))
    );
    setRecommendationCardVisible(true);
    focusCoordinate(poi.coordinate);
  }

  function handleMapPress(event: MapPressEvent | LongPressEvent) {
    if (!isAddingPoi) {
      return;
    }

    const coordinate = event.nativeEvent.coordinate;
    setDraftCoordinate(coordinate);
    focusCoordinate(coordinate, 0.0028);
  }

  function resetDraftPoi() {
    setDraftCoordinate(null);
    setDraftName("");
    setDraftRule("");
    setDraftCategory("custom");
  }

  function cancelDraftPoi() {
    resetDraftPoi();
    onCancelAdding();
  }

  function handleSaveCustomPoi() {
    if (!draftCoordinate) {
      return;
    }

    const fallbackLabel = poiCategoryLabels[draftCategory];
    const name = draftName.trim() || `我的${fallbackLabel}`;
    const rule =
      draftRule.trim() ||
      "私人保存地点，尚未发布到社区；只影响我的出门推荐。";

    const customPoi: Poi = {
      id: `custom-poi-${Date.now()}`,
      name,
      category: draftCategory,
      coordinate: draftCoordinate,
      rule,
      trust: "claim",
      source: "custom",
      tags: ["私人", fallbackLabel, "待验证"],
      lastVerifiedDays: 0
    };

    onCreateCustomPoi(customPoi);
    setSelectedPoiId(customPoi.id);
    setActiveCardIndex(0);
    setQuery("");
    setSelectedCategory("all");
    setFilterOpen(false);
    resetDraftPoi();
    onCancelAdding();
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        accessibilityLabel="Apple Maps MapKit map"
        initialRegion={MAPKIT_REGION}
        loadingEnabled
        mapPadding={{
          top: Math.round(topInset + 170),
          right: 22,
          bottom: Math.round(bottomNavInset + (isAddingPoi ? 238 : 158)),
          left: 22
        }}
        mapType="standard"
        onLongPress={isAddingPoi ? handleMapPress : undefined}
        onPress={isAddingPoi ? handleMapPress : undefined}
        pitchEnabled
        rotateEnabled
        scrollEnabled
        showsCompass
        showsPointsOfInterests
        showsUserLocation={false}
        style={styles.map}
        zoomEnabled
      >
        {activeRoute && (
          <Polyline
            coordinates={activeRoute.path}
            lineCap="round"
            lineJoin="round"
            strokeColor="#176B52"
            strokeWidth={5}
          />
        )}

        <Marker
          anchor={{ x: 0.5, y: 0.5 }}
          coordinate={demoMapCenter}
          tracksViewChanges={false}
          zIndex={30}
        >
          <View style={styles.userMarkerOuter}>
            <View style={styles.userMarkerDot} />
          </View>
        </Marker>

        {filteredPois.map((poi) => {
          const isSelected = selectedPoi?.id === poi.id;

          return (
            <Marker
              key={poi.id}
              coordinate={poi.coordinate}
              onPress={() => selectPoi(poi)}
              pinColor={getMarkerColor(poi, isSelected)}
              title={poi.name}
              zIndex={isSelected ? 20 : 10}
            >
              <Callout tooltip onPress={() => selectPoi(poi)}>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{poi.name}</Text>
                  <Text style={styles.calloutText}>
                    {poiCategoryLabels[poi.category]} ·{" "}
                    {getTrustLabel(poi.trust)}
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}

        {draftCoordinate && (
          <Marker
            coordinate={draftCoordinate}
            pinColor="#2A1A0F"
            title="新自定义地点"
            zIndex={25}
          />
        )}
      </MapView>

      <View pointerEvents="box-none" style={styles.overlay}>
        <View
          pointerEvents="box-none"
          style={[styles.topControls, { top: topInset + 10 }]}
        >
          <View style={styles.searchPill}>
            <Search color="#4F5B54" size={18} strokeWidth={2.5} />
            <TextInput
              accessibilityLabel="Search POI"
              autoCapitalize="none"
              clearButtonMode="while-editing"
              onChangeText={setQuery}
              placeholder="附近 · 今晚适合遛狗"
              placeholderTextColor="#46534B"
              returnKeyType="search"
              style={styles.searchInput}
              value={query}
            />
            {query.length > 0 ? (
              <Pressable
                accessibilityLabel="Clear search"
                hitSlop={8}
                onPress={() => setQuery("")}
              >
                <X color="#4F5B54" size={18} strokeWidth={2.4} />
              </Pressable>
            ) : (
              <ChevronDown color="#4F5B54" size={17} strokeWidth={2.5} />
            )}
          </View>

          <Pressable
            accessibilityLabel="Focus nearby area"
            hitSlop={8}
            onPress={() => focusCoordinate(demoMapCenter, 0.004)}
            style={({ pressed }) => [
              styles.roundControl,
              pressed && styles.controlPressed
            ]}
          >
            <Crosshair color="#1E2420" size={20} strokeWidth={2.4} />
          </Pressable>

          <Pressable
            accessibilityLabel="Filter POI"
            hitSlop={8}
            onPress={() => setFilterOpen((isOpen) => !isOpen)}
            style={({ pressed }) => [
              styles.roundControl,
              isFilterOpen && styles.roundControlActive,
              pressed && styles.controlPressed
            ]}
          >
            <SlidersHorizontal
              color={isFilterOpen ? "#FFFFFF" : "#1E2420"}
              size={20}
              strokeWidth={2.4}
            />
          </Pressable>
        </View>

        {isFilterOpen && (
          <View style={[styles.filterPanel, { top: topInset + 66 }]}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>POI 筛选</Text>
              <Text style={styles.filterMeta}>
                {isAppleSearchLoading
                  ? "Apple 候选搜索中"
                  : `${filteredPois.length} 个可用地点`}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroller}
            >
              {CATEGORY_FILTERS.map((category) => {
                const isActive = selectedCategory === category;
                const label =
                  category === "all" ? "全部" : poiCategoryLabels[category];

                return (
                  <Pressable
                    key={category}
                    accessibilityRole="button"
                    onPress={() => setSelectedCategory(category)}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive && styles.filterChipTextActive
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {activeRoute && isRecommendationCardVisible && !isFilterOpen && !isAddingPoi && (
          <RecommendationCard
            activeRoute={activeRoute}
            onClose={() => setRecommendationCardVisible(false)}
            onFocusPoi={selectedPoi ? () => selectPoi(selectedPoi) : undefined}
            onFocusRoute={() => focusRoute(activeRoute)}
            selectedPoi={selectedPoi}
            top={topInset + 118}
          />
        )}

        {!isAddingPoi && (
          <PoiCardRail
            activeCardIndex={activeCardIndex}
            bottom={bottomNavInset + 14}
            isAppleSearchLoading={isAppleSearchLoading}
            onSelectPoi={selectPoi}
            pois={filteredPois}
            selectedPoi={selectedPoi}
          />
        )}

        {isAddingPoi && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={bottomNavInset + 18}
            style={[styles.addPanelHost, { bottom: bottomNavInset + 14 }]}
          >
            <AddPoiPanel
              draftCategory={draftCategory}
              draftCoordinate={draftCoordinate}
              draftName={draftName}
              draftRule={draftRule}
              onCancel={cancelDraftPoi}
              onCategoryChange={setDraftCategory}
              onNameChange={setDraftName}
              onRuleChange={setDraftRule}
              onSave={handleSaveCustomPoi}
            />
          </KeyboardAvoidingView>
        )}
      </View>
    </View>
  );
}

function RecommendationCard({
  activeRoute,
  onClose,
  onFocusPoi,
  onFocusRoute,
  selectedPoi,
  top
}: {
  activeRoute: RoutineRoute;
  onClose: () => void;
  onFocusPoi?: () => void;
  onFocusRoute: () => void;
  selectedPoi?: Poi;
  top: number;
}) {
  return (
    <View pointerEvents="box-none" style={[styles.recommendationCard, { top }]}>
      <View style={styles.recommendationHeader}>
        <View style={styles.routeIcon}>
          <ShieldCheck color="#FFFFFF" size={20} strokeWidth={2.5} />
        </View>
        <View style={styles.recommendationTitleBlock}>
          <Text style={styles.cardKicker}>今晚推荐路线</Text>
          <Text numberOfLines={1} style={styles.recommendationTitle}>
            {activeRoute.name}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Hide route recommendation"
          hitSlop={8}
          onPress={onClose}
          style={styles.closeButton}
        >
          <X color="#6B716C" size={17} strokeWidth={2.4} />
        </Pressable>
      </View>

      <Text numberOfLines={2} style={styles.recommendationBody}>
        {activeRoute.description}
      </Text>

      <View style={styles.routeStats}>
        <RouteStat Icon={Clock3} label="耗时" value={`${activeRoute.minutes} 分`} />
        <RouteStat label="狗密度" value={activeRoute.dogDensity} />
        <RouteStat label="适配" value={`${activeRoute.fitScore}`} />
      </View>

      <View style={styles.recommendationFooter}>
        <Text numberOfLines={1} style={styles.recommendationPoi}>
          {selectedPoi
            ? `${selectedPoi.name} · ${getTrustLabel(selectedPoi.trust)}`
            : "暂无匹配 POI"}
        </Text>
        <View style={styles.recommendationActions}>
          <Pressable onPress={onFocusRoute} style={styles.ghostAction}>
            <Text style={styles.ghostActionText}>看路线</Text>
          </Pressable>
          {onFocusPoi && (
            <Pressable onPress={onFocusPoi} style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>看 POI</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

function RouteStat({
  Icon,
  label,
  value
}: {
  Icon?: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.routeStat}>
      {Icon && <Icon color="#176B52" size={15} strokeWidth={2.4} />}
      <Text style={styles.routeStatValue}>{value}</Text>
      <Text style={styles.routeStatLabel}>{label}</Text>
    </View>
  );
}

function PoiCardRail({
  activeCardIndex,
  bottom,
  isAppleSearchLoading,
  onSelectPoi,
  pois,
  selectedPoi
}: {
  activeCardIndex: number;
  bottom: number;
  isAppleSearchLoading: boolean;
  onSelectPoi: (poi: Poi, cardIndex?: number) => void;
  pois: Poi[];
  selectedPoi?: Poi;
}) {
  return (
    <View pointerEvents="box-none" style={[styles.poiRail, { bottom }]}>
      <ScrollView
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        snapToInterval={294}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={styles.poiRailContent}
      >
        {pois.length > 0 ? (
          pois.map((poi, index) => {
            const isActive = selectedPoi
              ? selectedPoi.id === poi.id
              : activeCardIndex === index;

            return (
              <Pressable
                key={poi.id}
                accessibilityRole="button"
                onPress={() => onSelectPoi(poi, index)}
                style={[
                  styles.poiCard,
                  isActive && styles.poiCardActive
                ]}
              >
                <View style={styles.poiCardHeader}>
                  <View style={styles.poiIcon}>
                    <Text style={styles.poiIconText}>
                      {getCategoryInitial(poi.category)}
                    </Text>
                  </View>
                  <View style={styles.poiTitleBlock}>
                    <Text numberOfLines={1} style={styles.poiName}>
                      {poi.name}
                    </Text>
                    <Text numberOfLines={1} style={styles.poiMeta}>
                      {poiCategoryLabels[poi.category]} ·{" "}
                      {getSourceLabel(poi.source)}
                    </Text>
                  </View>
                  <TrustBadge trust={poi.trust} />
                </View>

                <Text numberOfLines={2} style={styles.poiRule}>
                  {poi.rule}
                </Text>

                <View style={styles.tagRow}>
                  {poi.tags.slice(0, 3).map((tag) => (
                    <Text key={tag} numberOfLines={1} style={styles.tag}>
                      {tag}
                    </Text>
                  ))}
                </View>
              </Pressable>
            );
          })
        ) : (
          <View style={styles.emptyPoiCard}>
            <CircleAlert color="#8C5B13" size={18} strokeWidth={2.4} />
            <View style={styles.emptyPoiTextBlock}>
              <Text style={styles.emptyPoiTitle}>
                {isAppleSearchLoading ? "Apple 搜索中" : "没有匹配的 POI"}
              </Text>
              <Text style={styles.emptyPoiText}>换个关键词或筛选条件。</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function AddPoiPanel({
  draftCategory,
  draftCoordinate,
  draftName,
  draftRule,
  onCancel,
  onCategoryChange,
  onNameChange,
  onRuleChange,
  onSave
}: {
  draftCategory: PoiCategory;
  draftCoordinate: GeoCoordinate | null;
  draftName: string;
  draftRule: string;
  onCancel: () => void;
  onCategoryChange: (category: PoiCategory) => void;
  onNameChange: (value: string) => void;
  onRuleChange: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <View style={styles.addPanel}>
      <View style={styles.addPanelHeader}>
        <View>
          <Text style={styles.addPanelTitle}>添加自定义 POI</Text>
          <Text style={styles.addPanelMeta}>
            {draftCoordinate
              ? `${draftCoordinate.latitude.toFixed(5)}, ${draftCoordinate.longitude.toFixed(5)}`
              : "等待地图选点"}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Cancel adding POI"
          hitSlop={8}
          onPress={onCancel}
          style={styles.closeButton}
        >
          <X color="#1E2420" size={18} strokeWidth={2.4} />
        </Pressable>
      </View>

      <View style={styles.formGrid}>
        <TextInput
          accessibilityLabel="POI name"
          onChangeText={onNameChange}
          placeholder="地点名称，例如楼下水碗"
          placeholderTextColor="#8A8F89"
          style={styles.formInput}
          value={draftName}
        />
        <TextInput
          accessibilityLabel="POI rule"
          multiline
          onChangeText={onRuleChange}
          placeholder="宠物规则、风险或验证信息"
          placeholderTextColor="#8A8F89"
          style={[styles.formInput, styles.formInputMultiline]}
          value={draftRule}
        />
      </View>

      <View style={styles.categoryRow}>
        {CUSTOM_CATEGORY_OPTIONS.map((category) => {
          const isActive = draftCategory === category;

          return (
            <Pressable
              key={category}
              accessibilityRole="button"
              onPress={() => onCategoryChange(category)}
              style={[
                styles.filterChip,
                isActive && styles.filterChipActive
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive
                ]}
              >
                {poiCategoryLabels[category]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={!draftCoordinate}
        onPress={onSave}
        style={[
          styles.saveButton,
          !draftCoordinate && styles.saveButtonDisabled
        ]}
      >
        <Text style={styles.saveButtonText}>
          {draftCoordinate ? "保存私人 POI" : "等待选点"}
        </Text>
      </Pressable>
    </View>
  );
}

function TrustBadge({ trust }: { trust: Poi["trust"] }) {
  return (
    <Text
      style={[
        styles.trustBadge,
        trust === "needs-recheck" && styles.trustWarn,
        trust === "claim" && styles.trustClaim
      ]}
    >
      {getTrustLabel(trust)}
    </Text>
  );
}

function mergePois(localPois: Poi[], applePois: Poi[]) {
  const seen = new Set<string>();
  const merged: Poi[] = [];

  for (const poi of [...localPois, ...applePois]) {
    const key = `${poi.name.trim().toLowerCase()}-${poi.coordinate.latitude.toFixed(
      4
    )}-${poi.coordinate.longitude.toFixed(4)}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    merged.push(poi);
  }

  return merged;
}

function getTrustLabel(trust: Poi["trust"]) {
  if (trust === "verified") {
    return "已验证";
  }

  if (trust === "needs-recheck") {
    return "待复查";
  }

  return "待验证";
}

function getSourceLabel(source: Poi["source"]) {
  if (source === "apple") {
    return "Apple 候选";
  }

  if (source === "custom") {
    return "私人地点";
  }

  return "社区贡献";
}

function getMarkerColor(poi: Poi, isSelected: boolean) {
  if (isSelected) {
    return "#5C6CF6";
  }

  if (poi.category === "risk") {
    return "#D86C4D";
  }

  if (poi.source === "custom") {
    return "#2A1A0F";
  }

  if (poi.trust === "verified") {
    return "#176B52";
  }

  return "#D49C45";
}

function getCategoryInitial(category: PoiCategory) {
  return poiCategoryLabels[category].slice(0, 1);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D6E8E5",
    flex: 1
  },
  map: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  overlay: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  topControls: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    left: 16,
    position: "absolute",
    right: 16
  },
  searchPill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "rgba(30,36,32,0.08)",
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8
  },
  searchInput: {
    color: "#1E2420",
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    minHeight: 42,
    paddingVertical: 0
  },
  roundControl: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "rgba(30,36,32,0.08)",
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    height: 48,
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    width: 48,
    elevation: 8
  },
  roundControlActive: {
    backgroundColor: "#176B52",
    borderColor: "#176B52"
  },
  controlPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.96 }]
  },
  filterPanel: {
    backgroundColor: "rgba(255,255,255,0.97)",
    borderColor: "rgba(30,36,32,0.08)",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    left: 16,
    padding: 12,
    position: "absolute",
    right: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 9
  },
  filterHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  filterTitle: {
    color: "#1E2420",
    fontSize: 14,
    fontWeight: "900"
  },
  filterMeta: {
    color: "#68746D",
    fontSize: 12,
    fontWeight: "700"
  },
  filterScroller: {
    marginTop: 10
  },
  filterChip: {
    backgroundColor: "#EFF4F0",
    borderColor: "#D9E4DC",
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  filterChipActive: {
    backgroundColor: "#176B52",
    borderColor: "#176B52"
  },
  filterChipText: {
    color: "#3B5147",
    fontSize: 12,
    fontWeight: "900"
  },
  filterChipTextActive: {
    color: "#FFFFFF"
  },
  recommendationCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(30,36,32,0.08)",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    left: 32,
    padding: 14,
    position: "absolute",
    right: 32,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.13,
    shadowRadius: 22,
    elevation: 10
  },
  recommendationHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  routeIcon: {
    alignItems: "center",
    backgroundColor: "#B85CD2",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  recommendationTitleBlock: {
    flex: 1
  },
  cardKicker: {
    color: "#6A746E",
    fontSize: 12,
    fontWeight: "800"
  },
  recommendationTitle: {
    color: "#1E2420",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 2
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  recommendationBody: {
    color: "#4F5B54",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 10
  },
  routeStats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12
  },
  routeStat: {
    alignItems: "center",
    backgroundColor: "#F1F6F3",
    borderRadius: 8,
    flex: 1,
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 6
  },
  routeStatValue: {
    color: "#1E2420",
    fontSize: 14,
    fontWeight: "900"
  },
  routeStatLabel: {
    color: "#68746D",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2
  },
  recommendationFooter: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 12
  },
  recommendationPoi: {
    color: "#6A6258",
    flex: 1,
    fontSize: 12,
    fontWeight: "800"
  },
  recommendationActions: {
    flexDirection: "row",
    gap: 8
  },
  ghostAction: {
    alignItems: "center",
    borderColor: "#D9DDD8",
    borderRadius: 18,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    minWidth: 72,
    paddingHorizontal: 12
  },
  ghostActionText: {
    color: "#1E2420",
    fontSize: 12,
    fontWeight: "900"
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: "#5C6CF6",
    borderRadius: 18,
    height: 34,
    justifyContent: "center",
    minWidth: 72,
    paddingHorizontal: 12
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900"
  },
  poiRail: {
    left: 0,
    position: "absolute",
    right: 0
  },
  poiRailContent: {
    gap: 12,
    paddingHorizontal: 18
  },
  poiCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(30,36,32,0.08)",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 116,
    padding: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    width: 282,
    elevation: 9
  },
  poiCardActive: {
    borderColor: "#5C6CF6",
    borderWidth: 2
  },
  poiCardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  poiIcon: {
    alignItems: "center",
    backgroundColor: "#EAF4EE",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  poiIconText: {
    color: "#176B52",
    fontSize: 18,
    fontWeight: "900"
  },
  poiTitleBlock: {
    flex: 1
  },
  poiName: {
    color: "#1E2420",
    fontSize: 15,
    fontWeight: "900"
  },
  poiMeta: {
    color: "#68746D",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3
  },
  trustBadge: {
    backgroundColor: "#E3F4E8",
    borderRadius: 5,
    color: "#176B52",
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 7,
    paddingVertical: 4
  },
  trustWarn: {
    backgroundColor: "#FFF0D4",
    color: "#8C5B13"
  },
  trustClaim: {
    backgroundColor: "#EEF0FF",
    color: "#5C6CF6"
  },
  poiRule: {
    color: "#4F5B54",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 9
  },
  tagRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8
  },
  tag: {
    backgroundColor: "#F3F1EC",
    borderRadius: 5,
    color: "#6A6258",
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 7,
    paddingVertical: 4
  },
  emptyPoiCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(30,36,32,0.08)",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 10,
    minHeight: 86,
    padding: 14,
    width: 282
  },
  emptyPoiTextBlock: {
    flex: 1
  },
  emptyPoiTitle: {
    color: "#1E2420",
    fontSize: 14,
    fontWeight: "900"
  },
  emptyPoiText: {
    color: "#6A6258",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3
  },
  addPanelHost: {
    left: 14,
    position: "absolute",
    right: 14
  },
  addPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(30,36,32,0.08)",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 11
  },
  addPanelHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  addPanelTitle: {
    color: "#1E2420",
    fontSize: 16,
    fontWeight: "900"
  },
  addPanelMeta: {
    color: "#68746D",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3
  },
  formGrid: {
    gap: 8,
    marginTop: 12
  },
  formInput: {
    backgroundColor: "#F6F8F5",
    borderColor: "#E0E5DF",
    borderRadius: 8,
    borderWidth: 1,
    color: "#1E2420",
    fontSize: 14,
    fontWeight: "700",
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  formInputMultiline: {
    minHeight: 70,
    textAlignVertical: "top"
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#176B52",
    borderRadius: 8,
    height: 46,
    justifyContent: "center",
    marginTop: 12
  },
  saveButtonDisabled: {
    backgroundColor: "#A8B4AE"
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },
  userMarkerOuter: {
    alignItems: "center",
    backgroundColor: "rgba(92,108,246,0.18)",
    borderColor: "rgba(92,108,246,0.38)",
    borderRadius: 32,
    borderWidth: 1,
    height: 64,
    justifyContent: "center",
    width: 64
  },
  userMarkerDot: {
    backgroundColor: "#5C6CF6",
    borderColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 3,
    height: 16,
    width: 16
  },
  callout: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(30,36,32,0.08)",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 150,
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 8
  },
  calloutTitle: {
    color: "#1E2420",
    fontSize: 13,
    fontWeight: "900"
  },
  calloutText: {
    color: "#68746D",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4
  }
});
