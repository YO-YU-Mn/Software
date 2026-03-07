// import { View, StyleSheet, ScrollView } from "react-native";
// import TopBanner from "../components/Login/TopBanner";
// import Header from "../components/Login/Header";
// import HeroSection from "../components/Login/HeroSection";
// import NewsSection from "../components/Login/NewsSection";
// import Footer from "../components/Login/Footer";

// function LandingPage() {
//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <TopBanner />
//       <Header />
//       <HeroSection />
//       <NewsSection />
//       <Footer />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#eef2f7",
//   },
//   content: {
//     flexGrow: 1,
//   },
// });

// export default LandingPage;


import React, {useState} from "react";
import {View, TextInput, Button, Text} from "react-native";
import {login} from "../services/api";

export default function LoginScreen() {

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const handleLogin = async () => {
  

// const res = await login(email,password)

// console.log(res)

}

return(

<View>

<TextInput
placeholder="Email"
onChangeText={setEmail}
/>

<TextInput
placeholder="Password"
secureTextEntry
onChangeText={setPassword}
/>

<Button
title="Login"
onPress={handleLogin}
/>

</View>

)

}

