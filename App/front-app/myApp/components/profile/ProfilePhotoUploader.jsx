import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_BASE_URL } from '@/config';
import { SecondaryButton } from '@/components/ui/PrimaryButton';
import { colors, space, radius, type } from '@/constants/designTokens';

/**
 * Compress + upload avatar as Data URL — backend PATCH /students/me/avatar
 *
 * Permissions: expo-image-picker (see app.json plugin).
 *
 * TODO: Insert cloud storage PUBLIC_URL workflow here instead of Mongo base64 when scaling.
 */
export default function ProfilePhotoUploader({ avatarDataUrl, onUploaded }) {
  const [busy, setBusy] = useState(false);

  const pickAndUpload = async () => {
    setBusy(true);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Toast.show({ type: 'error', text1: 'الصلاحيات مطلوبة لاختيار صورة.' });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.45,
        base64: true,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const mime =
        asset.mimeType && asset.mimeType.startsWith('image/')
          ? asset.mimeType
          : 'image/jpeg';
      const b64 = asset.base64;
      if (!b64) {
        Toast.show({
          type: 'error',
          text1: 'تعذّر قراءة الصورة كنص؛ جرّب صورة أصغر أو أعد المحاولة.',
        });
        return;
      }

      const dataUrl = `data:${mime};base64,${b64}`;
      if (dataUrl.length > 350000) {
        Toast.show({
          type: 'error',
          text1: 'الصورة كبيرة جداً — جرّب صورة بحجم أصغر أو جودة أقل.',
        });
        return;
      }

      const token = await AsyncStorage.getItem('token');
      // TODO: Insert Authorization token header if JWT format changes (Bearer vs raw)
      await axios.patch(
        `${API_BASE_URL}/students/me/avatar`,
        { avatarDataUrl: dataUrl },
        { headers: { Authorization: token } }
      );
      Toast.show({ type: 'success', text1: 'تم تحديث صورة الملف' });
      onUploaded?.({ avatarDataUrl: dataUrl });
    } catch (e) {
      console.error(e);
      Toast.show({ type: 'error', text1: 'فشل رفع الصورة' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.row}>
      {avatarDataUrl ? (
        <Image source={{ uri: avatarDataUrl }} style={styles.avatar} accessibilityIgnoresInvertColors />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]} accessibilityElementsHidden />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>الصورة الشخصية</Text>
        <SecondaryButton
          title={busy ? '…' : avatarDataUrl ? 'تغيير الصورة' : 'رفع صورة'}
          onPress={pickAndUpload}
          disabled={busy}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.md,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: { width: 72, height: 72, borderRadius: radius.pill },
  avatarPlaceholder: { backgroundColor: colors.bgAlt, borderWidth: 1, borderColor: colors.border },
  label: { ...type.caption, color: colors.muted, marginBottom: space.xs, textAlign: 'right' },
});
