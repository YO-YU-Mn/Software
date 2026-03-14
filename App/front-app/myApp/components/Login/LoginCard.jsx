import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Linking, 
  Text, 
  StyleSheet 
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


function LoginCard() {
    // 1. تعريف الـ States لتخزين ما يكتبه المستخدم
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // 2. أداة التنقل
    const router = useRouter();

    // وظيفة تسجيل الدخول
    async function handleLogin() {
        // تأكد أن المستخدم أدخل البيانات قبل الإرسال
        if (!code || !password) {
            Alert.alert("تنبيه", "يرجى إدخال الكود وكلمة المرور");
            return;
        }

        try {
            console.log("Attempting login with:", code);
             console.log("iam herr1 ");
            // ملاحظة: استبدل localhost بـ 10.0.2.2 إذا كنت تستخدم محاكي أندرويد
            const response = await fetch('http://192.168.1.37:9000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code, password: password })
            });
            console.log("iam herr1 ");
            const data = await response.json();

            console.log("iam herr");
            console.log("Data received:", data);
            if (data.success) {
              if (data.token) await AsyncStorage.setItem('token', data.token);
              if (data.name) await AsyncStorage.setItem('name', data.name);

                if (data.role === 'admin') {
                    // فتح رابط خارجي للأدمن
                    Linking.openURL('http://localhost:5174');
                } else {
                    // الانتقال لصفحة الطالب داخل التطبيق
                    console.log("iam ready ! ");
                   router.push('/StudentDashboard');
                }
            } else {
                setError(data.message);
                Alert.alert('خطأ في تسجيل الدخول', data.message); 
            }
        } catch (err) {
            console.error(err);
            Alert.alert('خطأ', 'تعذر الاتصال بالخادم. تأكد من تشغيل الـ Backend.');
        }
    }

    return (
        <View style={styles.loginCard}>
            <Text style={styles.title}>System Login</Text>
            <Text style={styles.subtext}>Enter your university credentials</Text>

            {/* حقل إدخال الكود الجامعي */}
            <TextInput
                style={styles.input}
                placeholder="University ID"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                value={code} // ربط القيمة بالـ State
                onChangeText={(text) => setCode(text)} // تحديث الـ State عند الكتابة
            />

            {/* حقل إدخال كلمة المرور */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry={true}
                value={password} // ربط القيمة بالـ State
                onChangeText={(text) => setPassword(text)} // تحديث الـ State عند الكتابة
            />

            {/* زر تسجيل الدخول */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.supportText}>
                For account issues, contact IT Support
            </Text>
        </View>
    );
}

// التنسيقات (Styles)
const styles = StyleSheet.create({
    loginCard: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 24,
        margin: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1a3c6e",
        marginBottom: 6,
        textAlign: "center",
    },
    subtext: {
        fontSize: 13,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d0d7e3",
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        color: "#222",
        marginBottom: 14,
        backgroundColor: "#f7f9fc",
    },
    button: {
        backgroundColor: "#1a3c6e",
        borderRadius: 8,
        paddingVertical: 13,
        alignItems: "center",
        marginBottom: 14,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    supportText: {
        fontSize: 12,
        color: "#888",
        textAlign: "center",
    },
});

export default LoginCard;