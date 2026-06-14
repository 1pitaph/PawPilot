import {
  CircleAlert,
  Crosshair,
  MapPin,
  Search,
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
  bottomInset,
  isAddingPoi,
  onCancelAdding,
  onCreateCustomPoi,
  pois,
  routes
}: {
  activeRouteId: string;
  bottomInset: number;
  isAddingPoi: boolean;
  onCancelAdding: () => void;
  onCreateCustomPoi: (poi: Poi) => void;
  pois: Poi[];
  routes: RoutineRoute[];
}) {
  const mapRef = useRef<MapView>(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<PoiCategory | "all">("all");
  const [selectedPoiId, setSelectedPoiId] = useState(pois[0]?.id ?? "");
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

  function selectPoi(poi: Poi) {
    setSelectedPoiId(poi.id);
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

    setDraftName("");
    setDraftRule("");
    setDraftCategory("custom");
    setDraftCoordinate(null);
    onCancelAdding();
  }

  return (
    <View style={[styles.container, { paddingBottom: bottomInset }]}>
      <View style={styles.mapFrame}>
        <MapView
          ref={mapRef}
          accessibilityLabel="Apple Maps MapKit map"
          initialRegion={MAPKIT_REGION}
          loadingEnabled
          mapType="standard"
          onLongPress={handleMapPress}
          onPress={handleMapPress}
          showsCompass
          showsPointsOfInterests
          showsUserLocation={false}
          style={styles.map}
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

          {filteredPois.map((poi) => (
            <Marker
              key={poi.id}
              coordinate={poi.coordinate}
              pinColor={getMarkerColor(poi)}
              title={poi.name}
              onPress={() => setSelectedPoiId(poi.id)}
            >
              <Callout tooltip onPress={() => selectPoi(poi)}>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{poi.name}</Text>
                  <Text style={styles.calloutText}>
                    {poiCategoryLabels[poi.category]} · {getTrustLabel(poi)}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}

          {draftCoordinate && (
            <Marker
              coordinate={draftCoordinate}
              pinColor="#2A1A0F"
              title="新自定义地点"
            />
          )}
        </MapView>

        <View pointerEvents="box-none" style={styles.mapOverlay}>
          <View style={styles.searchPanel}>
            <View style={styles.searchRow}>
              <Search color="#526159" size={18} strokeWidth={2.4} />
              <TextInput
                accessibilityLabel="Search POI"
                autoCapitalize="none"
                clearButtonMode="while-editing"
                onChangeText={setQuery}
                placeholder="搜索 POI、规则或标签"
                placeholderTextColor="#8A8F89"
                returnKeyType="search"
                style={styles.searchInput}
                value={query}
              />
              {query.length > 0 && (
                <Pressable
                  accessibilityLabel="Clear search"
                  hitSlop={8}
                  onPress={() => setQuery("")}
                >
                  <X color="#526159" size={18} strokeWidth={2.4} />
                </Pressable>
              )}
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

          <View style={styles.mapkitBadge}>
            <MapPin color="#176B52" size={15} strokeWidth={2.6} />
            <Text style={styles.mapkitBadgeText}>
              iOS 使用 Apple Maps / MapKit
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={92}
      >
        {isAddingPoi ? (
          <AddPoiPanel
            draftCategory={draftCategory}
            draftCoordinate={draftCoordinate}
            draftName={draftName}
            draftRule={draftRule}
            onCancel={() => {
              setDraftCoordinate(null);
              onCancelAdding();
            }}
            onCategoryChange={setDraftCategory}
            onNameChange={setDraftName}
            onRuleChange={setDraftRule}
            onSave={handleSaveCustomPoi}
          />
        ) : (
          <PoiBottomSheet
            activeRoute={activeRoute}
            filteredCount={filteredPois.length}
            isAppleSearchLoading={isAppleSearchLoading}
            onFocusUser={() => focusCoordinate(demoMapCenter, 0.004)}
            onSelectPoi={selectPoi}
            pois={filteredPois}
            selectedPoi={selectedPoi}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

function PoiBottomSheet({
  activeRoute,
  filteredCount,
  isAppleSearchLoading,
  onFocusUser,
  onSelectPoi,
  pois,
  selectedPoi
}: {
  activeRoute?: RoutineRoute;
  filteredCount: number;
  isAppleSearchLoading: boolean;
  onFocusUser: () => void;
  onSelectPoi: (poi: Poi) => void;
  pois: Poi[];
  selectedPoi?: Poi;
}) {
  return (
    <View style={styles.bottomSheet}>
      <View style={styles.sheetHeader}>
        <View>
          <Text style={styles.sheetTitle}>附近 POI</Text>
          <Text style={styles.sheetMeta}>
            {isAppleSearchLoading
              ? "Apple 搜索中"
              : `${filteredCount} 个结果`}{" "}
            ·{" "}
            {activeRoute?.name ?? "未选择路线"}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Focus home area"
          hitSlop={8}
          onPress={onFocusUser}
          style={styles.iconButton}
        >
          <Crosshair color="#1E2420" size={18} strokeWidth={2.4} />
        </Pressable>
      </View>

      {selectedPoi ? (
        <View style={styles.selectedPoi}>
          <View style={styles.poiTitleRow}>
            <View style={styles.poiIcon}>
              <Text style={styles.poiIconText}>
                {getCategoryInitial(selectedPoi.category)}
              </Text>
            </View>
            <View style={styles.poiTitleBlock}>
              <Text style={styles.poiName}>{selectedPoi.name}</Text>
              <Text style={styles.poiMeta}>
                {poiCategoryLabels[selectedPoi.category]} ·{" "}
                {getSourceLabel(selectedPoi.source)}
              </Text>
            </View>
            <TrustBadge trust={selectedPoi.trust} />
          </View>
          <Text style={styles.poiRule}>{selectedPoi.rule}</Text>
          <View style={styles.chipRow}>
            {selectedPoi.tags.map((tag) => (
              <Text key={tag} style={styles.chip}>
                {tag}
              </Text>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <CircleAlert color="#8C5B13" size={18} strokeWidth={2.4} />
          <Text style={styles.emptyText}>没有匹配的 POI，试试换个词。</Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.poiStrip}
      >
        {pois.map((poi) => (
          <Pressable
            key={poi.id}
            accessibilityRole="button"
            onPress={() => onSelectPoi(poi)}
            style={[
              styles.poiPill,
              selectedPoi?.id === poi.id && styles.poiPillActive
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.poiPillTitle,
                selectedPoi?.id === poi.id && styles.poiPillTitleActive
              ]}
            >
              {poi.name}
            </Text>
            <Text
              style={[
                styles.poiPillMeta,
                selectedPoi?.id === poi.id && styles.poiPillMetaActive
              ]}
            >
              {poiCategoryLabels[poi.category]}
            </Text>
          </Pressable>
        ))}
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
      <View style={styles.sheetHeader}>
        <View>
          <Text style={styles.sheetTitle}>添加自定义 POI</Text>
          <Text style={styles.sheetMeta}>
            {draftCoordinate
              ? "填写后保存为私人地点"
              : "点按地图选择位置，也可以长按地图"}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Cancel adding POI"
          hitSlop={8}
          onPress={onCancel}
          style={styles.iconButton}
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
          {draftCoordinate ? "保存私人 POI" : "先在地图上选点"}
        </Text>
      </Pressable>
    </View>
  );
}

function TrustBadge({ trust }: { trust: Poi["trust"] }) {
  const label = getTrustLabel({ trust } as Poi);

  return (
    <Text
      style={[
        styles.trustBadge,
        trust === "needs-recheck" && styles.trustWarn,
        trust === "claim" && styles.trustClaim
      ]}
    >
      {label}
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

function getTrustLabel(poi: Pick<Poi, "trust">) {
  if (poi.trust === "verified") {
    return "已验证";
  }

  if (poi.trust === "needs-recheck") {
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

function getMarkerColor(poi: Poi) {
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
    flex: 1,
    gap: 10
  },
  mapFrame: {
    borderColor: "#D7D0C0",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 390,
    overflow: "hidden"
  },
  map: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  mapOverlay: {
    bottom: 0,
    left: 0,
    padding: 12,
    position: "absolute",
    right: 0,
    top: 0
  },
  searchPanel: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "rgba(42,26,15,0.08)",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 7
  },
  searchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 40
  },
  searchInput: {
    color: "#1E2420",
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 6
  },
  filterScroller: {
    marginTop: 8
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
  mapkitBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 6,
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
    minHeight: 30,
    paddingHorizontal: 9
  },
  mapkitBadgeText: {
    color: "#176B52",
    fontSize: 12,
    fontWeight: "900"
  },
  callout: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    maxWidth: 210,
    padding: 10
  },
  calloutTitle: {
    color: "#1E2420",
    fontSize: 14,
    fontWeight: "900"
  },
  calloutText: {
    color: "#617067",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DED8CA",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12
  },
  addPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D49C45",
    borderRadius: 8,
    borderWidth: 2,
    padding: 12
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  sheetTitle: {
    color: "#1E2420",
    fontSize: 17,
    fontWeight: "900"
  },
  sheetMeta: {
    color: "#72756D",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#F1EFE7",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  selectedPoi: {
    backgroundColor: "#F8F7F2",
    borderRadius: 8,
    marginTop: 10,
    padding: 12
  },
  poiTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  poiIcon: {
    alignItems: "center",
    backgroundColor: "#DFF1E2",
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  poiIconText: {
    color: "#176B52",
    fontSize: 15,
    fontWeight: "900"
  },
  poiTitleBlock: {
    flex: 1
  },
  poiName: {
    color: "#1E2420",
    fontSize: 16,
    fontWeight: "900"
  },
  poiMeta: {
    color: "#617067",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2
  },
  poiRule: {
    color: "#4E5A52",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 10
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
  trustClaim: {
    backgroundColor: "#EEEAE1",
    color: "#665A4D"
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10
  },
  chip: {
    backgroundColor: "#FFFFFF",
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
  poiStrip: {
    marginTop: 10
  },
  poiPill: {
    backgroundColor: "#F1EFE7",
    borderColor: "#E1DACB",
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    maxWidth: 150,
    minHeight: 54,
    minWidth: 120,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  poiPillActive: {
    backgroundColor: "#26322D",
    borderColor: "#26322D"
  },
  poiPillTitle: {
    color: "#1E2420",
    fontSize: 13,
    fontWeight: "900"
  },
  poiPillTitleActive: {
    color: "#FFFFFF"
  },
  poiPillMeta: {
    color: "#72756D",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4
  },
  poiPillMetaActive: {
    color: "#C6D7CE"
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: "#F7E8BF",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    padding: 12
  },
  emptyText: {
    color: "#6F4B18",
    flex: 1,
    fontSize: 13,
    fontWeight: "800"
  },
  formGrid: {
    gap: 8,
    marginTop: 10
  },
  formInput: {
    backgroundColor: "#F8F7F2",
    borderColor: "#E1DACB",
    borderRadius: 8,
    borderWidth: 1,
    color: "#1E2420",
    fontSize: 14,
    fontWeight: "700",
    minHeight: 44,
    paddingHorizontal: 11,
    paddingVertical: 10
  },
  formInputMultiline: {
    minHeight: 70,
    textAlignVertical: "top"
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#2A1A0F",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 12,
    minHeight: 44
  },
  saveButtonDisabled: {
    backgroundColor: "#A8A29A"
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  }
});
