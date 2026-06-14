import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import {
  buildDepartureAdvice,
  demoPet,
  demoPois,
  demoRoutes,
  demoWeather,
  isAvatarJobFinal,
  type AvatarGenerationJob,
  type Poi
} from "@pets/shared";

import {
  createAvatarJob,
  fetchAvatarJob,
  getAvatarApiErrorMessage,
  selectAvatarCandidate,
  uploadAvatarSource
} from "../avatarApi";
import { BottomNavBar } from "../components/navigation/BottomNavBar";
import { FloatingNotice } from "../components/layout/FloatingNotice";
import { MapScreen } from "../MapScreen";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ProfileView } from "../screens/pet/ProfileView";
import { PoisView } from "../screens/spots/PoisView";
import { SecondaryPageShell } from "../screens/shared/SecondaryPageShell";
import { BOTTOM_NAV_HEIGHT, BOTTOM_NAV_MIN_SAFE_PADDING } from "./constants";
import { noticeCopy } from "./notices";
import { getVerifiedPoiCount } from "./selectors";
import type { AvatarPhotoSource, FeedbackState, HomeNoticeKind, TabKey } from "./types";
import { styles } from "./AppShell.styles";

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [homeNotice, setHomeNotice] = useState<HomeNoticeKind | null>(null);
  const [feedbackState, setFeedbackState] =
    useState<FeedbackState>("idle");
  const [isAddingPoi, setAddingPoi] = useState(false);
  const [customPois, setCustomPois] = useState<Poi[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [avatarJob, setAvatarJob] = useState<AvatarGenerationJob | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
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
    demoRoutes.find((routeItem) => routeItem.id === selectedRouteId) ??
    advice.recommendedRoute;
  const verifiedPoiCount = getVerifiedPoiCount(pois);

  function showNotice(kind: HomeNoticeKind) {
    setHomeNotice(kind);
  }

  useEffect(() => {
    const jobId = avatarJob?.id;
    if (
      !jobId ||
      avatarJob.status === "waiting_user" ||
      isAvatarJobFinal(avatarJob.status)
    ) {
      return;
    }

    let canceled = false;
    const refresh = async () => {
      try {
        const nextJob = await fetchAvatarJob(jobId);
        if (!canceled) {
          setAvatarJob(nextJob);
          setAvatarError(null);
        }
      } catch (error) {
        if (!canceled) {
          setAvatarError(getAvatarApiErrorMessage(error));
        }
      }
    };
    const interval = setInterval(() => {
      void refresh();
    }, 1800);

    void refresh();
    return () => {
      canceled = true;
      clearInterval(interval);
    };
  }, [avatarJob?.id, avatarJob?.status]);

  function handleRouteSwap() {
    const currentIndex = Math.max(
      0,
      demoRoutes.findIndex((routeItem) => routeItem.id === activeRoute.id)
    );
    const nextRoute = demoRoutes[(currentIndex + 1) % demoRoutes.length];

    setSelectedRouteId(nextRoute.id);
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

  async function startAvatarGeneration(source: AvatarPhotoSource = "camera") {
    setAvatarLoading(true);
    setAvatarError(null);
    try {
      const uploadFileId = await prepareAvatarSource(source);
      if (uploadFileId === null) {
        return;
      }
      const job = await createAvatarJob(demoPet.id, {
        sourceFileIds: uploadFileId ? [uploadFileId] : [],
        candidateCount: 4,
        mode: "rigged_3d",
        tryRig: true,
        autoSelectFirstCandidate: false,
        geometryQuality: "standard"
      });
      setAvatarJob(job);
    } catch (error) {
      setAvatarError(getAvatarApiErrorMessage(error));
    } finally {
      setAvatarLoading(false);
    }
  }

  async function refreshAvatarGeneration() {
    if (!avatarJob) {
      await startAvatarGeneration("camera");
      return;
    }

    setAvatarLoading(true);
    setAvatarError(null);
    try {
      const job = await fetchAvatarJob(avatarJob.id);
      setAvatarJob(job);
    } catch (error) {
      setAvatarError(getAvatarApiErrorMessage(error));
    } finally {
      setAvatarLoading(false);
    }
  }

  async function chooseAvatarCandidate(assetId: string) {
    if (!avatarJob) {
      return;
    }

    setAvatarLoading(true);
    setAvatarError(null);
    try {
      const job = await selectAvatarCandidate(avatarJob.id, assetId);
      setAvatarJob(job);
    } catch (error) {
      setAvatarError(getAvatarApiErrorMessage(error));
    } finally {
      setAvatarLoading(false);
    }
  }

  async function prepareAvatarSource(source: AvatarPhotoSource) {
    if (source === "demo") {
      return undefined;
    }

    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      throw new Error(source === "camera" ? "需要相机权限才能拍照生成。" : "需要相册权限才能选择照片。");
    }

    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      mediaTypes: ["images"],
      quality: 0.86
    };
    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    if (!asset?.base64) {
      throw new Error("照片读取失败，请重新选择一张宠物照片。");
    }

    const upload = await uploadAvatarSource({
      base64: asset.base64,
      fileName: asset.fileName ?? `${demoPet.id}-avatar.jpg`,
      mimeType: asset.mimeType ?? "image/jpeg"
    });
    return upload.fileId;
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
              routes={demoRoutes}
              bottomPadding={scrollBottomPadding}
              feedbackState={feedbackState}
              weatherLabel={`${demoWeather.feelsLikeC}C 体感`}
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
              <ProfileView
                pet={demoPet}
                avatarError={avatarError}
                avatarJob={avatarJob}
                avatarLoading={avatarLoading}
                onRefreshAvatar={refreshAvatarGeneration}
                onSelectAvatarCandidate={chooseAvatarCandidate}
                onStartAvatar={startAvatarGeneration}
              />
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
