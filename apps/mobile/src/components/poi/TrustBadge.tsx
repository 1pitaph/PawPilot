import { Text } from "react-native";

import type { Poi } from "@pets/shared";

import { styles } from "./TrustBadge.styles";

export function TrustBadge({ trust }: { trust: Poi["trust"] }) {
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
