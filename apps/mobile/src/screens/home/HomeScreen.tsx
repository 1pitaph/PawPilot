import {
  Activity,
  AlertTriangle,
  Battery,
  Bell,
  ChevronDown,
  ChevronRight,
  LocateFixed,
  Moon,
  Play,
  ShieldCheck,
  TrendingUp
} from "lucide-react-native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import MapView, { Marker, Polyline, type Region } from "react-native-maps";
import Svg, { Circle as SvgCircle } from "react-native-svg";

import type {
  GeoCoordinate,
  PetDailyStatus,
  PetProfile,
  RoutineRoute
} from "@pets/shared";

import type { FeedbackState } from "../../app/types";
import { images } from "../../assets/images";
import { styles } from "./HomeScreen.styles";

const MAP_PREVIEW_DELTA_MIN = 0.0042;
const RING_SIZE = 116;
const RING_STROKE = 22;

export function HomeScreen({
  activeRoute,
  bottomPadding,
  feedbackState,
  onAskPress,
  onAssistantPress,
  onFeedback,
  onOpenMap,
  onRouteSwap,
  onStartAddPoi,
  pet,
  status,
  weatherLabel
}: {
  activeRoute: RoutineRoute;
  bottomPadding: number;
  feedbackState: FeedbackState;
  onAskPress: () => void;
  onAssistantPress: () => void;
  onFeedback: (state: Exclude<FeedbackState, "idle">) => void;
  onOpenMap: () => void;
  onRouteSwap: () => void;
  onStartAddPoi: () => void;
  pet: PetProfile;
  status: PetDailyStatus;
  weatherLabel: string;
}) {
  const activityPercent = Math.round(status.activity.completionRatio * 100);
  const petCoordinate = getRouteCoordinate(activeRoute.path, 2);
  const mapRegion = getRouteRegion(activeRoute.path);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.homeScrollContent,
        { paddingBottom: bottomPadding }
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.homeScroll}
    >
      <View style={styles.header}>
        <View style={styles.petIdentity}>
          <Pressable
            accessibilityLabel="切换宠物"
            accessibilityRole="button"
            onPress={onAssistantPress}
            style={({ pressed }) => [
              styles.petNameButton,
              pressed && styles.softPressed
            ]}
          >
            <Text numberOfLines={1} style={styles.petName}>
              {pet.name}
            </Text>
            <ChevronDown color="#050505" size={28} strokeWidth={3} />
          </Pressable>
          <Text numberOfLines={1} style={styles.petMeta}>
            {pet.size} · {pet.ageLabel} · {pet.socialPreference}
          </Text>
        </View>

        <Pressable
          accessibilityLabel="查看宠物状态提醒"
          accessibilityRole="button"
          onPress={onAssistantPress}
          style={({ pressed }) => [
            styles.bellButton,
            pressed && styles.softPressed
          ]}
        >
          <Bell color="#050505" fill="#050505" size={29} strokeWidth={2.5} />
        </Pressable>
      </View>

      <Pressable
        accessibilityLabel="打开地图查看当前路线"
        accessibilityRole="button"
        onPress={onOpenMap}
        style={({ pressed }) => [
          styles.mapCard,
          pressed && styles.cardPressed
        ]}
      >
        <View pointerEvents="none" style={styles.mapSurface}>
          <MapView
            mapType="mutedStandard"
            pitchEnabled={false}
            region={mapRegion}
            rotateEnabled={false}
            scrollEnabled={false}
            showsBuildings={false}
            showsCompass={false}
            showsPointsOfInterests={false}
            showsScale={false}
            showsTraffic={false}
            style={styles.mapPreview}
            toolbarEnabled={false}
            zoomEnabled={false}
          >
            <Polyline
              coordinates={activeRoute.path}
              lineCap="round"
              lineJoin="round"
              strokeColor="#171717"
              strokeWidth={5}
            />
            <Marker coordinate={petCoordinate} tracksViewChanges={false}>
              <View style={styles.petMarker}>
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="cover"
                  source={images.petMascot}
                  style={styles.petMarkerImage}
                />
                <View style={styles.caregiverBadge}>
                  <Text style={styles.caregiverBadgeText}>
                    {status.device.caregiverInitial}
                  </Text>
                </View>
              </View>
            </Marker>
          </MapView>
          <View style={styles.mapWash} />
        </View>

        <View style={styles.mapStatusRow}>
          <Battery color="#0AA66F" size={24} strokeWidth={2.8} />
          <Text style={styles.mapStatusText}>
            {status.device.batteryPercent}%
          </Text>
          <View style={styles.onlineDot} />
          <Text style={styles.mapStatusText}>
            {status.device.online ? "Online" : "离线"}
          </Text>
        </View>

        <View style={styles.locateButton}>
          <LocateFixed color="#050505" size={28} strokeWidth={3} />
        </View>

        <View style={styles.walkPill}>
          <Text numberOfLines={1} style={styles.walkPillText}>
            {status.device.activityLabel} · {status.device.activityMinutes} 分钟
          </Text>
          <ChevronRight color="#050505" size={22} strokeWidth={3} />
        </View>
      </Pressable>

      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>今天</Text>
        <Text style={styles.dayDate}>{formatStatusDate(status.date)}</Text>
      </View>

      <Pressable
        accessibilityLabel="查看今日活动状态"
        accessibilityRole="button"
        onPress={onAskPress}
        style={({ pressed }) => [
          styles.primaryMetricCard,
          pressed && styles.cardPressed
        ]}
      >
        <View style={styles.metricCopy}>
          <Text style={styles.cardTitle}>今日活动</Text>
          <View style={styles.metricValueRow}>
            <Text style={styles.primaryValue}>
              {formatNumber(status.activity.steps)}
            </Text>
            <Text style={styles.primaryValueMuted}> / {activityPercent}%</Text>
          </View>
          <Text style={styles.metricLabel}>
            强度：{status.activity.intensity}
          </Text>
          <View style={styles.strainRow}>
            <Text style={styles.strainValue}>3</Text>
            <View style={styles.strainTrack}>
              <View style={styles.strainFill} />
              <View style={styles.strainThumb} />
            </View>
          </View>
        </View>
        <ProgressRing progress={status.activity.completionRatio} />
        <ChevronRight
          color="#C5C5C7"
          size={26}
          strokeWidth={3}
          style={styles.metricChevron}
        />
      </Pressable>

      <View style={styles.statusGrid}>
        <SmallStatusCard
          accent="blue"
          body={status.rest.copy}
          Icon={Moon}
          label={`午后小睡 ${status.rest.napMinutes} 分钟`}
          onPress={onAskPress}
          title="休息"
          value={formatMinutes(status.rest.totalMinutes)}
        />
        <SmallStatusCard
          accent="green"
          body={status.nearbyRhythm.copy}
          Icon={TrendingUp}
          label={status.nearbyRhythm.scope}
          onPress={onOpenMap}
          title="附近节奏"
          value={`${status.nearbyRhythm.label} ${status.nearbyRhythm.percentile}%`}
        />
        <SmallStatusCard
          accent="green"
          body={status.outdoorReadiness.reasons.slice(0, 3).join(" · ")}
          Icon={ShieldCheck}
          label="出门适配"
          onPress={onOpenMap}
          title="状态"
          value={`${status.outdoorReadiness.score} 分 ${status.outdoorReadiness.level}`}
        />
        <SmallStatusCard
          accent="orange"
          body={status.alerts[0]?.body ?? "暂无额外提醒。"}
          Icon={AlertTriangle}
          label={weatherLabel}
          onPress={onStartAddPoi}
          title="今日提醒"
          value={status.alerts[0]?.title ?? "状态稳定"}
        />
      </View>

      <View style={styles.planCard}>
        <Text style={styles.cardTitle}>今晚安排</Text>
        <Text style={styles.planTitle}>
          走 {activeRoute.minutes} 分钟{activeRoute.name}
        </Text>
        <Text style={styles.planBody}>
          {status.summary}
        </Text>
        <View style={styles.reasonRow}>
          {status.outdoorReadiness.reasons.map((reason) => (
            <Text key={reason} style={styles.reasonChip}>
              {reason}
            </Text>
          ))}
        </View>
        <View style={styles.planActions}>
          <Pressable
            accessibilityLabel="开始推荐路线"
            accessibilityRole="button"
            onPress={() => onFeedback("smooth")}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed
            ]}
          >
            <Play color="#FFFFFF" fill="#FFFFFF" size={17} strokeWidth={2.6} />
            <Text style={styles.primaryButtonText}>开始出门</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="查看推荐路线地图"
            accessibilityRole="button"
            onPress={onOpenMap}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={styles.secondaryButtonText}>看地图</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="换一个安排"
            accessibilityRole="button"
            onPress={onRouteSwap}
            style={({ pressed }) => [
              styles.ghostButton,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={styles.ghostButtonText}>换一个</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.feedbackCard}>
        <View style={styles.feedbackHeader}>
          <Activity color="#18CF7A" size={24} strokeWidth={2.7} />
          <Text style={styles.feedbackTitle}>回来后记一笔</Text>
        </View>
        <Text style={styles.feedbackBody}>
          {getFeedbackCopy(feedbackState)}
        </Text>
        <View style={styles.feedbackActions}>
          <Pressable
            accessibilityLabel="记录宠物状态不错"
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
              状态不错
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel="记录有喘气紧张或新风险"
            accessibilityRole="button"
            onPress={() => onFeedback("risk")}
            style={[
              styles.feedbackButtonSecondary,
              feedbackState === "risk" && styles.feedbackButtonDanger
            ]}
          >
            <Text
              style={[
                styles.feedbackButtonSecondaryText,
                feedbackState === "risk" && styles.feedbackButtonTextActive
              ]}
            >
              有喘/紧张
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = (RING_SIZE - RING_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <View style={styles.progressRing}>
      <Svg height={RING_SIZE} width={RING_SIZE}>
        <SvgCircle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          fill="none"
          r={radius}
          stroke="#DDF7E9"
          strokeWidth={RING_STROKE}
        />
        <SvgCircle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          fill="none"
          r={radius}
          stroke="#18CF7A"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeWidth={RING_STROKE}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
      </Svg>
    </View>
  );
}

