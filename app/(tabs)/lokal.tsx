import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text } from "react-native";

export default function Lokal() {
  return (
    <LinearGradient
      colors={["#387c6d", "#3b5998", "#198815"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={[styles.text, { color: "white" }]}>Varningar i lokala området</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    color: "white",
  },
});
