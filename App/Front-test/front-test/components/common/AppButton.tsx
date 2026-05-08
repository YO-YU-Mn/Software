import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { COLORS } from '../../constants/theme';

export default function AppButton({
  title,
  onPress,
  loading,
  disabled,
  danger,
}: any) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        danger && styles.danger,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primary,

    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  danger: {
    backgroundColor: COLORS.danger,
  },

  disabled: {
    opacity: 0.5,
  },
});