function SmallStatusCard({
  accent,
  body,
  Icon,
  label,
  onPress,
  title,
  value
}: {
  accent: "blue" | "green" | "orange";
  body: string;
  Icon: typeof Moon;
  label: string;
  onPress: () => void;
  title: string;
  value: string;
}) {
  const accentStyle =
    accent === "blue"
      ? styles.smallValueBlue
      : accent === "orange"
        ? styles.smallValueOrange
        : styles.smallValueGreen;
  const iconStyle =
    accent === "blue"
      ? styles.smallIconBlue
      : accent === "orange"
        ? styles.smallIconOrange
        : styles.smallIconGreen;

  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.smallStatusCard,
        pressed && styles.cardPressed
      ]}
    >
      <View style={styles.smallCardHeader}>
        <Text numberOfLines={1} style={styles.smallCardTitle}>
          {title}
        </Text>
        <ChevronRight color="#C5C5C7" size={24} strokeWidth={3} />
      </View>
      <Text numberOfLines={1} style={styles.smallCardLabel}>
        {label}
      </Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.smallValue, accentStyle]}>
        {value}
      </Text>
      <Text numberOfLines={2} style={styles.smallBody}>
        {body}
      </Text>
      <View style={[styles.smallIcon, iconStyle]}>
        <Icon color="#FFFFFF" size={20} strokeWidth={2.7} />
      </View>
    </Pressable>
  );
}

