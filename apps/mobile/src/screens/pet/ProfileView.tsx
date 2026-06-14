import { Image, Text, View } from "react-native";

import type { AvatarGenerationJob, PetProfile } from "@pets/shared";

import { images } from "../../assets/images";
import type { AvatarPhotoSource } from "../../app/types";
import { AvatarStudio } from "./AvatarStudio";
import { styles } from "./ProfileView.styles";

export function ProfileView({
  pet,
  avatarError,
  avatarJob,
  avatarLoading,
  onRefreshAvatar,
  onSelectAvatarCandidate,
  onStartAvatar
}: {
  pet: PetProfile;
  avatarError: string | null;
  avatarJob: AvatarGenerationJob | null;
  avatarLoading: boolean;
  onRefreshAvatar: () => void;
  onSelectAvatarCandidate: (assetId: string) => void;
  onStartAvatar: (source: AvatarPhotoSource) => void;
}) {
  return (
    <View style={styles.stack}>
      <View style={styles.profilePanel}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={images.petMascot}
          style={styles.profileAvatar}
        />
        <Text style={styles.profileName}>{pet.name}</Text>
        <Text style={styles.profileMeta}>
          {pet.size} · {pet.ageLabel} · 可走 {pet.walkMinutes} 分钟
        </Text>
      </View>

      <AvatarStudio
        avatarError={avatarError}
        job={avatarJob}
        loading={avatarLoading}
        onRefresh={onRefreshAvatar}
        onSelectCandidate={onSelectAvatarCandidate}
        onStart={onStartAvatar}
      />

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>影响推荐的档案</Text>
        <Text style={styles.sectionMeta}>这些标签会影响路线排序和风险提示。</Text>
        <View style={styles.chipRow}>
          {pet.traits.map((trait) => (
            <Text key={trait} style={styles.profileChip}>
              {trait}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
