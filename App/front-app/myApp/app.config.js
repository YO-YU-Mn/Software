import 'dotenv/config';

export default {
  expo: {
    name: "myApp",
    slug: "reg",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.softwareteam.reg",
      infoPlist: {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    android: {
      config: {
        usesCleartextTraffic: true
      },
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        "android.permission.RECORD_AUDIO"
      ],
      package: "com.softwareteam.reg"
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.1.4:9000",
      eas: {
        projectId: "c8678b8d-372f-411b-ade8-857721326363"
      },
      router: {}
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "يحتاج التطبيق للوصول إلى صورك لتعيين صورة الملف الشخصي.",
          cameraPermission: "يحتاج التطبيق للكاميرا لالتقاط صورة الملف الشخصي."
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    owner: "softwareteam"
  }
};
