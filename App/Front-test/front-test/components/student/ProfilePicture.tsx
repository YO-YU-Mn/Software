import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { uploadProfilePicture } from '../../services/student';
import Toast from 'react-native-toast-message';

const defaultImage = (code: string) => `https://ui-avatars.com/api/?background=2563eb&color=fff&size=120&name=${code || 'User'}`;

export default function ProfilePicture({ currentImageUrl, studentCode, onUploadSuccess }: any) {
  const { token } = useAuth();
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (currentImageUrl && currentImageUrl.trim() !== '') {
      setImageUrl(currentImageUrl);
    } else {
      setImageUrl(defaultImage(studentCode));
    }
  }, [currentImageUrl, studentCode]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'الرجاء منح صلاحية الوصول إلى المعرض' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  // ✅ الصيغة القديمة الصحيحة
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      const formData = new FormData();
      formData.append('profilePic', {
        uri: result.assets[0].uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);
      setUploading(true);
      try {
        const data = await uploadProfilePicture(formData);
        if (data.success) {
          setImageUrl(data.imageUrl);
          Toast.show({ type: 'success', text1: 'تم تحديث الصورة بنجاح' });
          onUploadSuccess?.(data.imageUrl);
        } else {
          Toast.show({ type: 'error', text1: data.message || 'فشل الرفع' });
        }
      } catch (error) {
        Toast.show({ type: 'error', text1: 'حدث خطأ في الاتصال' });
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl || defaultImage(studentCode) }} style={styles.avatar} />
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImage} disabled={uploading}>
        {uploading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.uploadText}>📷</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', width: 100, height: 100, marginRight: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ddd' },
  uploadBtn: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: '#2563eb',
    width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  uploadText: { fontSize: 18, color: '#fff' },
});