function getRouteRegion(path: GeoCoordinate[]): Region {
  const coordinates = path.length > 0 ? path : [{ latitude: 31.2307, longitude: 121.4742 }];
  const latitudes = coordinates.map((coordinate) => coordinate.latitude);
  const longitudes = coordinates.map((coordinate) => coordinate.longitude);
  const latitude = average(latitudes);
  const longitude = average(longitudes);
  const latitudeDelta = Math.max(
    Math.max(...latitudes) - Math.min(...latitudes),
    MAP_PREVIEW_DELTA_MIN
  );
  const longitudeDelta = Math.max(
    Math.max(...longitudes) - Math.min(...longitudes),
    MAP_PREVIEW_DELTA_MIN
  );

  return {
    latitude,
    longitude,
    latitudeDelta: latitudeDelta * 2.1,
    longitudeDelta: longitudeDelta * 2.1
  };
}

function getRouteCoordinate(path: GeoCoordinate[], index: number) {
  return path[index] ?? path[0] ?? { latitude: 31.2307, longitude: 121.4742 };
}

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} 分钟`;
  }

  return `${hours}小时${minutes}分`;
}

function formatStatusDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return `${parsedDate.getMonth() + 1}月${parsedDate.getDate()}日 ${weekdays[parsedDate.getDay()]}`;
}

function getFeedbackCopy(feedbackState: FeedbackState) {
  if (feedbackState === "smooth") {
    return "已记住这次状态不错，下次会继续信任这条轻松路线。";
  }

  if (feedbackState === "risk") {
    return "已标记有喘气、紧张或新风险，建议在地图上补充具体位置。";
  }

  return "只记一两件事就够：状态是否舒服、有没有喘气紧张或新风险。反馈不会公开你的路线。";
}
