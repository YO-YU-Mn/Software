import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegistrationStatusCard({ status }: { status: 'open' | 'closed' }) {
  const router = useRouter();
  const isOpen = status === 'open';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>حالة تسجيل المقررات</Text>
      <Text style={[styles.status, isOpen ? styles.open : styles.closed]}>
        {isOpen ? 'التسجيل مفتوح' : 'التسجيل مغلق'}
      </Text>
      <TouchableOpacity
        style={[styles.button, !isOpen && styles.buttonDisabled]}
        disabled={!isOpen}
        onPress={() => router.push('/(tabs)/registration')}
      >
        <Text style={styles.buttonText}>سجل مقرراتك من هنا</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  status: { fontSize: 16, marginBottom: 12 },
  open: { color: 'green' },
  closed: { color: 'red' },
  button: { backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});