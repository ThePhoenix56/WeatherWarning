import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text } from "react-native";

interface Warning {
  id: string;
  title: string;
  description: string;
  severity: string;
}

export default function WeatherWarning({ warning }: { warning: Warning }) {
  return (
    <LinearGradient
      colors={["#387c6d", "#3b5998", "#198815"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.card,
        { borderLeftColor: getSeverityColor(warning.severity) },
      ]}
    >
      <Text style={styles.title}>{warning.title}</Text>
      <Text style={styles.description}>{warning.description}</Text>
    </LinearGradient>
  );
}

function getSeverityColor(severity: string) {
  const colors: { [key: string]: string } = {
    yellow: "yellow",
    orange: "orange",
    red: "red",
  };
  return colors[severity] || "gray";
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderLeftWidth: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  description: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
});
