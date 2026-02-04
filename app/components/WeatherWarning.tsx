import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text } from "react-native";
import { formatDate, getText, useSettings } from "../context/SettingsContext";

interface WarningData {
  id: string;
  title: {
    sv: string;
    en: string;
  };
  description: string;
  severity: string;
  approximateStart: number | string;
  approximateEnd: number | string;
}

export default function WeatherWarning({ warning }: { warning: WarningData }) {
  const { language } = useSettings();
  const startText = formatDate(warning.approximateStart, language);
  const endText = formatDate(warning.approximateEnd, language);
  const displayTitle = getText(warning.title.sv, warning.title.en, language);

  const startsLabel = language === "en" ? "Starts:" : "Börjar:";
  const endsLabel = language === "en" ? "Ends:" : "Slutar:";

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
      <Text style={styles.title}>{displayTitle}</Text>
      <Text style={styles.description}>{warning.description}</Text>
      <Text style={styles.time}>
        {startsLabel} {startText}
      </Text>
      <Text style={styles.time}>
        {endsLabel} {endText}
      </Text>
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
