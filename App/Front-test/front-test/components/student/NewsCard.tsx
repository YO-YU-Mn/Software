import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/theme';


export default function NewsCard({ news }: { news: any }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.date}>{news.date}</Text>
      <Text style={styles.description}>{news.description}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.small,
  },
  title: { fontSize: 16, fontWeight: "bold", color: COLORS.dark, marginBottom: 6, textAlign: "right" },
  date: { fontSize: 12, color: COLORS.gray, marginBottom: 8, textAlign: "right" },
  description: { fontSize: 14, color: COLORS.dark, lineHeight: 20, textAlign: "right" },
})