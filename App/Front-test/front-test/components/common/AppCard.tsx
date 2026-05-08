import { View, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/theme';

export default function AppCard({ children, style }: any) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: '#eef2f7',

    ...SHADOWS.small,
  },
});