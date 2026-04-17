import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import { useNavigation } from "@react-navigation/native";
import  StudentDashboard  from '../../app/(tabs)/StudentDashboard';


import { useRouter } from 'expo-router'; // تأكد من الاستيراد

export default function LoginCard() {
  // تعريف الـ hook هنا داخل المكون مباشرة
  const router = useRouter(); 

  async function handleLogin(event) {
    console.log("Button Clicked");
    
    // الآن يمكنك استخدام الـ router هنا
    router.push("/StudentDashboard"); 
  }

//   return (
//     console.log("Button Clicked")
//   );
// }

// function LoginCard() {

//   const navigation = useNavigation();

//   async function handleLogin(event) {
//   console.log("Button Clicked");
//     event.preventDefault(); 
//      navigation.navigate( "Dashboard");
    // <StudentDashboard />

    // const id = document.getElementById('studentId').value;
    // const pass = document.getElementById('password').value;

    // const response = await fetch('http://localhost:3000/login', {
    //     method: 'post',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ student_id: id, password: pass })
    // });

    // const data = await response.json();

    // if (response.ok) {
    //     alert("Welcome " + (data.studentName || " student"));
    //      navigation("/Dashboard");
    // } else {
    //     alert("hello , " + data.message); 
    // }
// }

  return (
    <View style={styles.loginCard}>
      <Text style={styles.title}>System Login</Text>
      <Text style={styles.subtext}>Enter your university credentials</Text>

      <TextInput
        style={styles.input}
        placeholder="University ID"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.supportText}>
        For account issues, contact IT Support
      </Text>
    </View>
  );
}

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

// export default LoginCard;
