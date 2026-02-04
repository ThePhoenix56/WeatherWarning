import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text } from "react-native";

interface Warning {
  id: string;
  title: string;
  description: string;
  severity: string;
  approximateStart: number | string;
  approximateEnd: number | string;
}

export default function WeatherWarning({ warning }: { warning: Warning }) {
  const startText = formatSwedishDate(warning.approximateStart);
  const endText = formatSwedishDate(warning.approximateEnd);

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
      <Text style={styles.time}>Börjar: {startText}</Text>
      <Text style={styles.time}>Slutar: {endText}</Text>
    </LinearGradient>
  );
}

function formatSwedishDate(value: number | string): string {
  const rawValue =
    typeof value === "string"
      ? value
          .replace(/^Börjar:\s*/i, "")
          .replace(/^Slutar:\s*/i, "")
          .trim()
      : value;

  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) {
    return "Okänt datum";
  }

  const datePart = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

  return `${datePart} kl. ${timePart} svensk tid`;
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
  time: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 6,
  },
});
