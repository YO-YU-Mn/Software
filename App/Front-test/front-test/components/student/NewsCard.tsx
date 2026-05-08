import { View, Text, StyleSheet } from 'react-native';

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
  card: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 12, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: 'bold' },
  date: { fontSize: 12, color: '#888', marginVertical: 4 },
  description: { fontSize: 14 },
});