import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import Logo from "../../assets/images/logo.png"
import { Redirect } from "expo-router";
export default function Index() {
  const [ready, setReady] = useState(true)
  const { width } = Dimensions.get("window")
  const pulse = useSharedValue(10)
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: pulse.value
      }
    ]
  }))
  useEffect(() => {
    pulse.value = withTiming(0, { duration: 5000 })
    async function prepare() {
      await new Promise((r) => setTimeout(r, 5000));
      setReady(true);
    }
    prepare();
  }, [])
  return (
    <View className="flex-1" style={styles.container}>
      <Animated.Image source={Logo} resizeMode={"contain"} entering={FadeInUp.delay(200)} style={[{ width: width - 40, height: 250 }, pulseStyle]} />
      {!ready ? (
        <>
          <ActivityIndicator size={30} />
        </>
      ) : (
        <>
          <Redirect href={"/home"} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
