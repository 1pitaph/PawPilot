import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import {
  Box,
  Camera,
  CheckCircle2,
  ChevronRight,
  Images,
  RefreshCw,
  Sparkles,
  type LucideIcon
} from "lucide-react-native";

import {
  avatarStageLabels,
  isAvatarJobFinal,
  type AvatarAsset,
  type AvatarGenerationJob
} from "@pets/shared";

import { AVATAR_API_BASE_URL } from "../../avatarApi";
import { images } from "../../assets/images";
import type { AvatarPhotoSource } from "../../app/types";
import { styles } from "./AvatarStudio.styles";

export function AvatarStudio({
  avatarError,
  job,
  loading,
  onRefresh,
  onSelectCandidate,
  onStart
}: {
  avatarError: string | null;
  job: AvatarGenerationJob | null;
  loading: boolean;
  onRefresh: () => void;
  onSelectCandidate: (assetId: string) => void;
  onStart: (source: AvatarPhotoSource) => void;
}) {
  const progress = Math.max(0, Math.min(job?.progress ?? 0, 100));
  const qCandidates =
    job?.assets.filter(
      (asset) => asset.kind === "q_candidate" || asset.kind === "q_selected"
    ) ?? [];
  const previewAsset = findLatestAsset(job?.assets, [
    "preview_image",
    "q_selected",
    "q_candidate"
  ]);
  const modelAsset = findLatestAsset(job?.assets, ["rigged_glb", "model_glb"]);
  const isWaitingForPick = job?.status === "waiting_user";
  const isFinal = job ? isAvatarJobFinal(job.status) : false;
  const stageLabel = job ? avatarStageLabels[job.stage] : "尚未开始";
  const primaryLabel = !job
    ? "拍照生成"
    : isWaitingForPick
      ? "刷新候选"
      : isFinal
        ? "重新拍照"
        : "刷新进度";

  return (
    <View style={styles.avatarStudio}>
      <View style={styles.avatarStudioHeader}>
        <View style={styles.avatarStudioIcon}>
          <Sparkles color="#FFFFFF" size={21} strokeWidth={2.6} />
        </View>
        <View style={styles.avatarStudioTitleGroup}>
          <Text style={styles.avatarStudioTitle}>Q 版 3D 分身</Text>
          <Text numberOfLines={1} style={styles.avatarStudioMeta}>
            {stageLabel} · {job?.status ?? "idle"}
          </Text>
        </View>
        {loading && <ActivityIndicator color="#5C6CF6" />}
      </View>

      <View style={styles.avatarPreviewRow}>
        <View style={styles.avatarPreviewFrame}>
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="cover"
            source={previewAsset ? { uri: previewAsset.url } : images.petMascot}
            style={styles.avatarPreviewImage}
          />
        </View>
        <View style={styles.avatarProgressPanel}>
          <Text style={styles.avatarProgressValue}>{progress}%</Text>
          <Text style={styles.avatarProgressLabel}>{job?.headline ?? "等待生成"}</Text>
          <View style={styles.avatarProgressTrack}>
            <View
              style={[
                styles.avatarProgressFill,
                { width: `${Math.max(progress, 4)}%` }
              ]}
            />
          </View>
          <Text numberOfLines={3} style={styles.avatarProgressMessage}>
            {job?.message ?? "从宠物照片生成 Q 版候选，再转 Tripo 3D 与骨骼绑定任务。"}
          </Text>
        </View>
      </View>

      {qCandidates.length > 0 && (
        <View style={styles.avatarCandidateSection}>
          <Text style={styles.avatarSubTitle}>主设定候选</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.avatarCandidateScroll}
          >
            {qCandidates.map((asset) => {
              const selected =
                asset.kind === "q_selected" || asset.id === job?.selectedQAssetId;
              return (
                <Pressable
                  accessibilityLabel={`选择${asset.label ?? "Q 版候选"}`}
                  accessibilityRole="button"
                  disabled={!isWaitingForPick || loading}
                  key={asset.id}
                  onPress={() => onSelectCandidate(asset.id)}
                  style={({ pressed }) => [
                    styles.avatarCandidateCard,
                    selected && styles.avatarCandidateCardSelected,
                    pressed && styles.cardPressed
                  ]}
                >
                  <Image
                    accessibilityIgnoresInvertColors
                    resizeMode="cover"
                    source={{ uri: asset.url }}
                    style={styles.avatarCandidateImage}
                  />
                  <Text numberOfLines={1} style={styles.avatarCandidateLabel}>
                    {selected ? "已选" : asset.label ?? "候选"}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {modelAsset && (
        <View style={styles.avatarAssetPanel}>
          <View style={styles.avatarAssetIcon}>
            <Box color="#26322D" size={22} strokeWidth={2.5} />
          </View>
          <View style={styles.avatarAssetText}>
            <Text style={styles.avatarAssetTitle}>
              {modelAsset.kind === "rigged_glb" ? "骨骼 GLB 已就绪" : "静态 GLB 已就绪"}
            </Text>
            <Text numberOfLines={1} style={styles.avatarAssetMeta}>
              {modelAsset.fileName ?? "pet-avatar.glb"}
            </Text>
          </View>
          <CheckCircle2 color="#31A66C" size={23} strokeWidth={2.6} />
        </View>
      )}

      {job?.qualityReport && (
        <View style={styles.avatarQaGrid}>
          {job.qualityReport.checks.map((check) => (
            <View key={check.id} style={styles.avatarQaItem}>
              <Text style={styles.avatarQaLabel}>{check.label}</Text>
              <Text
                style={[
                  styles.avatarQaStatus,
                  !check.passed && styles.avatarQaStatusWarn
                ]}
              >
                {check.passed ? "通过" : "待处理"}
              </Text>
            </View>
          ))}
        </View>
      )}

      {avatarError && (
        <Text numberOfLines={3} style={styles.avatarErrorText}>
          {avatarError}
        </Text>
      )}

      <View style={styles.avatarActions}>
        <AvatarActionButton
          Icon={!job || isFinal ? Camera : RefreshCw}
          disabled={loading}
          label={primaryLabel}
          onPress={!job || isFinal ? () => onStart("camera") : onRefresh}
          tone="primary"
        />
        {(!job || isFinal) && (
          <AvatarActionButton
            Icon={Images}
            disabled={loading}
            label="从相册选"
            onPress={() => onStart("library")}
            tone="secondary"
          />
        )}
        {isWaitingForPick && qCandidates[0] && (
          <AvatarActionButton
            Icon={ChevronRight}
            disabled={loading}
            label="选择第一张"
            onPress={() => onSelectCandidate(qCandidates[0].id)}
            tone="secondary"
          />
        )}
      </View>

      <Text numberOfLines={1} style={styles.avatarApiHint}>
        {AVATAR_API_BASE_URL}
      </Text>
    </View>
  );
}

function AvatarActionButton({
  Icon,
  disabled,
  label,
  onPress,
  tone
}: {
  Icon: LucideIcon;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  tone: "primary" | "secondary";
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        tone === "primary"
          ? styles.avatarPrimaryButton
          : styles.avatarSecondaryButton,
        disabled && styles.avatarButtonDisabled,
        pressed && styles.buttonPressed
      ]}
    >
      <Icon
        color={tone === "primary" ? "#FFFFFF" : "#5C6CF6"}
        size={17}
        strokeWidth={2.6}
      />
      <Text
        style={
          tone === "primary"
            ? styles.avatarPrimaryButtonText
            : styles.avatarSecondaryButtonText
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

function findLatestAsset(
  assets: AvatarAsset[] | undefined,
  kinds: AvatarAsset["kind"][]
) {
  if (!assets) {
    return undefined;
  }
  for (let index = assets.length - 1; index >= 0; index -= 1) {
    const asset = assets[index];
    if (kinds.includes(asset.kind)) {
      return asset;
    }
  }
  return undefined;
}
