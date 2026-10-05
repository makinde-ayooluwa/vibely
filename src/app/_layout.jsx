import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "../../global.css";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";

export default function RootLayout() {
    const [loaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  if (!loaded) {
    return null;
  }
  return <Stack>
    <Stack.Screen name="index" options={{
      headerShown: true,
      headerTitle: ({ }) => (
        <Image
          source={require("@/assets/images/logo.png")}
          style={{
            width: 100,
            height: 40,
          }}
          contentFit="contain"
        />
      ),
      headerRight: ({ }) => (
        <Ionicons name="menu" size={28} color="#000" style={{
          borderWidth: 1,
          padding: 4,
          borderRadius: 50,
          backgroundColor: "rgba(244, 242, 242, 1)"
        }} />
      )
    }} />
  </Stack>;
}
