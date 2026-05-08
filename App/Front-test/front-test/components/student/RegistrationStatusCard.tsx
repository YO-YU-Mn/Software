import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SHADOWS } from '../../constants/theme';

export default function RegistrationStatusCard({ status }: { status: 'open' | 'closed' }) {
  const router = useRouter();
  const isOpen = status === 'open';

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>حالة تسجيل المقررات</Text>

      <View style={[styles.statusBadge, isOpen ? styles.statusOpen : styles.statusClosed]}>
        <Text style={[styles.statusText, isOpen ? styles.statusOpenText : styles.statusClosedText]}>
          {isOpen ? "التسجيل مفتوح" : "التسجيل مغلق"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !isOpen && styles.buttonDisabled]}
        disabled={!isOpen}
        onPress={() => router.push('/(tabs)/registration')}
      >
        <Text style={styles.buttonText}>تسجيل المقررات للفصل الحالي</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.aiButton]}
        onPress={() => router.push('/(tabs)/schedule-registration')}
      >
        <Text style={styles.buttonText}>تسجيل بالذكاء الاصطناعي</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(203,213,225,0.4)",
    ...SHADOWS.medium,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(37,99,235,0.2)",
    width: "100%",
    textAlign: "right",
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 40,
    marginVertical: 14,
    borderWidth: 1,
  },
  statusOpen: { backgroundColor: "#d1fae5", borderColor: "#a7f3d0" },
  statusClosed: { backgroundColor: "#fee2e2", borderColor: "#fecaca" },
  statusText: { fontSize: 15, fontWeight: "700", letterSpacing: 1 },
  statusOpenText: { color: "#065f46" },
  statusClosedText: { color: "#991b1b" },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
    ...SHADOWS.small,
    marginTop: 12,
  },
  aiButton: { backgroundColor: "#7c3aed", marginTop: 8 },
  buttonDisabled: { backgroundColor: "#94a3b8", opacity: 0.7, ...SHADOWS.small },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15, textAlign: "center" },
});