import { View, Text, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';
import { PressableScale } from '@/components/ui/PressableScale';
import { SecondaryButton } from '@/components/ui/PrimaryButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, space, radius, type, elevationShadow, touchTargetMin } from '@/constants/designTokens';

function RegistrationStatusCard({ status, loading }) {
  const isOpen = status === "open";
  const router = useRouter();

  function goRegister() {
    router.push("/RegistrationPage");
  }

  function goAiRegister() {
    router.push("/CourseRegistrationWithAi");
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>حالة تسجيل المقررات</Text>

      {loading ? (
        <View style={styles.statusSkeleton} accessibilityLabel="جاري تحميل حالة التسجيل">
          <Skeleton width={180} height={36} borderRadius={radius.pill} />
        </View>
      ) : (
        <View style={[styles.statusBadge, isOpen ? styles.statusOpen : styles.statusClosed]}>
          <Text style={[styles.statusText, isOpen ? styles.statusOpenText : styles.statusClosedText]}>
            {isOpen ? "التسجيل مفتوح" : "التسجيل مغلق"}
          </Text>
        </View>
      )}

      <PressableScale
        onPress={goRegister}
        disabled={!isOpen || loading}
        style={[styles.primaryCta, (!isOpen || loading) && styles.primaryCtaDisabled]}
        accessibilityRole="button"
        accessibilityState={{ disabled: !isOpen || loading }}
        accessibilityLabel="تسجيل المقررات للفصل الحالي">
        <Text style={styles.primaryCtaText}>تسجيل المقررات للفصل الحالي</Text>
      </PressableScale>

      <SecondaryButton title="تسجيل بمساعدة الذكاء الاصطناعي" onPress={goAiRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.lg,
    alignItems: "stretch",
    borderWidth: 1,
    borderColor: "rgba(203,213,225,0.4)",
    ...elevationShadow(2),
    gap: space.sm,
  },
  cardTitle: {
    ...type.headline,
    color: colors.dark,
    marginBottom: space.sm,
    paddingBottom: space.sm,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(37,99,235,0.2)",
    width: "100%",
    textAlign: "right",
  },
  statusSkeleton: {
    alignItems: "center",
    marginVertical: space.md,
    minHeight: 44,
    justifyContent: "center",
  },
  statusBadge: {
    paddingVertical: space.xs,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    marginVertical: space.sm,
    borderWidth: 1,
    alignSelf: "center",
    minHeight: touchTargetMin,
    justifyContent: "center",
  },
  statusOpen: {
    backgroundColor: colors.successBg,
    borderColor: colors.successBorder,
  },
  statusClosed: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
  },
  statusText: {
    ...type.callout,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  statusOpenText: {
    color: colors.success,
  },
  statusClosedText: {
    color: colors.dangerDark,
  },
  primaryCta: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: touchTargetMin + 4,
    marginTop: space.xs,
    ...elevationShadow(2),
  },
  primaryCtaDisabled: {
    backgroundColor: colors.muted,
    opacity: 0.85,
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryCtaText: {
    ...type.callout,
    color: colors.white,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default RegistrationStatusCard;
