import { Ionicons } from "@expo/vector-icons";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-red-400 px-5" style={styles.container}>
      <Text>Edit src/app/index.jsx to edit this screen.</Text>
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
