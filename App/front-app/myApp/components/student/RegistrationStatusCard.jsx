import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from 'expo-router';

function RegistrationStatusCard({ status }) {
  const navigation = useNavigation();
  const isOpen = status === "open";

  const router = useRouter(); 
  
    async function handleLogin(event) {
      console.log("Button Clicked");
      
      // الآن يمكنك استخدام الـ router هنا
      router.push("/RegistrationPage"); 
    }

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
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>تسجيل المقررات للفصل الحالي</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(203,213,225,0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
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
  statusOpen: {
    backgroundColor: "#d1fae5",
    borderColor: "#a7f3d0",
  },
  statusClosed: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
  },
  statusText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
  statusOpenText: {
    color: "#065f46",
  },
  statusClosedText: {
    color: "#991b1b",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 4,
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
});

export default RegistrationStatusCard;
